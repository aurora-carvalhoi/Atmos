const router = require("express").Router();
const processosController = require("../controllers/processosController")

router.get("/",processosController.buscar)
router.get("/listar", processosController.listarProcessos);

module.exports = router;
