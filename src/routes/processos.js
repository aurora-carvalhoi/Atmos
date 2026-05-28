const router = require("express").Router();
const processosController = require("../controllers/processosController")

router.get("/listar", processosController.listarProcessos);

module.exports = router;
