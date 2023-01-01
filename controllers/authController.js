const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Member = require('./../models/usermodel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
const IntaSend = require('intasend-node');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (member, statusCode, req, res) => {
  const token = signToken(member._id);
  // console.log(member);
  // req.body.member = member;
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  member.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      member,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const intasend = new IntaSend(/*...Authenticate*/);

  let wallets = intasend.wallets();
  wallets
    .create({
      label: 'NodeJS-SDK-TEST',
      wallet_type: 'WORKING',
      currency: 'KES',
      can_disburse: false,
    })
    .then((resp) => {
      console.log(`Response: ${JSON.stringify(resp)}`);
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    });
  const newUser = await Member.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if member exists && password is correct
  const member = await Member.findOne({ email }).select('+password');

  if (!member || !(await member.correctPassword(password, member.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(member, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if member still exists
  const currentUser = await Member.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The member belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if member changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.member = currentUser;

  res.locals.member = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      // 2) Check if member still exists
      const currentUser = await Member.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if member changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // console.log(currentUser);
      // THERE IS A LOGGED IN USER
      req.member = currentUser;
      res.locals.member = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='member'
    if (!roles.includes(req.member.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get member based on POSTed email
  const member = await Member.findOne({ email: req.body.email });
  if (!member) {
    return next(new AppError('There is no member with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = member.createPasswordResetToken();
  await member.save({ validateBeforeSave: false });

  // 3) Send it to member's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/members/resetPassword/${resetToken}`;
    await new Email(member, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    member.passwordResetToken = undefined;
    member.passwordResetExpires = undefined;
    await member.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get member based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const member = awaitMember.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is member, set the new password
  if (!member) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  member.password = req.body.password;
  member.passwordConfirm = req.body.passwordConfirm;
  member.passwordResetToken = undefined;
  member.passwordResetExpires = undefined;
  await member.save();

  // 3) Update changedPasswordAt property for the member
  // 4) Log the member in, send JWT
  createSendToken(member, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get member from collection
  const member = awaitMember.findById(req.member.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (
    !(await member.correctPassword(req.body.passwordCurrent, member.password))
  ) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  member.password = req.body.password;
  member.passwordConfirm = req.body.passwordConfirm;
  await member.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log member in, send JWT
  createSendToken(member, 200, req, res);
});
