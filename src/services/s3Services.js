const {
  S3Client,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const client = new S3Client({

  region: process.env.aws_region,

  credentials: {

    accessKeyId:
      process.env.aws_access_key_id,

    secretAccessKey:
      process.env.aws_secret_access_key,

    sessionToken:
      process.env.aws_session_token
  }
});

async function buscarJson(bucket, key) {

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  const response = await client.send(command);

  const jsonString =
    await response.Body.transformToString();

  return JSON.parse(jsonString);
}

module.exports = {
  buscarJson
};