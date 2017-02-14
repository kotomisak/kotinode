var fs = require('fs');
var kotiConfig = require('config.json')('./app/config/config.json', process.env.NODE_ENV == 'dev' ? 'development' : 'production');
var nconf = require('nconf');
var logger = require('../utils/logger.js');
var nodemailer = require('nodemailer');


/**
 * https://docs.rosti.cz/emails/
 * https://nodemailer.com/about/
 * https://nodemailer.com/smtp/
 * http://wiki.rosti.cz/e-maily
 * http://blog.rosti.cz/novy-smtp-server/
 * @param req
 * @param res
 */
exports.notifyEmail = function (req, res) {
    logger.log(req, "exports.sendNotification");
    nconf.file('mail', './app/config/config.email.json');
    var apiKey = req.headers['apikey'];
    if (nconf.get('rosti') === undefined) {
        res.status(500).json({"message": "Email config is missing!"})
    } else if (apiKey === undefined) {
        res.status(401).json({"message": "Missing or incomplete authentication parameters"})
    } else if (kotiConfig.api_key === apiKey) {

        var transporter = nodemailer.createTransport({
            host: nconf.get('rosti').smtp.host,
            port: nconf.get('rosti').smtp.port,
            requireTLS: true,
            auth: {
                user: nconf.get('rosti').smtp.user,
                pass: nconf.get('rosti').smtp.pass
            },
            debug: process.env.NODE_ENV == 'dev',
        });

        var payload = req.body
        if (payload.to !== undefined
            && payload.subject !== undefined
            && (payload.text !== undefined /*|| payload.html!==undefined*/)) {
            var mailOptions = {
                from: nconf.get('rosti').smtp.sender, // sender address
                to: payload.to, // list of receivers
                subject: payload.subject, // Subject line
                text: payload.text //, // plaintext body
                //html: '<b>Yo dude! ✔</b>' // You can choose to send an HTML body instead
            };


            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    logger.log(req, error);
                    res.status(500).json({"message": 'Email server is not ready to send email now.'});
                } else {
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.status(500).json({"message": 'Unexpected error when sending email'});
                        } else {
                            console.log('Message sent: ' + info.response);
                            res.status(200).json({"message": info.response});
                        }
                        ;
                    });
                }
            });
        } else {
            res.status(401).json({"message": "Missing or incomplete message parameters in body!"})
        }
    } else {
        res.status(403).json({"message": "Missing permissions!"})
    }

};
