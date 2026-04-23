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

function listarEmpresasCadastradas(req, res){
    empresaModel.listarEmpresasCadastradas().then((resultado) => {
        res.status(200).json(resultado)
    })
}

function cadastrar(req, res) {
    var { 
        nome, responsavel, cnpj, email, telefoneCelular, 
        cep, logradouro, bairro, cidade, uf, numero, 
        status, ddd 
    } = req.body;

    if (!nome || !cnpj || !email || !cep || !numero) {
        res.status(400).send("Campos obrigatórios não preenchidos (Nome, CNPJ, Email, CEP ou Número)");
    } else {
        empresaModel.cadastrar(nome, responsavel, cnpj, email, telefoneCelular, cep, logradouro, bairro, cidade, uf, numero, status, ddd)
            .then((resultado) => {
                res.status(201).json(resultado);
            }).catch((erro) => {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listar,
    listarRecentes,
    listarEmpresasCadastradas,
    cadastrar
}