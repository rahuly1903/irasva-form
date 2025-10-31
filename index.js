const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const FormData = require("./models/formData");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;
// const fs = require("fs");

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI,{dbName: process.env.DB_NAME })
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SENDER,
    pass: process.env.PASSWORD,
  },
  secure: true,
});

const mailData = {
  from: process.env.SENDER, // sender address
  to: process.env.RECEIVER, // list of receivers
  subject: "Test Mail",
  text: "",
  html: `<b>Test Mail</b>`,
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
  const formPayload = { name: "John Doe New One", email: "john.doe@example.com", message: "Hello, this is a test message" };
  const newEntry = new FormData({ formData: formPayload });
  newEntry.save().then(() => {
    res.send({ msg: "Form data saved successfully" });
  }).catch((err) => {
    res.send({ msg: `Error in saving form data - ${err}` });
  });
});

function sendMailFunction(req, res, mail_subject) {
  let html_data = `<h2>${mail_subject}</h2>`;
  const req_data = req.body;
  const formPayload = { ...req_data };
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
  const newEntry = new FormData({ formData: formPayload });
  newEntry.save().then(() => {
    res.send({ msg: "Form data saved successfully" });
  }).catch((err) => {
    res.send({ msg: `Error in saving form data - ${err}` });
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

app.post("/api/v1/book-an-appointment", (req, res) => {
  const mail_subject = "Book an appointment";
  sendMailFunction(req, res, mail_subject);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
