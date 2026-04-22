const empresaModel = require("../models/empresaModel")

function listar(req, res){
    empresaModel.listar().then((resultado) => {
        res.status(200).json(resultado)
    })
}

function listarRecentes(req, res){
    empresaModel.listarRecentes().then((resultado) => {
        res.status(200).json(resultado)
    })
}

module.exports = {
    listar,
    listarRecentes
}