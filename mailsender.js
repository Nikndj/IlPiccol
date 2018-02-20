var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'admpiccol@gmail.com',
        pass: 'adminilpiccol',
    },
});

module.exports = function sendMail(to, subject, message) {
    var mailOptions = {
        from: 'admpiccol@gmail.com',
        to,
        subject,
        text: message,
    };

    transport.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
    });
};