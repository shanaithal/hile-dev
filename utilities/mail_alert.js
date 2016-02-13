var nodemailer = require('nodemailer');
var fs = require('fs');

// Configuration file to import the app Specific Password and sender mail
var config = require('../config');

var transport = nodemailer.createTransport({
     // in case it is a well known service you can simply name it. No need of host and ports
     // to see the list of well known services you can visit https://github.com/nodemailer/nodemailer-wellknown#supported-services
    service: 'gmail',
    auth: {
        user: config.mailAlert.senderMail,
        pass: config.mailAlert.appSpecificPassword // this should be the Application Specific Password else it wont work
    }
});

var MAILClient = function () {
    return Object.create(MAILClient.prototype);
};

MAILClient.prototype.triggerMail = function (buzz) {

    /*

    This part will be applicable when we will be sending html mails
    obviously you can send normal text emails,
    but html emails are pretty awesome

    fs.readFile('test.html', 'utf8', function (err, file) {
        if (err) {
            console.log(err);
        } else {
            transport.sendMail({
                from: 'suryadeep10@gmail.com',
                to: 'suryadeep10@gmail.com',
                subject: 'test',
                html: file
            }, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            })

        }
    })
    */

    User.findById(buzz.product_owner_id, function (err, user) {
        if (err) {
            console.log(err);
        } else {

            var buzzer_mail = buzz.buzzer_mail;
            var admin_mail = '';
            var buzzed_user_mail = user.email;
            // for sending mail to the buzzer
            transport.sendMail({
                from: config.mailAlert.senderMail,
                to: buzzer_mail,
                subject: 'test',
                text: 'Test email for buzzer'
            }, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            });

            // for sending mail to the buzzed person
            transport.sendMail({
                from: config.mailAlert.senderMail,
                to: buzzed_user_mail,
                subject: 'test',
                text: 'Test Email buzzed person'
            }, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            });

            // for sending mail to the admin
            transport.sendMail({
                from: config.mailAlert.senderMail,
                to: admin_mail,
                subject: 'test',
                text: 'Test email admin'
            }, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);
                }
            });

        }
    });
}

module.exports = MAILClient;
