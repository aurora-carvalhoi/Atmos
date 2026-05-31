require("dotenv").config();

const { buscarJson } = require("../services/s3Services");

var cacheJSON = null;

async function carregarJSON() {
  try {
    cacheJSON = await buscarJson(
      process.env.bucket_name,
      "dados_csv/Json_s3.json"
    );
    console.log("JSON carregado com sucesso");
  } catch (erro) {
    console.error("Erro", erro);
  }
}

function buscarDados(req, res) {
  if (!cacheJSON) {
    return res.status(503).json({
    });
  }
  res.json(cacheJSON);
}

carregarJSON();

setInterval(() => {
  carregarJSON();
}, 20 * 60 * 1000);

module.exports = {buscarDados};