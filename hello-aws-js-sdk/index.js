const REGION = "ap-northeast-1";

// S3 操作に使用するコマンドを AWS JS SDK からインポート
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import http from "http";　// HTTP サーバ
// S3 操作用のヘルパークライアントオブジェクト
import { s3Client } from "./libs/s3Client.js";

//Pollysynthesizeのソースコードからコピー
const { StartSpeechSynthesisTaskCommand } = require("@aws-sdk/client-polly");
const { PollyClient } =require( "@aws-sdk/client-polly");
const pollyClient = new PollyClient({ region: REGION });　// Set the AWS Region.
var params = {
  OutputFormat: "mp3",
  OutputS3BucketName: "okihisa20230222",
  Text: "このたびのトルコでの地震で被災された皆様に対し心よりお見舞い申し上げます。",
  TextType: "text",
  VoiceId: "Takumi",
  SampleRate: "24000",
};

async function listBuckets() {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log("バケットリスト: ", data.Buckets);
    const polly_data = await pollyClient.send(new StartSpeechSynthesisTaskCommand(params));
    console.log("Success, audio file added " + param.OutputS3BucketName);
    return data.Buckets;
  } catch (err) {
    console.log("エラー: ", err);
    return "error!";
  }
}

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(await listBuckets()));
  })
  .listen(8080);
