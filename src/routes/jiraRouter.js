var express = require("express");
var router = express.Router();

var jiraController = require("../controllers/jiraController")

router.get("/testeConexao", function (req, res) {
    jiraController.testeConexao(req, res);
})

router.get("/chamadosSemAtribuicao", function(req, res){
    jiraController.chamadosSemAtribuicao(req, res);
})

router.get("/buscarTempoResolucao", function(req, res){
    jiraController.buscarTempoResolucao(req, res)
})

router.get("/distribuicaoPorContribuidor", function(req, res){
    jiraController.distribuicaoPorContribuidor(req, res)
})

module.exports = router;

