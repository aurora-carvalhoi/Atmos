var express = require("express");
var router = express.Router();

var funcionarioAtmosController = require("../controllers/funcionarioAtmosController");

router.post("/autenticar", function (req, res) {
    funcionarioAtmosController.autenticar(req, res);
});

module.exports = router;
