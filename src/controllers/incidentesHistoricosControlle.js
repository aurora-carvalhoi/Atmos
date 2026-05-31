const s3Service = require("../services/s3Services");

async function incidentesHistoricos(req, res) {

  try {

    const arquivo =
      req.query.arquivo;

    const empresa =
      req.query.empresa;

    if (!arquivo) {
      return res.status(400).json({
        erro: "Arquivo não informado"
      });
    }

    if (!empresa) {

      return res.status(400).json({
        erro: "Empresa não informada"
      });

    }

    const key =

      `client/${empresa}/historico/${arquivo}`;

    const dados =
      await s3Service.buscarJson(
        process.env.BUCKET_NAME,
        key
      );

    res.json(dados);

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: "Erro ao buscar incidentes"
    });

  }
}


module.exports = {
    incidentesHistoricos
}