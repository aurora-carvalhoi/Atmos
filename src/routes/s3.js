const express = require("express");

const router = express.Router();

const s3Controller =
  require("../controllers/s3Controller");

router.get(
  "/dados",
  s3Controller.buscarDados
);

router.get(
  "/servidores",
  s3Controller.listarServidores
);

module.exports = router;
