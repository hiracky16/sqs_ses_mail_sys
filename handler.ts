import { SQSHandler, SQSRecord, SQSEvent } from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import nodemailer from "nodemailer";

const ses = new AWS.SES({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY,
    region: "ap-south-1",
    apiVersion: '2010-12-01'
});

const transporter = nodemailer.createTransport({ SES: ses });

export const mail: SQSHandler = async (event: SQSEvent) => {
  const addresses: string[] = event.Records.map((r: SQSRecord) => {
    return r.body;
  });
  const params = {
    from: process.env.SEND_ADDRESS,
    to: addresses,
    subject: "Email Testing",
    html: "<h1>Title</h1>"
  };

  console.log(params);

  try {
    await transporter.sendMail(params)
  } catch (e) {
    console.log(e);
  }
};
