require("dotenv").config();

const { buscarJson, listarChaves } = require("../services/s3Services");

var cacheJSON = null;
var cachePorEmpresa = {};

async function carregarJSON(req, res) {
  try {
    var nomeEmpresa = req.params.empresa;
    var key = nomeEmpresa
      ? `client/${nomeEmpresa}/client.json`
      : "dados_csv/Json_s3.json";

    var dados = await buscarJson(process.env.bucket_name, key);

    if (nomeEmpresa) {
      cachePorEmpresa[nomeEmpresa] = dados;
    } else {
      cacheJSON = dados;
    }

    if (res) {
      res.json(dados);
    }

    return dados;
  } catch (erro) {
    console.error("Erro ao carregar JSON do S3", erro);

    if (res) {
      res.status(500).json({
        erro: "Erro ao carregar JSON do S3"
      });
    }

    return null;
  }
}

async function buscarDados(req, res) {
  if (cacheJSON) {
    return res.json(cacheJSON);
  }

  var dados = await carregarJSON(req, null);

  if (!dados) {
    return res.status(503).json({});
  }

  res.json(dados);
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

module.exports = {
  buscarDados,
  carregarJSON,
  listarServidores
};
