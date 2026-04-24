var funcionarioAtmosModel = require("../models/funcionarioAtmosModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) {
        return res.status(400).send("Email não informado.");
    }
    if (!senha) {
        return res.status(400).send("Senha não informada.");
    }

    funcionarioAtmosModel.autenticar(email, senha)
        .then(function (resultado) {
            console.log("funcionarioAtmosController.autenticar() >> resultados:", resultado.length);

            if (resultado.length == 1) {
                return res.json({
                    id: resultado[0].idFuncionario,
                    nome: resultado[0].nome,
                    email: resultado[0].email,
                    cargo: resultado[0].cargo
                });
            }

            if (resultado.length == 0) {
                return res.status(403).send("Credenciais inválidas ou acesso inativo.");
            }

            return res.status(403).send("Mais de um registro com as mesmas credenciais.");
        })
        .catch(function (erro) {
            console.error("Erro no login ADM:", erro);
            res.status(500).json(erro.sqlMessage || "Erro interno.");
        });
}

module.exports = { autenticar };
