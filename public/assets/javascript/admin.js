function abrirModalEmpresa() {
  var modal = document.getElementById('companyModal');
  if (modal) {
    modal.classList.add('open');
  }
}

function fecharModalEmpresa() {
  var modal = document.getElementById('companyModal');
  if (modal) {
    modal.classList.remove('open');
  }
}

document.addEventListener('click', function (event) {
  var modal = document.getElementById('companyModal');

  if (!modal) {
    return;
  }

  if (event.target === modal) {
    fecharModalEmpresa();
  }

  if (event.target.hasAttribute('data-close-company-modal')) {
    fecharModalEmpresa();
  }
});
