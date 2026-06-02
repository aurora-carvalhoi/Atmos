const express = require("express");

const router = express.Router();

const s3Controller =
  require("../controllers/s3Controller");

router.get(
  "/dados/:empresa",
  s3Controller.carregarJSON
);

module.exports = router;