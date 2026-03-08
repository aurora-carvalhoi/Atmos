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

module.exports = router;

