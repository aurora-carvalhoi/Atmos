var express = require("express");
var router = express.Router();

var analiseCargaController = require("../controllers/analiseCargaController");

router.get("/kpis", function (req, res) {
    analiseCargaController.buscarKpis(req, res);
});

router.get("/requisicoes-tempo", function (req, res) {
    analiseCargaController.buscarRequisicoesTempo(req, res);
});

router.get("/eventos-acessos", function (req, res) {
    analiseCargaController.buscarEventosAcessos(req, res);
});

router.get("/heatmap", function (req, res) {
    analiseCargaController.buscarHeatmap(req, res);
});

router.get("/tendencia", function (req, res) {
    analiseCargaController.buscarTendencia(req, res);
});

module.exports = router;
