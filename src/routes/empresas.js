const router = require("express").Router();
const empresasController = require("../controllers/empresasController")

router.get("/",empresasController.listar)
router.get("/listar",function(req, res){
    empresasController.listar(req, res)
})

router.get("/", empresasController.listarRecentes)
router.get("/listarRecentes",function (req, res){
    empresasController.listarRecentes(req, res)
})

router.get("/", empresasController.listarEmpresasCadastradas)
router.get("/listarEmpresasCadastradas", function(req, res){
    empresasController.listarEmpresasCadastradas(req, res)
})

router.post("/cadastrar", (req, res) => empresasController.cadastrar(req, res));
/* router.post("/", empresasController.cadastrar)
router.post("/cadastrar", function(req, res){
    empresasController.cadastrar(req, res)
}) */

module.exports = router;
