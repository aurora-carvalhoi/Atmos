var slaModel = require("../models/slaEmpresaModel");

function alterarTrm(req, res) {
    var fkEmpresa = req.body.fkEmpresa;
    var tmrH = req.body.tmrHoras;
    var tmrM = req.body.tmrMinutos;

    if (fkEmpresa == undefined) {
        res.status(400).send("fkEmpresa está undefined!");
    } else if (tmrH == undefined) {
        res.status(400).send("tmrHoras está undefined!");
    } else if (tmrM == undefined) {
        res.status(400).send("tmrMinutos está undefined!");
    } else {
        slaModel.alterarTrm(fkEmpresa, tmrH, tmrM)
            .then(function(resultado) {
                res.json(resultado);
            })
            .catch(function(erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao alterar o TMR! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function alterarQtdIncidente(req, res) {
    var fkEmpresa = req.body.fkEmpresa;
    var qtdIncidentes = req.body.qtdIncidentes;

    if (fkEmpresa == undefined) {
        res.status(400).send("fkEmpresa está undefined!");
    } else if (qtdIncidentes == undefined) {
        res.status(400).send("qtdIncidentes está undefined!");
    } else {
        slaModel.alterarQtdIncidente(fkEmpresa, qtdIncidentes)
            .then(function(resultado) {
                res.json(resultado);
            })
            .catch(function(erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao alterar a quantidade de incidentes! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function buscarSlaEmpresa(req, res) {
    var fkEmpresa = req.params.fkEmpresa;

    if (fkEmpresa == undefined) {
        res.status(400).send("fkEmpresa está undefined!");
    } else {
        slaModel.buscarSlaEmpresa(fkEmpresa)
            .then(function(resultado) {
                res.status(200).json(resultado);
            })
            .catch(function(erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao buscar a SLA! Erro: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    alterarTrm,
    alterarQtdIncidente,
    buscarSlaEmpresa
};