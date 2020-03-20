const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'andreslh90@gmail.com',
    subject: 'Welcome',
    text: `${name}, welcome`,
  });
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'andreslh90@gmail.com',
    subject: 'Bye',
    text: `${name}, bye`,
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
