import express from 'express';
import QRCode from 'qrcode';
import generatePayload from 'promptpay-qr';
import bodyParser from 'body-parser';
import _ from 'lodash';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
  console.log('server is running........');
});

app.post('/generateQR', (req, res) => {
  const amount = parseFloat(_.get(req, ['body', 'amount']));
  const mobileNumber = '0658286166';
  const payload = generatePayload(mobileNumber, { amount });
  const option = {
    color: {
      dark: '#000',
      light: '#fff',
    },
  };
  QRCode.toDataURL(payload, option, (err, url) => {
    if (err) {
      console.log('generate fail');
      return res.status(400).json({
        RespCode: 400,
        RespMessage: 'bad : ' + err,
      });
    } else {
      return res.status(200).json({
        RespCode: 200,
        RespMessage: 'good',
        Result: url,
      });
    }
  });
});

export default app;
