var jiraModel = require("../models/jiraModel")

function testeConexao(req, res) {
    jiraModel.testeConexao().then((resultado) => {
        res.status(200).json(resultado)
    });
}

// Usa async para esperar a esposta
async function chamadosSemAtribuicao(req, res) {
    console.log("Jira controller")
    // await que força ele a esperar
    var resposta = await jiraModel.chamadosSemAtribuicao()
    res.status(200).json(resposta)
}

async function buscarTempoResolucao(req, res) {
    var resposta = await jiraModel.buscarTempoResolucao()
    res.status(200).json(resposta)   
}

async function distribuicaoPorContribuidor(req, res) {
    var resposta = await jiraModel.distribuicaoPorContribuidor()
    res.status(200).json(resposta)   
}


module.exports = {
    testeConexao,
    chamadosSemAtribuicao,
    buscarTempoResolucao,
    distribuicaoPorContribuidor
}