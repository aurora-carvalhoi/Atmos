const procesosModel = require("../models/processoModel");
const s3Service = require("../services/s3Services");


function buscar(req, res){
    res.json({
        "message": "funcionou!"
    });
}


async function listarProcessos(req, res) {

  try {

    const key =
      "client/empresaX/snapshot_1779932998.json";

    const dados = await s3Service.buscarJson(
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
    buscar,
    listarProcessos
}