var servidoresModel = require("../models/servidoresModel")

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nomeServidor = req.body.nomeServidorVar;
    var numeroIdentificacao = req.body.numeroIdentificacaoVar;
    var sistemaOperacional = req.body.sistemaOperacionalVar;
    var enderecoIP = req.body.enderecoIPVar;
    var fkEmpresa = req.body.fkEmpresa;
    // Faça as validações dos valores
    if (nomeServidor == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (numeroIdentificacao == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (sistemaOperacional == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (enderecoIP == undefined) {
        res.status(400).send("Seu tipo de usuário está undefined!");
    }else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        servidoresModel.cadastrar(nomeServidor, numeroIdentificacao, sistemaOperacional, enderecoIP, fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrarComponentes(req, res){

    var Componentes = req.body.Componentes;
    var fkEmpresa = req.body.fkEmpresa;
    var fkServidor = req.body.fkServidor;

    // Faça as validações dos valores
    if (Componentes == undefined) {
        res.status(400).send("Seus componentes está undefined!");
    } else if (fkServidor == undefined) {
        res.status(400).send("Seu servidor está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        servidoresModel.cadastrarComponentes(Componentes, fkEmpresa, fkServidor)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}


module.exports = {
    cadastrar,
    cadastrarComponentes
}