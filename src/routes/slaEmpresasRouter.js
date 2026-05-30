var express = require("express");
var router = express.Router();

var slaController = require("../controllers/slaEmpresaController");

router.get("/buscarSlaEmpresa/:fkEmpresa", function (req, res) {
    slaController.buscarSlaEmpresa(req, res);
});

router.post("/alterarTrm", function (req, res) {
    slaController.alterarTrm(req, res);
});

router.post("/alterarQtdIncidente", function (req, res) {
    slaController.alterarQtdIncidente(req, res);
});

module.exports = router;