var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'athene.lviv@gmail.com',
        pass: 'atheneowl2017'
    }
});


function sendMAilWithoutHtml(theme ,text,toWhom) {
    var mailOptions = {
        from:'athene.lviv@gmail.com',
        to: toWhom,
        subject: theme,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


function sendHtmlMail(theme ,text,toWhom) {
    var mailOptions = {
        from:'athene.lviv@gmail.com',
        to: toWhom,
        subject: theme,
        text: "",
        html:text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

exports.sendMAilWithoutHtml=sendMAilWithoutHtml;
exports.sendHtmlMail=sendHtmlMail;