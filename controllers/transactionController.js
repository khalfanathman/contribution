const Transaction = require('../models/trasnactModel');
const axios = require('axios');
const factory = require('./handlerFactory');
const datetime = require('node-datetime');
const Mpesa = require('mpesa-node');
const catchAsync = require('../utils/catchAsync');
const unirest = require('unirest');
const { async } = require('regenerator-runtime');

const passKey = process.env.PASSKEY;
const shortcode = process.env.SHORTCODE;
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const dt = datetime.create();
const formated = dt.format('YmHMS');
const passString = shortcode + passKey + formated;
const mpesaApi = new Mpesa({
  consumerKey,
  consumerSecret,
});
const {
  accountBalance,
  b2b,
  b2c,
  c2bRegister,
  c2bSimulate,
  lipaNaMpesaOnline,
  lipaNaMpesaQuery,
  reversal,
  transactionStatus,
} = mpesaApi;
exports.setUserId = (req, res, next) => {
  // console.log(req.member);
  // console.log(req.params);

  if (!req.body.email) req.body.email = req.member.email;
  if (!req.body.contribution) req.body.contribution = req.params.contribId;
  if (!req.body.member) req.body.member = req.member.id;
  next();
};
exports.getPass = catchAsync(async (req, res) => {
  const basePass = Buffer.from(passString).toString('base64');
  return basePass;
});
exports.getAccestoken = catchAsync(async (req, res, next) => {
  // const tkn = Buffer.from(consumerKey + ':' + consumerSecret).toString(
  //   'base64'
  // );
  // console.log(
  //   Buffer.from(consumerKey + ':' + consumerSecret).toString('base64')
  // );
  try {
    let response = await mpesaApi.oAuth();

    req.body.access_token = response.data.access_token;
    next();
    // const req = response.data.access_token;
  } catch (error) {
    console.log(error);
  }
});
// exports.registerUrl = async (req, res) => {
//   try {
//     let url = '';
//     // let auth = 'Bearer ' + req.data;
//     // console.log(auth);
//     let reg = await mpesaApi.c2bRegister(
//       'http://197.232.61.252:49712/confirmation' + '/c2b/validation',
//       'http://197.232.61.252:49712/validation' + '/c2b/success'
//     );

//     res.status(200).json({
//       status: 'completed',
//       // console.log(res.data);
//     });

//     console.log(reg);
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.registerUrl = async (req, res, next) => {
//   try {
//     console.log(req.body.access_token);
//     const auth = JSON.stringify('Bearer ' + req.body.access_token);
//     let url = 'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl';

//     console.log(auth);
//     let reg = await axios.post(url, {
//       'Content-Type': 'application/json',
//       headers: {
//         Authorization: 'Bearer ' + req.body.access_token,
//       },
//     });

//     console.log(reg);

//     res.status(200).json(JSON.stringify({
//       ShortCode: 600988,
//       ResponseType: 'Completed',
//       ConfirmationURL: 'http://197.232.61.252:49712/confirmation',
//       ValidationURL: 'http://197.232.61.252:49712/validation',
//     }));
//   } catch (error) {
//     console.log(error.response.data);
//   }
// };
exports.registerUrl = async (req, res, next) => {
  let requ = unirest(
    'POST',
    'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl'
  )
    .headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + req.body.access_token,
    })
    .send(
      JSON.stringify({
        ShortCode: 600989,
        ResponseType: 'Completed',
        ConfirmationURL: 'http://197.232.61.252:49712/confirmation',
        ValidationURL: 'http://197.232.61.252:49712/validation',
      })
    )
    .end((res) => {
      if (res.error) throw new Error(res.error);
      console.log(res.raw_body);
      req.body.raw_body = res.raw_body;
    });
  res.status(200).json({
    status: 'succes',
    data: req.body.raw_body,
  });
};
exports.simulate = async (req, res) => {
  const sim = await mpesaApi.c2bSimulate(
    254708374149,
    1,
    'test1',
    'CustomerPayBillOnline',
    600984
  );
  console.log(sim.data);
};
exports.confirm = (req, res, next) => {
  console.log('......confirmation.....');
  console.log(req.body);
  next();
};
exports.validate = (req, res, next) => {
  console.log('......validation......');
  console.log(req.body);
  next();
};
// exports.balance = async (req, res, next) => {
//   const bal = await mpesaApi.accountBalance(
//     '600984',
//     '4',
//     'http:127.0.0.1:3000/api/v1/transactions/simulate',
//     'http:127.0.0.1:3000/api/v1/transactions/balance'
//   );
//   res.status(500).json({
//     status: 'success',
//     data: bal,
//   });
// };
exports.balance = async (req, res, next) => {
  let bal = unirest(
    'POST',
    'https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query'
  )
    .headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + req.body.access_token,
    })
    .send(
      JSON.stringify({
        Initiator: 'testapi',
        SecurityCredential:
          'P5n/73uAR5/pyYBgmUa1sMAmUIluz+vqqDs4EXT3N9FK/KgBdovlpag5mKzdT3Vxy3RI4lQVSpx4hk2iGrNCc83h8wQKqa4fA9FnfMiof/qPRJ5FDLSChqbCaFSEJJv9TaOJOoGCSmNQJOzGfMaEkkvRTwJvituXJ//1kNlwc2M3KKxe2IVqKMze+S7hMB0FaTo8tHfNquwBOKKnTuL9GoXLxXa+W4x+ZJ88tIv+2DsKD5mErGLpgtJxzv0cRsKXfxyuNB1OCOJG/ATidfM7ziSL5MSVfVD7PUhhu8cv8o/tMXKeQMl2ZOxh6RTMcI41itQmKGYk9rr8GEinNaGHkw==',
        CommandID: 'AccountBalance',
        PartyA: 600984,
        IdentifierType: '4',
        Remarks: 'thanks',
        QueueTimeOutURL: 'https://mydomain.com/AccountBalance/queue/',
        ResultURL: 'http://197.232.61.252:49712/result/',
      })
    )
    .end((res) => {
      if (res.error) throw new Error(res.error);
      console.log(res.raw_body);
    });
};
exports.timeout = (req, res, next) => {
  console.log('time out try again');
  res.status(500).json({
    status: 'Time-out',
    msg: 'try again',
  });
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
exports.sleepTime = async (ms) => {
  await sleep(1000);
};
exports.lipanampesa = catchAsync(async (req, res, next) => {
  const { phone, amount, sms } = req.body;
  const lipa = await mpesaApi.lipaNaMpesaOnline(
    phone,
    amount,
    'https://68c77c3bdc6ddd.lhrtunnel.link/resultrans',
    'bunGoWfG',
    'Lipa na mpesa online',
    'CustomerBuyGoodsOnline',
    shortcode,
    passKey
  );
  // console.log(lipa.data);
  // const dat = JSON.parse(lipa.config.data);
  // req.body.data = lipa.config.data;
  // req.body = lipa.data;
  // console.log(req.body);
  // // console.log(lipa.config.data);
  // res.status(200).json({
  //   status: 'success',
  //   data: dat,
  // });
  next();
});
exports.getResponse = async (req, res, next) => {
  try {
    console.log('console 1 response', req.body);
    const rez = JSON.stringify(req.body.Body);
    if (rez) {
      const rez1 = JSON.parse(rez);
      console.log(rez);
      const { ResultCode, MerchantRequestID, CheckoutRequestID, ResultDesc } =
        rez1.stkCallback;
      console.log(ResultDesc);
      console.log(MerchantRequestID);
      console.log(CheckoutRequestID);
      if (ResultCode != 0) {
        res.status(200).render('response', {
          tittle: 'Mpesa Response',
          success: true,
        });
      } else {
        createTransaction = factory.createOne(Transaction);
        next();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
exports.lipaNaMpesaQuery = async (req, res, next) => {
  console.log(req.body.CheckoutRequestID);
  try {
    const lipaQu = await mpesaApi.lipaNaMpesaQuery(
      req.body.CheckoutRequestID,
      shortcode,
      passKey
    );

    const dat = JSON.parse(lipaQu.config.data);
    // console.log(dat);
    // console.log(lipa.config.data);
    res.status(500).json({
      status: 'success',
      data: dat,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getAllTransactions = factory.getAll(Transaction);
exports.getOneTransaction = factory.getOne(Transaction);
exports.createTransaction = factory.createOne(Transaction);
exports.updateTransaction = factory.updateOne(Transaction);
exports.deleteTransaction = factory.deleteOne(Transaction);
