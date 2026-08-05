const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text) => {
    try {
console.log("Using Email:", process.env.EMAIL_USER);
console.log("Password Length:", process.env.EMAIL_PASS.length);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        console.log("✅ Email Sent Successfully");

    } catch (error) {

        console.error("❌ Email Sending Failed");
        console.error(error);

    }
};

module.exports = sendEmail;