#### Gulp
A gulpfile.js config file is included on the root folder, to help automate preprocess.

##### To install Gulp:
[node.js]{http://nodejs.org/} is required. Once you have node.js installed, navigate to the root folder and install Gulp and dependencies via `npm`:

```
npm install
```

##### Usage
* `gulp` to build the HTML, including image assets
* `gulp images` to imagemin the assets
* `gulp premail` to parse the email template
* `gulp email` to parse and send the email
* `gulp litmus` to parse and send the email to Litmus

##### Dependencies / Config
Premailer has a Ruby dependece, just install:
`gem install premailer`
`gem install hpricot`

Configure *testmail* creating a `testmail.js` file in the root folder with your settings, like:

```
module.exports = {

    subject: 'Testmail',
    to: [
      'bar@gmail.com'
    ],
    from: 'Foo <foo@163.com>',
    smtp: {
      auth: {
        user: 'foo@163.com',
        pass: '123456'
      },
      host: 'smtp.163.com',
      secureConnection: true,
      port: 465
    }
};
```
Check the documentation at https://github.com/Email-builder/email-builder-core#options

*This document is a work in progress. Specifications and dependencies can change without notice.*
