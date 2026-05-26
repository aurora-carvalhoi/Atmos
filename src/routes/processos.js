const router = require("express").Router();
const processosController = require("../controllers/processosController")

router.get("/",processosController.buscar)

module.exports = router;
