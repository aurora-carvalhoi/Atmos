const router = require("express").Router();
const incidentesHistoricos = require("../controllers/incidentesHistoricosControlle")

router.get("/listar", incidentesHistoricos.incidentesHistoricos);

module.exports = router;