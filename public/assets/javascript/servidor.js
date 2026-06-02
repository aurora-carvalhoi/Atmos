async function buscarClient() {
  var empresa = sessionStorage.getItem("RAZAO_SOCIAL");
  var fkEmpresa = sessionStorage.FKEMPRESA;
  var nomeEmpresa = sessionStorage.getItem("RAZAO_SOCIAL");

  var resClient = await fetch(`/s3/dados/${empresa}`);
  var dataClient = await resClient.json();

  var dataTemp = { hosts: [] };
  try {
    var resTemp = await fetch(`/analisepreditiva/listar?empresa=${fkEmpresa}&nomeEmpresa=${nomeEmpresa}`);
    if (resTemp.ok) {
      dataTemp = await resTemp.json();
    }
  } catch (erro) {
    console.error("Erro ao buscar análise preditiva:", erro);
  }

  return { dataClient: dataClient, dataTemp: dataTemp };
}

var resultado = await buscarClient();
var dataClient = resultado.dataClient;
var dataTemp = resultado.dataTemp;

console.log(dataClient);
console.log(dataClient.empresas);

var mapTemperatura = {};
for (var i = 0; i < dataTemp.hosts.length; i++) {
  var host = dataTemp.hosts[i];
  var grafico = host.grafico;
  if (grafico && grafico.length > 0) {
    mapTemperatura[host.host_id] = grafico[grafico.length - 1].temperatura;
  }
}

var totalRegistros = dataClient.resumo.total_registros;
var hostsAtivos = dataClient.resumo.hosts_ativos;
var indiceUltimaLeitura = totalRegistros / hostsAtivos - 1;

var classesPorStatus = [
  "etiqueta-verde",
  "etiqueta-amarela",
  "etiqueta-vermelha",
];
var textosPorStatus = ["Oper.", "Aten.", "Crit."];
var coresPorNivel = ["#3879fc", "#f59e0b", "#dc2626"];

var LIMITES_ALERTA = {
  cpu: { atencao: 80, critico: 90 },
  ram: { atencao: 75, critico: 90 },
  disco: { atencao: 85, critico: 95 },
  temp: { atencao: 70, critico: 85 },
};

function nivelBarra(valor, tipo) {
  if (valor >= LIMITES_ALERTA[tipo].critico) {
    return 2;
  }
  if (valor >= LIMITES_ALERTA[tipo].atencao) {
    return 1;
  }
  return 0;
}

//Lista de Servidores
function listarServidor() {
  var linhasCriticos = "";
  var linhasAtencao = "";
  var linhasOperando = "";

  sessionStorage.NOME_SERVIDOR = dataClient.hosts[0].hostname;

  for (var i = 0; i < hostsAtivos; i++) {
    var servidor = dataClient.hosts[i];
    var metricas = servidor.metricas;

    var nivelCpu = nivelBarra(metricas.cpu_percentil_maquina, "cpu");
    var nivelRam = nivelBarra(metricas.ram_percentil_maquina, "ram");
    var nivelDisco = nivelBarra(
      metricas.disco_porcentagem[indiceUltimaLeitura],
      "disco",
    );

    var statusServidor = 0;
    if (nivelCpu >= 1 || nivelRam >= 1 || nivelDisco >= 1) {
      statusServidor = 1;
    }
    if (nivelCpu >= 2 || nivelRam >= 2 || nivelDisco >= 2) {
      statusServidor = 2;
    }

    var linhaServidor = `
      <tr onclick="selecionarServidor(this, ${i})">
        <td><span class="etiqueta-bold ${classesPorStatus[statusServidor]}"><span class="status-texto">${textosPorStatus[statusServidor]}</span></span></td>
        <td>
          <span class="nome-servidor">${servidor.hostname.toUpperCase()}</span>
          <span class="servidor-id">#${servidor.host_id}</span>
        </td>
        <td class="coluna-extra"><span class="end-ip coluna-extra">10.0.0.1</span></td>
        <td class="coluna-extra"><span class="nome-so coluna-extra">Ubuntu 22.04</span></td>
        <td>
          <div class="container-barra">
            <div class="barra"><div class="preenchimento" style="width:${metricas.cpu_percentil_maquina}%;background:${coresPorNivel[nivelCpu]}"></div></div>
            <span>${metricas.cpu_percentil_maquina}%</span>
          </div>
        </td>
        <td>
          <div class="container-barra">
            <div class="barra"><div class="preenchimento" style="width:${metricas.ram_percentil_maquina}%;background:${coresPorNivel[nivelRam]}"></div></div>
            <span>${metricas.ram_percentil_maquina}%</span>
          </div>
        </td>
        <td>
          <div class="container-barra">
            <div class="barra"><div class="preenchimento" style="width:${metricas.disco_porcentagem[indiceUltimaLeitura]}%;background:${coresPorNivel[nivelDisco]}"></div></div>
            <span>${metricas.disco_porcentagem[indiceUltimaLeitura]}%</span>
          </div>
        </td>
        <td class="coluna-extra">42h13min</td>
      </tr>
    `;
    if (statusServidor == 2) {
      linhasCriticos += linhaServidor;
    } else if (statusServidor == 1) {
      linhasAtencao += linhaServidor;
    } else {
      linhasOperando += linhaServidor;
    }
  }

  var tabelaBody = document.getElementById("tabela_lista_servidor");
  if (tabelaBody) {
    tabelaBody.innerHTML = linhasCriticos + linhasAtencao + linhasOperando;
  }
}

// Gráfico
function criarGraficos() {
  var canvasGrafico = document.getElementById("perfomaInfra");
  if (!canvasGrafico) {
    return;
  }

  new Chart(canvasGrafico, {
    data: {
      datasets: [
        {
          label: "RAM (%)",
          data: [],
          type: "line",
          order: 1,
          tension: 0.2,
          borderColor: "#36A2EB",
          backgroundColor: "#9BD0F530",
          yAxisID: "yPercent",
        },
        {
          label: "CPU (%)",
          data: [],
          type: "line",
          order: 2,
          tension: 0.2,
          borderColor: "#22c55e",
          backgroundColor: "#86efac30",
          yAxisID: "yPercent",
        },
        {
          label: "Disco (%)",
          data: [],
          type: "line",
          order: 3,
          tension: 0.2,
          borderColor: "#f59e0b",
          backgroundColor: "#fde68a30",
          yAxisID: "yPercent",
        },
        {
          label: "Processos",
          data: [],
          type: "line",
          order: 4,
          tension: 0.2,
          borderColor: "#8b5cf6",
          backgroundColor: "#c4b5fd30",
          yAxisID: "yProcessos",
        },
      ],
      labels: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          labels: {
            font: { size: 10, family: "Barlow" },
            boxWidth: 12,
            padding: 10,
          },
        },
      },
      scales: {
        x: {
          ticks: { maxTicksLimit: 8, font: { size: 9 } },
          grid: { color: "#f0f0f0" },
        },
        yPercent: {
          type: "linear",
          position: "left",
          min: 0,
          max: 100,
          ticks: {
            font: { size: 9 },
            callback: function (v) { return v + "%"; }
          },
          grid: { color: "#f0f0f0" },
        },
        yProcessos: {
          type: "linear",
          position: "right",
          ticks: { font: { size: 9 } },
          grid: { drawOnChartArea: false },
        },
      },
    },
  });
}

// Detalhe do servidor selecionado
function exibirDetalhesServidor(idServidor) {
  var servidor = dataClient.hosts[idServidor];
  var metricas = servidor.metricas;

  var valorCpu = metricas.cpu_percentil_maquina;
  var valorRam = metricas.ram_percentil_maquina;
  var valorDisco = metricas.disco_porcentagem[indiceUltimaLeitura];

  var nivelCpu = nivelBarra(valorCpu, "cpu");
  var nivelRam = nivelBarra(valorRam, "ram");
  var nivelDisco = nivelBarra(valorDisco, "disco");

  // Header
  var elNomeServidor = document.getElementById("modal_detalhe_nome_servidor");
  var elIndicador = document.getElementById("modal_cabecalho_indicador");
  if (elNomeServidor) {
    elNomeServidor.innerText = servidor.hostname;
  }
  if (elIndicador) {
    elIndicador.innerText = "Servidor | " + servidor.host_id;
  }

  // Valores dos KPIs
  var elValorCpu = document.getElementById("modal_detalhe_uso_cpu");
  var elValorRam = document.getElementById("modal_detalhe_uso_ram");
  var elValorDisco = document.getElementById("modal_detalhe_uso_disco");
  if (elValorCpu) {
    elValorCpu.innerText = valorCpu + "%";
  }
  if (elValorRam) {
    elValorRam.innerText = valorRam + "%";
  }
  if (elValorDisco) {
    elValorDisco.innerText = metricas.disco_usado[indiceUltimaLeitura] + " Gb";
  }

  // Barras de progresso dos KPIs
  var elBarraCpu = document.getElementById("modal_detalhe_preenchimento_cpu");
  var elBarraRam = document.getElementById("modal_detalhe_preenchimento_ram");
  var elBarraDisco = document.getElementById("modal_detalhe_preenchimento_disco");

  if (elBarraCpu) {
    elBarraCpu.style.width = valorCpu + "%";
    elBarraCpu.style.background = coresPorNivel[nivelCpu];
  }
  if (elBarraRam) {
    elBarraRam.style.width = valorRam + "%";
    elBarraRam.style.background = coresPorNivel[nivelRam];
  }
  if (elBarraDisco) {
    elBarraDisco.style.width = valorDisco + "%";
    elBarraDisco.style.background = coresPorNivel[nivelDisco];
  }

  // Coloração dos cards por nível
  function atualizarEstadoCard(idCard, nivel) {
    var card = document.getElementById(idCard);
    if (!card) {
      return;
    }
    card.classList.remove("estado-atencao", "estado-critico");
    if (nivel == 1) {
      card.classList.add("estado-atencao");
    }
    if (nivel == 2) {
      card.classList.add("estado-critico");
    }
  }
  atualizarEstadoCard("card_cpu", nivelCpu);
  atualizarEstadoCard("card_ram", nivelRam);
  atualizarEstadoCard("card_disco", nivelDisco);

  // Métricas secundárias
  var elProcessos = document.getElementById("modal_info_processos");
  var elTemperatura = document.getElementById("modal_info_temperatura");
  var elDiscoTotal = document.getElementById("modal_info_disco");
  var elConexoesTcp = document.getElementById("modal_info_conexao_tcp");

  var quantidadeProcessosAtual = metricas.processos[indiceUltimaLeitura];
  var quantidadeProcessosAnterior;
  if (indiceUltimaLeitura > 0) {
    quantidadeProcessosAnterior = metricas.processos[indiceUltimaLeitura - 1];
  } else {
    quantidadeProcessosAnterior = quantidadeProcessosAtual;
  }
  var variacaoProcessos = quantidadeProcessosAtual - quantidadeProcessosAnterior;
  if (elProcessos) {
    elProcessos.innerText = quantidadeProcessosAtual;
  }

  // Tendência dos processos
  var elTendenciaProcessos = document.getElementById("trend_processos");
  if (elTendenciaProcessos) {
    if (variacaoProcessos > 0) {
      elTendenciaProcessos.textContent = "+" + variacaoProcessos;
      elTendenciaProcessos.className = "mini-trend up";
    } else if (variacaoProcessos < 0) {
      elTendenciaProcessos.textContent = "" + variacaoProcessos;
      elTendenciaProcessos.className = "mini-trend down";
    } else {
      elTendenciaProcessos.textContent = "";
      elTendenciaProcessos.className = "mini-trend flat";
    }
  }

  // Temperatura — vem do JSON de análise preditiva, cruzado pelo host_id
  if (elTemperatura) {
    var tempAtual = mapTemperatura[servidor.host_id];
    if (tempAtual == undefined) {
      tempAtual = null;
    }

    if (tempAtual != null) {
      elTemperatura.innerHTML = tempAtual + " °C";
    } else {
      elTemperatura.innerHTML = "N/D";
    }

    var nivelTemp = 0;
    if (tempAtual != null) {
      nivelTemp = nivelBarra(tempAtual, "temp");
    }

    atualizarEstadoCard("card_temperatura", nivelTemp);

    var elDotTemperatura = document.getElementById("dot_temperatura");
    if (elDotTemperatura && tempAtual != null) {
      if (nivelTemp == 2) {
        elDotTemperatura.className = "mini-status-dot vermelho";
        elDotTemperatura.title = "Crítico (>85°C)";
      } else if (nivelTemp == 1) {
        elDotTemperatura.className = "mini-status-dot amarelo";
        elDotTemperatura.title = "Atenção (>70°C)";
      } else {
        elDotTemperatura.className = "mini-status-dot verde";
        elDotTemperatura.title = "Normal (≤70°C)";
      }
    }
  }

  if (elDiscoTotal) {
    elDiscoTotal.innerText = metricas.disco_total[indiceUltimaLeitura] + " Gb";
  }
  if (elConexoesTcp) {
    elConexoesTcp.innerText = "1,439";
  }
}

function exibirGraficos(idServidor) {
  var servidor = dataClient.hosts[idServidor];
  var rotulosEixoX = [];

  for (var i = 0; i <= indiceUltimaLeitura; i++) {
    rotulosEixoX[i] = new Date(
      servidor.metricas.datahora[i],
    ).toLocaleTimeString();
  }

  var grafico = Chart.getChart("perfomaInfra");
  if (grafico) {
    grafico.data.datasets[0].data = servidor.metricas.ram_perc;
    grafico.data.datasets[1].data = servidor.metricas.cpu_percent;
    grafico.data.datasets[2].data = servidor.metricas.disco_porcentagem;
    grafico.data.datasets[3].data = servidor.metricas.processos;
    grafico.data.labels = rotulosEixoX;
    grafico.update();
  }
}

function detalhesServidor(idServidor) {
  exibirDetalhesServidor(idServidor);
  exibirGraficos(idServidor);
}

function selecionarServidor(elementoLinha, idServidor) {
  window.servidorSelecionado = idServidor;
  sessionStorage.NOME_SERVIDOR = dataClient.hosts[idServidor].hostname;
  var todasLinhas = document.querySelectorAll("#tabela_lista_servidor tr");
  for (var i = 0; i < todasLinhas.length; i++) {
    todasLinhas[i].classList.remove("tr-selecionada");
  }
  elementoLinha.classList.add("tr-selecionada");
  detalhesServidor(idServidor);
}

function removerServidor(idServidor) {
  var servidor = dataClient.hosts[idServidor];
  var modalRemocao = document.getElementById("modalRemoverServidor");
  if (modalRemocao) {
    modalRemocao.style.display = "flex";
  }
  var elTituloRemocao = document.getElementById("modal_remover_servidor");
  if (elTituloRemocao) {
    elTituloRemocao.innerText =
      "Remover Servidor: " + servidor.hostname + " - #" + servidor.host_id;
  }
}

function buscarServidorPorNome(textoBusca) {
  var tabelaBody = document.getElementById("tabela_lista_servidor");
  if (!tabelaBody) {
    return;
  }

  if (textoBusca === "") {
    listarServidor();
    return;
  }

  var linhasEncontradas = "";

  for (var i = 0; i < hostsAtivos; i++) {
    var servidor = dataClient.hosts[i];
    var nomeCorresponde = servidor.hostname.toLowerCase().includes(textoBusca);
    var idCorresponde = servidor.host_id.toLowerCase().includes(textoBusca);

    if (nomeCorresponde || idCorresponde) {
      var metricas = servidor.metricas;
      var nivelCpu = nivelBarra(metricas.cpu_percentil_maquina, "cpu");
      var nivelRam = nivelBarra(metricas.ram_percentil_maquina, "ram");
      var nivelDisco = nivelBarra(
        metricas.disco_porcentagem[indiceUltimaLeitura],
        "disco",
      );

      var statusServidor = 0;
      if (nivelCpu >= 1 || nivelRam >= 1 || nivelDisco >= 1) {
        statusServidor = 1;
      }
      if (nivelCpu >= 2 || nivelRam >= 2 || nivelDisco >= 2) {
        statusServidor = 2;
      }

      linhasEncontradas += `
        <tr onclick="selecionarServidor(this, ${i})">
          <td><span class="etiqueta-bold ${classesPorStatus[statusServidor]}">● ${textosPorStatus[statusServidor]}</span></td>
          <td><span class="nome-servidor">${servidor.hostname.toUpperCase()}</span><span class="servidor-id">#${servidor.host_id}</span></td>
          <td class="coluna-extra">10.0.0.1</td>
          <td class="coluna-extra">Ubuntu 22.04</td>
          <td>
            <div class="container-barra">
              <div class="barra"><div class="preenchimento" style="width:${metricas.cpu_percentil_maquina}%;background:${coresPorNivel[nivelCpu]}"></div></div>
              <span>${metricas.cpu_percentil_maquina}%</span>
            </div>
          </td>
          <td>
            <div class="container-barra">
              <div class="barra"><div class="preenchimento" style="width:${metricas.ram_percentil_maquina}%;background:${coresPorNivel[nivelRam]}"></div></div>
              <span>${metricas.ram_percentil_maquina}%</span>
            </div>
          </td>
          <td>
            <div class="container-barra">
              <div class="barra"><div class="preenchimento" style="width:${metricas.disco_porcentagem[indiceUltimaLeitura]}%;background:${coresPorNivel[nivelDisco]}"></div></div>
              <span>${metricas.disco_porcentagem[indiceUltimaLeitura]}%</span>
            </div>
          </td>
          <td class="coluna-extra">42h13min</td>
        </tr>
      `;
    }
  }

  if (!linhasEncontradas) {
    linhasEncontradas = `<tr><td colspan="8"><h4 style="padding:12px;color:#9ca3af">Nenhum servidor encontrado</h4></td></tr>`;
  }
  tabelaBody.innerHTML = linhasEncontradas;
}

function listarResumoServidores() {}
function graficoResulmoServidores() {}
function trocarGrafico() {}
function trocarKpi() {}

window.detalhesServidor = detalhesServidor;
window.selecionarServidor = selecionarServidor;
window.removerServidor = removerServidor;
window.exibirGraficos = exibirGraficos;

export {
  listarServidor,
  criarGraficos,
  listarResumoServidores,
  graficoResulmoServidores,
  trocarGrafico,
  trocarKpi,
  buscarServidorPorNome,
  detalhesServidor,
};