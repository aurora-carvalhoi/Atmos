const procesosModel = require("../models/processoModel");
const s3Service = require("../services/s3Services");

async function listarProcessos(req, res) {

  try {

    const server =
      req.query.server;

    const empresa =
      req.query.empresa;

    if (!server) {

      return res.status(400).json({
        erro: "Servidor não informado"
      });

    }

    if (!empresa) {

      return res.status(400).json({
        erro: "Empresa não informada"
      });

    }

    const key =

      `client/${empresa}/processos/servidor/${server}/snapshot_${server}.json`;

    const dados =
      await s3Service.buscarJson(
        process.env.BUCKET_NAME,
        key
      );

    res.json(dados);

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: "Erro ao buscar processos"
    });

  }

}



module.exports = {
    listarProcessos
}