const {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command
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

async function listarChaves(bucket) {
  var chaves = [];
  var continuationToken = undefined;

  do {
    var command = new ListObjectsV2Command({
      Bucket: bucket,
      ContinuationToken: continuationToken
    });

    var response = await client.send(command);
    var arquivos = response.Contents || [];

    for (var i = 0; i < arquivos.length; i++) {
      chaves.push(arquivos[i].Key);
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return chaves;
}

module.exports = {
  buscarJson,
  listarChaves
};
