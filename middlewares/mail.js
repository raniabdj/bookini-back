const nodemailer = require("nodemailer");

async function sendMail(req, res, next) {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: `${process.env.EMAIL}`, // generated ethereal user
            pass: `${process.env.PASSWORD_MAIL}`, // generated ethereal password
        },
    });
    
    let info = await transporter.sendMail({
        from: '"Ikbal Foo 👻" <ikbalwb1@gmail.com>', // sender address
        to: 'ikbalwb96@gmail.com', // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: '<h1>Hello world</h1>', // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    
    transporter.sendMail(info, (err, msg) => {
        if (err) {
            console.log(err);
        } else {
            console.log(msg);
    
            res.status(200).send("hell ya");
        }
    });

    next()

}


module.exports = {sendMail}