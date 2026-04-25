// sessão
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var tipo = sessionStorage.TIPO_USUARIO;
    var empresa = sessionStorage.FKEMPRESA;
    var idUsuario = sessionStorage.IDUSUARIO;
    var status = sessionStorage.STATUS_USUARIO;
    var tipousuario = sessionStorage.TIPO_USUARIO

    var nomeUsuario = document.getElementById("usuarionome");
    var emailUsuario = document.getElementById('usuarioemail')
    var imgUsuario = document.getElementById('usarioimagem')

    if (email != null && nome != null ||
        tipo != null && empresa != null ||
        idUsuario != null && tipousuario != null ||
        status != null && status == 'Ativo'
    ) {
        var inciais = nome.split(" ")[0].split("")[0] + nome.split(" ")[1].split("")[0]
        nomeUsuario.innerHTML = nome;
        emailUsuario.innerHTML = email;
        imgUsuario.innerHTML = `<span style="font-weight: 600">${inciais}</span>`
        
    } else {
        window.location = "../login.html";
    }
}

//function limparSessao() {
  //  sessionStorage.clear();
  //  window.location = "../login.html";
//}

// carregamento (loading)
function aguardar() {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    var divAguardar = document.getElementById("div_aguardar");
    divAguardar.style.display = "none";

    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.style.display = "flex";
        divErrosLogin.innerHTML = texto;
    }
}

validarSessao()