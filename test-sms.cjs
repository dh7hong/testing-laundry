const dotenv = require('dotenv');
dotenv.config({ path: './.env.local' });

const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

if (!accountSid || !authToken) {
  throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set in .env.local');
}



const sendTestSMS = async () => {
  try {
    const message = await client.messages.create({
      body: 'Your verification code is [205678]',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+821097174966' // Replace with a valid South Korean phone number
    });
    console.log('Message sent successfully:', message.sid);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

sendTestSMS();
