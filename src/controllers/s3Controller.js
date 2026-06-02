require("dotenv").config();

const { buscarJson, listarChaves } = require("../services/s3Services");

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

async function listarServidores(req, res) {
  try {
    var chaves = await listarChaves(process.env.bucket_name);
    var hostnames = [];
    var servidores = [];

    for (var i = 0; i < chaves.length; i++) {
      var partes = chaves[i].split("/");
      var indiceServidor = partes.indexOf("servidor");

      if (indiceServidor >= 0 && partes[indiceServidor + 1]) {
        var hostname = partes[indiceServidor + 1];

        if (!hostnames.includes(hostname)) {
          hostnames.push(hostname);
          servidores.push({
            idServidor: servidores.length + 1,
            hostname: hostname
          });
        }
      }
    }

    res.json({
      hosts: servidores
    });
  } catch (erro) {
    console.error("Erro ao listar servidores no S3", erro);
    res.status(500).json({
      erro: "Erro ao listar servidores no S3"
    });
  }
}

carregarJSON();

setInterval(() => {
  carregarJSON();
}, 20 * 60 * 1000);

module.exports = {
  buscarDados,
  listarServidores
};
