const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;
// const fs = require("fs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  secure: true,
});

const mailData = {
  from: process.env.EMAIL, // sender address
  to: process.env.RECEIVER, // list of receivers
  subject: "કેમ છો ભાઈ",
  text: "",
  html: `<b>EDFJ CSV is updated. </b>`,
};

app.get("/", (req, res) => {
  res.send({ msg: "Welcome to Homepage" });
});

app.get("/send-mail", (req, res) => {
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      res.send({ msg: `Error in sending Mail - ${err}` });
    } else {
      res.send({ msg: `mail send successfully` });
    }
  });
});

function sendMailFunction(req, res, mail_subject) {
  let html_data = `<h2>${mail_subject}</h2>`;
  const req_data = req.body;

  for (let key in req_data) {
    // Check if the property is an own property of the object (not inherited)
    console.log(`${key}: ${req_data[key]}`);
    html_data += `<p>${key} : ${req_data[key]}</p>`;
  }
  mailData.html = html_data;
  mailData.subject = mail_subject;
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      res.send({ msg: `Error in sending Mail - ${err}` });
    } else {
      res.send({ msg: `mail send successfully` });
    }
  });
}

app.post("/api/v1/besopke", (req, res) => {
  const mail_subject = "Our Designs, Your Visions -- Besopke";
  sendMailFunction(req, res, mail_subject);
});

app.post("/api/v1/at-home-service", (req, res) => {
  const mail_subject = "We Bring The Store To You! -- At Home Service";
  sendMailFunction(req, res, mail_subject);
});

app.post("/api/v1/video-consult", (req, res) => {
  const mail_subject = "Let’s Connect Online -- Video consult";
  sendMailFunction(req, res, mail_subject);
});

app.post("/api/v1/store-visit", (req, res) => {
  const mail_subject = "Hello -- Store visit";
  sendMailFunction(req, res, mail_subject);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
