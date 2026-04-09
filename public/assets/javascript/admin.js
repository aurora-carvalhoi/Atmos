//CÓDIGO DE TESTE 

const ATMOS_ADMIN_KEY = 'atmosAdminData';

function getDefaultAdminData() {
  return {
    empresas: [
      {
        id: cryptoRandomId(),
        nome: 'Atmos Monitoring Systems',
        segmento: 'Observabilidade climática',
        cnpj: '12.345.678/0001-90',
        responsavel: 'Geraldo Atmos',
        email: 'geraldo_adm@atmos.com',
        telefone: '(11) 4000-2525',
        cidade: 'São Paulo',
        uf: 'SP',
        status: 'Operando',
        criadoEm: new Date().toISOString().slice(0, 10)
      }
    ],
    colaboradores: [
      {
        id: cryptoRandomId(),
        nome: 'Celeste Rocha',
        email: 'celeste@atmos.com',
        papel: 'Administrador',
        equipe: 'NOC',
        status: 'Ativo',
        empresa: 'Atmos Monitoring Systems',
        criadoEm: new Date().toISOString().slice(0, 10)
      }
    ],
    servidores: [
      {
        id: cryptoRandomId(),
        nome: 'srv-api-clima-01',
        ip: '10.20.5.14',
        so: 'Ubuntu 24.04',
        identificacao: 'ATM-SP-API-01',
        empresa: 'Atmos Monitoring Systems',
        status: 'Estável',
        criadoEm: new Date().toISOString().slice(0, 10)
      }
    ],
      };
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function getAdminData() {
  try {
    const raw = localStorage.getItem(ATMOS_ADMIN_KEY);
    if (!raw) {
      const seed = getDefaultAdminData();
      localStorage.setItem(ATMOS_ADMIN_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (e) {
    const seed = getDefaultAdminData();
    localStorage.setItem(ATMOS_ADMIN_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveAdminData(data) {
  localStorage.setItem(ATMOS_ADMIN_KEY, JSON.stringify(data));
}

function getSessionUser() {
  const nome = sessionStorage.NOME_USUARIO || 'Geraldo Atmos';
  const email = sessionStorage.EMAIL_USUARIO || 'geraldo_adm@atmos.com';
  return { nome, email, inicial: nome.trim().charAt(0).toUpperCase() };
}

function hydrateUserBlocks() {
  const user = getSessionUser();
  document.querySelectorAll('[data-admin-user-name]').forEach(el => el.textContent = user.nome);
  document.querySelectorAll('[data-admin-user-email]').forEach(el => el.textContent = user.email);
  document.querySelectorAll('[data-admin-user-avatar]').forEach(el => el.textContent = user.inicial);
}

function formatDate(dateIso) {
  if (!dateIso) return '-';
  const [year, month, day] = dateIso.split('-');
  return `${day}/${month}/${year}`;
}

function showToast(title, message) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(window.__adminToastTimer);
  window.__adminToastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderTable(targetId, rows, columns, emptyMessage = 'Nenhum item cadastrado ainda.') {
  const target = document.getElementById(targetId);
  if (!target) return;

  if (!rows || rows.length === 0) {
    target.innerHTML = `<div class="estado-vazio">${emptyMessage}</div>`;
    return;
  }

  const header = columns.map(col => `<th>${col.label}</th>`).join('');
  const body = rows.map(row => `
    <tr>
      ${columns.map(col => `<td>${typeof col.render === 'function' ? col.render(row) : (row[col.key] ?? '-')}</td>`).join('')}
    </tr>
  `).join('');

  target.innerHTML = `
    <div class="envolve-tabela">
      <table class="tabela-admin">
        <thead><tr>${header}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function fillCompanyOptions() {
  const data = getAdminData();
  document.querySelectorAll('[data-company-select]').forEach(select => {
    const current = select.getAttribute('data-selected') || '';
    const options = data.empresas.map(empresa => {
      const selected = current === empresa.nome ? 'selected' : '';
      return `<option value="${empresa.nome}" ${selected}>${empresa.nome}</option>`;
    }).join('');
    select.innerHTML = `<option value="">Selecione a empresa</option>${options}`;
  });
}

function updateDashboard() {
  const data = getAdminData();
  setText('kpiEmpresas', String(data.empresas.length).padStart(2, '0'));
  setText('kpiColaboradores', String(data.colaboradores.length).padStart(2, '0'));
  setText('kpiServidores', String(data.servidores.length).padStart(2, '0'));

  renderTable('overviewEmpresas', data.empresas.slice(-4).reverse(), [
    { label: 'Empresa', key: 'nome' },
    { label: 'Responsável', key: 'responsavel' },
    { label: 'Cidade / UF', render: row => `${row.cidade || '-'} / ${row.uf || '-'}` },
    { label: 'Status', render: row => `<span class="etiqueta success">${row.status || 'Ativo'}</span>` }
  ], 'Nenhuma empresa cadastrada ainda.');

  renderTable('overviewInfra', data.servidores.slice(-5).reverse(), [
    { label: 'Servidor', key: 'nome' },
    { label: 'IP', key: 'ip' },
    { label: 'Sistema', key: 'so' },
    { label: 'Status', render: row => `<span class="etiqueta info">${row.status || 'Em análise'}</span>` }
  ], 'Nenhum servidor cadastrado ainda.');
}

function attachOverviewActions() {
  document.querySelectorAll('[data-go]').forEach(el => {
    el.addEventListener('click', () => {
      const url = el.getAttribute('data-go');
      if (url) window.location.href = url;
    });
  });
}

function upsertFromForm(formId, collectionName, transformer, afterSave) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = transformer(formData);
    const data = getAdminData();
    data[collectionName].unshift(payload);
    saveAdminData(data);
    fillCompanyOptions();
    if (typeof afterSave === 'function') {
      await afterSave(payload, formData);
    }
    form.reset();
    showToast('Cadastro salvo', `${payload.nome || 'Registro'} foi adicionado.`);
    renderCurrentPage();
  });
}

async function mirrorServidorToBackend(payload) {
  if (!sessionStorage.FKEMPRESA) return;
  try {
    await fetch('/servidores/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeServidorVar: payload.nome,
        numeroIdentificacaoVar: payload.identificacao,
        sistemaOperacionalVar: payload.so,
        enderecoIPVar: payload.ip,
        fkEmpresa: sessionStorage.FKEMPRESA
      })
    });
  } catch (_) {}
}

async function mirrorColaboradorToBackend(payload) {
  if (!sessionStorage.FKEMPRESA || !sessionStorage.ID_USUARIO) return;
  try {
    await fetch('/usuarios/cadastrarFuncionario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fkEmpresa: sessionStorage.FKEMPRESA,
        idSuperiorVar: sessionStorage.ID_USUARIO,
        nome: payload.nome,
        email: payload.email,
        dataNascimento: payload.dataNascimento,
        cpf: payload.documento,
        senha: payload.senha || 'Atmos@123'
      })
    });
  } catch (_) {}
}

function renderEmpresasPage() {
  const data = getAdminData();
  renderTable('empresasTable', data.empresas, [
    { label: 'Empresa', key: 'nome' },
    { label: 'Responsável', key: 'responsavel' },
    { label: 'Segmento', key: 'segmento' },
    { label: 'Contato', render: row => `${row.telefone}<br>${row.email}` },
    { label: 'Status', render: row => `<span class="etiqueta success">${row.status}</span>` }
  ]);
}

function renderColaboradoresPage() {
  const data = getAdminData();
  renderTable('colaboradoresTable', data.colaboradores, [
    { label: 'Nome', key: 'nome' },
    { label: 'E-mail', key: 'email' },
    { label: 'Papel', key: 'papel' },
    { label: 'Equipe', key: 'equipe' },
    { label: 'Status', render: row => `<span class="etiqueta info">${row.status}</span>` }
  ]);
}

function renderServidoresPage() {
  const data = getAdminData();
  renderTable('servidoresTable', data.servidores, [
    { label: 'Servidor', key: 'nome' },
    { label: 'IP', key: 'ip' },
    { label: 'Identificação', key: 'identificacao' },
    { label: 'Sistema', key: 'so' },
    { label: 'Status', render: row => `<span class="etiqueta info">${row.status}</span>` }
  ]);
}

function renderCurrentPage() {
  const page = document.body.dataset.page;
  if (page === 'home') updateDashboard();
  if (page === 'empresas') renderEmpresasPage();
  if (page === 'colaboradores') renderColaboradoresPage();
  if (page === 'servidores') renderServidoresPage();
}

function initPageForms() {
  upsertFromForm('empresaForm', 'empresas', (formData) => ({
    id: cryptoRandomId(),
    nome: formData.get('nome'),
    segmento: formData.get('segmento'),
    cnpj: formData.get('cnpj'),
    responsavel: formData.get('responsavel'),
    email: formData.get('email'),
    telefone: formData.get('telefone'),
    cidade: formData.get('cidade'),
    uf: formData.get('uf'),
    status: formData.get('status') || 'Operando',
    criadoEm: new Date().toISOString().slice(0, 10)
  }), () => closeCompanyModal());

  upsertFromForm('colaboradorForm', 'colaboradores', (formData) => ({
    id: cryptoRandomId(),
    nome: formData.get('nome'),
    email: formData.get('email'),
    papel: formData.get('papel'),
    equipe: formData.get('equipe'),
    empresa: formData.get('empresa'),
    documento: formData.get('documento'),
    dataNascimento: formData.get('dataNascimento'),
    senha: formData.get('senha'),
    status: formData.get('status') || 'Ativo',
    criadoEm: new Date().toISOString().slice(0, 10)
  }), mirrorColaboradorToBackend);

  upsertFromForm('servidorForm', 'servidores', (formData) => ({
    id: cryptoRandomId(),
    nome: formData.get('nome'),
    ip: formData.get('ip'),
    so: formData.get('so'),
    identificacao: formData.get('identificacao'),
    empresa: formData.get('empresa'),
    status: formData.get('status') || 'Estável',
    observacoes: formData.get('observacoes'),
    criadoEm: new Date().toISOString().slice(0, 10)
  }), mirrorServidorToBackend);

}

function openCompanyModal() {
  const modal = document.getElementById('companyModal');
  if (modal) modal.classList.add('open');
}

function closeCompanyModal() {
  const modal = document.getElementById('companyModal');
  if (modal) modal.classList.remove('open');
}

function hookModalActions() {
  document.querySelectorAll('[data-open-company-modal]').forEach(btn => btn.addEventListener('click', openCompanyModal));
  document.querySelectorAll('[data-close-company-modal]').forEach(btn => btn.addEventListener('click', closeCompanyModal));
  const modal = document.getElementById('companyModal');
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeCompanyModal();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  hydrateUserBlocks();
  fillCompanyOptions();
  renderCurrentPage();
  initPageForms();
  attachOverviewActions();
  hookModalActions();
});
