const {
  S3Client,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

console.log("REGION:", process.env.aws_region);
console.log("BUCKET:", process.env.bucket_name);
console.log("KEY:", process.env.aws_access_key_id);
console.log("SECRET:", process.env.aws_secret_access_key?.substring(0, 10));
console.log("TOKEN:", process.env.aws_session_token?.substring(0, 20));

const s3 = new S3Client({
  region: process.env.aws_region,

  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token
  }
});

async function buscarAnalisePreditiva(req, res) {
  try {
    const empresa = req.query.empresa;

    if (!empresa) {
      return res.status(400).json({
        erro: "Empresa não informada"
      });
    }

    const key = `client/${empresa}.json`;

    console.log("Buscando arquivo:", key);

    const command = new GetObjectCommand({
      Bucket: process.env.bucket_name,
      Key: key
    });

    const response = await s3.send(command);

    const jsonString =
      await response.Body.transformToString();

    const dados = JSON.parse(jsonString);

    res.json(dados);
    console.log(dados)

  } catch (erro) {

    console.error(
      "Erro ao buscar análise preditiva:",
      erro
    );

    res.status(500).json({
      erro: "Erro ao buscar dados do S3",
      detalhe: erro.message
    });
  }
}

module.exports = {
  buscarAnalisePreditiva
};