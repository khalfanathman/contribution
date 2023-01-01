const IntaSend = require('intasend-node');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
exports.getAllPayments = async (req, res) => {
  // const account = await stripe.accounts.create({
  //   type: 'custom',
  //   country: 'US',
  //   email: 'jenny.rosen@example.com',
  //   capabilities: {
  //     card_payments: { requested: true },
  //     transfers: { requested: true },
  //   },
  // });
  req.headers.authorization = process.env.SECRET_KEY;
  console.log(req.headers.authorization);
  const intasend = new IntaSend(
    `${process.env.PUBLIC_KEY}`,
    `${process.env.SECRET_KEY}`,
    true // Test ? Set true for test environment
  );
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
  res.status(201).json({
    status: 'succes',
    wallets,
  });
};
exports.getOnePayment = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' rote note yet defined',
  });
};

exports.createPayment = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
exports.updatePayment = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
exports.deletePayment = (req, res) => {
  res.status(500).json({
    status: 'error',
    Message: ' route note yet defined',
  });
};
