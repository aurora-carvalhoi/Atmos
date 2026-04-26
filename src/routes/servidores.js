var express = require("express");
var router = express.Router();

var servidoresController = require("../controllers/servidoresController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    servidoresController.cadastrar(req, res);
})

router.post("/cadastrarComponentes", function (req, res) {
    servidoresController.cadastrarComponentes(req, res);
})

router.get("/listarServidores", function (req, res) {
    servidoresController.listarServidores(req, res);
})

router.get("/listarServidoresRecentes", function(req, res){
    servidoresController.listarServidoresRecentes(req, res);
})

router.get("/listarServidoresCadastrados", function(req, res){
    servidoresController.listarServidoresCadastrados(req, res);
})

router.post("/cadastrarServidor", function (req, res){
    servidoresController.cadastrarServidor(req, res);
})

module.exports = router;

