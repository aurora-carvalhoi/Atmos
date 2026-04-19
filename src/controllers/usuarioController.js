var usuarioModel = require("../models/usuarioModel");
//var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        res.json({
                            id: resultadoAutenticar[0].idUsuario,
                            email: resultadoAutenticar[0].email,
                            nome: resultadoAutenticar[0].nome,
                            fkEmpresa: resultadoAutenticar[0].empresaId
                        });




                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrarFuncionario(req, res) {
    var fkEmpresa = req.body.fkEmpresa;
    var idUsuario = req.body.idSuperiorVar;
    var nome = req.body.nome;
    var email = req.body.email;
    var dataNascimento = req.body.dataNascimento;
    var cpf = req.body.cpf;
    var senha = req.body.senha;


    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (dataNascimento == undefined) {
        res.status(400).send("Sua data de nascimento está undefined!");
    } else if (cpf == undefined) {
        res.status(400).send("Seu cpf está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {
        usuarioModel.cadastrarFuncionario(fkEmpresa, idUsuario, nome, email, dataNascimento, cpf, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrar(req, res) {
    var email = req.body.emailServer;
    var codigo = req.body.codigoServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (codigo == undefined) {
        res.status(400).send("Seu codigo está undefined!");
    } else {

        usuarioModel.cadastrar(email, codigo)
            .then(
                function (resultadoCadastrar) {
                    console.log(`\nResultados encontrados: ${resultadoCadastrar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoCadastrar)}`);

                    if (resultadoCadastrar.length == 1) {
                        console.log(resultadoCadastrar);

                        res.json({
                            id: resultadoCadastrar[0].idUsuario,
                            email: resultadoCadastrar[0].email,
                            fkEmpresa: resultadoCadastrar[0].empresaId
                        });

                    } else if (resultadoCadastrar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function finalizarCadastro(req, res) {
    var nome = req.body.nomeServer;
    var senha = req.body.senhaServer;
    var id = req.body.idServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (id == undefined) {
        res.status(400).send("Seu id está undefined!");
    } else {

        usuarioModel.finalizarCadastro(nome, senha, id)
        .then(function (resultado) {

            console.log("Update realizado");

            res.json({
                status: "ok"
            });

        }).catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
    }
}

function listarColaboradores(req, res){
    usuarioModel.listarColaboradores().then((resultado)=>{
        res.status(200).json(resultado);
    })
}

module.exports = {
    autenticar,
    cadastrar,
    cadastrarFuncionario,
    finalizarCadastro,
    listarColaboradores
}