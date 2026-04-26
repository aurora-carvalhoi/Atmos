var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
});

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.patch("/finalizarCadastro", function (req, res) {
    usuarioController.finalizarCadastro(req, res);
});

// router.get("/listarColaboradores", function(req, res){
//     usuarioController.listarColaboradores(req, res);
// });

router.get("/listarColaboradoresCadastrados", function(req, res){
    usuarioController.listarColaboradoresCadastrados(req, res);
});

router.post("/cadastrarColaborador", function(req, res){
    usuarioController.cadastrarColaborador(req, res);
});


router.get("/listarColaboradoresEmpresa/:idEmpresa", function(req, res){
    usuarioController.listarColaboradoresEmpresa(req, res)
})

router.post("/alterarStatusColaborador", function(req, res){
    usuarioController.alterarStatusUsuario(req, res)
})


module.exports = router;