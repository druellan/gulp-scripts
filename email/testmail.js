module.exports = {

    subject: 'Email template test',
    to: [
      'to@address.com'
    ],
    from: 'test@test-com',
    smtp: {
      auth: {
        user: 'user',
        pass: 'pass'
      },
      host: 'imap.gmail.com',
      secureConnection: true,
      port: 465
    }

};