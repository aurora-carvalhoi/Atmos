var express = require("express");
var router = express.Router();

var analiseController = require("../controllers/analisePreditivaController");

router.get("/listar", analiseController.buscarAnalisePreditiva);

module.exports = router;

