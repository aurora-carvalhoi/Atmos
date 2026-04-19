const router = require("express").Router();
const empresasController = require("../controllers/empresasController")

router.get("/",empresasController.listar)
router.get("/listar",function(req, res){
    empresasController.listar(req, res)
})

module.exports = router;
