async function buscarClient() {
  const res = await fetch('../assets/javascript/client.json')
  const data = await res.json()
  return data
}
const dataClient = await buscarClient()
const ultimoValor = (dataClient.resumo.total_registros / dataClient.resumo.hosts_ativos) - 1

// OverView
function listarResumoServidores() {
  var servidores = ''
  var listaServidores = ''
  for (var i = 0; i < dataClient.resumo.hosts_ativos; i++) {
    var servidor = dataClient.hosts[i]
    servidores += `
     <div class="servidor" >   
      <div class="indentificador">
        <div></div>
        <h3>${servidor.hostname}</h3>
      </div>
      <div class="infos">
        <span>10.0.1.30</span>
        <span>Ubuntu 22</span>
      </div>
      <div class="recursos">
        <span>CPU - ${servidor.metricas.cpu_percent[ultimoValor]}%</span>
        <span>RAM - ${servidor.metricas.ram_perc[ultimoValor]}%</span>
        <span>DISCO - ${servidor.metricas.disco_porcentagem[ultimoValor]}%</span>
      </div>  
     </div>
  `

    listaServidores += `
    <option value="${i}">${servidor.hostname}</option>
  `

  }
  document.getElementById('resulmoServidores').innerHTML = servidores
  document.getElementById('select_lista_servidores').innerHTML = listaServidores
}

function graficoResulmoServidores() {
  var servidor = dataClient.hosts[0]
  let data = [];
  for (var i = 0; i <= ultimoValor; i++) {
    data[i] = new Date(servidor.metricas.datahora[i]).toLocaleTimeString()
  }
  const perfomaInfra = document.getElementById("perfomaInfra")
  new Chart(perfomaInfra,
    {
      data: {
        datasets: [
          {
            label: 'RAM (%)',
            data: servidor.metricas.ram_perc,
            type: 'line',
            order: 1,
            tension: 0.2,
          }, {
            label: 'CPU (%)',
            data: servidor.metricas.cpu_percent,
            type: 'line',
            order: 2,
            tension: 0.2,
          }
        ],
        labels: data,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scale: {
          x: {
            ticks: {
              maxTicksLimit: 10
            }
          }
        }
      }
    }
  )
}

function trocarGrafico(idServidor) {
  const servidor = dataClient.hosts[idServidor]
  var graficoPorcentagens = Chart.getChart('perfomaInfra')
  graficoPorcentagens.data.datasets[0].data = servidor.metricas.ram_perc
  graficoPorcentagens.data.datasets[1].data = servidor.metricas.cpu_percent
  graficoPorcentagens.update()
}

function trocarKpi(kpi) {
  var kpi1 = document.getElementById('conteudo_recursos_kpi_1')
  var kpi2 = document.getElementById('conteudo_recursos_kpi_2')
  var kpp3 = document.getElementById('conteudo_recursos_kpi_3')
  var legenda1 = document.getElementById('conteudo_recursos_legenda_1')
  var legenda2 = document.getElementById('conteudo_recursos_legenda_2')
  var legenda3 = document.getElementById('conteudo_recursos_legenda_3')
  // conteudo_recursos_legenda_1
  legenda1.innerText = 'Percentil'
  legenda2.innerText = 'Pico Min.'
  legenda3.innerText = 'Pico Max.'
  switch (kpi) {
    case "cpu":
      kpi1.innerText = '30%'
      kpi2.innerText = '10%'
      kpp3.innerText = '50%'
      break;
    case "ram": {
      kpi1.innerText = '70%'
      kpi2.innerText = '60%'
      kpp3.innerText = '75%'
      break;
    }
    case "disco": {
      kpi1.innerText = '60%'
      kpi2.innerText = '50%'
      kpp3.innerText = '90%'
      break;
    }
  }
}

// Servidores 
function listarServidor() {
  var listaServidores = ''
  for (var i = 0; i < dataClient.resumo.hosts_ativos; i++) {
    var servidor = dataClient.hosts[i]
    // var ultimoValor = 100 - 1
    listaServidores += `
        <tr>
                <td><span class="etiqueta-bold etiqueta-amarela">● Atenção</span></td>
                <td><span class="nome-servidor">${servidor.hostname.toUpperCase()}</span>
                  <span class="servidor-id">#${servidor.host_id}</span>
                </td>
                <td><span class="end-ip">10.0.0.1</span></td>
                <td><span class="nome-so">Ubuntu 22.04</span></td>
                <td>
                  <div class="container-barra">
                    <div class="barra">
                      <div class="preenchimento" style="width: ${servidor.metricas.cpu_percent[ultimoValor]}%"></div>
                    </div>
                    <span>${servidor.metricas.cpu_percent[ultimoValor]}%</span>
                  </div>
                </td>
                <td>
                  <div class="container-barra">
                    <div class="barra">
                        <div class="preenchimento" style="width: ${servidor.metricas.ram_perc[ultimoValor]}%"></div>
                    </div>
                    <span>${servidor.metricas.ram_perc[ultimoValor]}%</span>
                  </div>
                </td>
                <td>
                  <div class="container-barra">
                    <div class="barra">
                      <div class="preenchimento" style="width: ${servidor.metricas.disco_porcentagem[ultimoValor]}%"></div>
                    </div>
                    <span> ${servidor.metricas.disco_porcentagem[ultimoValor]}%</span>
                  </div>
                </td>
                <td>42h13min</td>
                <td>
                  <button class="btn-detalhes" onclick="detalhesServidor(${i})">Detalhes</button>
                  <!-- <button class="btn-remover" onclick="removerServidor(${i})">Remover</button> -->
                </td>
              </tr>
        `
  }
  var tabela = document.getElementById("tabela_lista_servidor")
  tabela.innerHTML = listaServidores
}

function criarGraficos() {
  const perfomaInfra = document.getElementById("perfomaInfra")
  const perfomaInfra2 = document.getElementById("perfomaInfra2")
  new Chart(perfomaInfra,
    {
      data: {
        datasets: [
          {
            label: 'RAM (%)',
            data: [],
            type: 'line',
            order: 1,
            tension: 0.2,
            borderColor: '#36A2EB',
            backgroundColor: '#9BD0F5',
          }, {
            label: 'CPU (%)',
            data: [],
            type: 'line',
            order: 2,
            tension: 0.2,
            borderColor: '#36eb75',
            backgroundColor: '#9bf5ad',
          },
          {
            label: 'Disco (%)',
            data: [],
            type: 'line',
            order: 2,
            tension: 0.2,
            borderColor: '#eba036',
            backgroundColor: '#f5df9b',
          }
        ],
        labels: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scale: {
          x: {
            ticks: {
              maxTicksLimit: 10
            }
          }
        }
      }
    }
  )

  new Chart(perfomaInfra2,
    {
      data: {
        datasets: [
          {
            label: 'Processos',
            data: [],
            type: 'line',
            order: 1,
            tension: 0.2,
            borderColor: '#8e36eb',
            backgroundColor: '#b69bf5',
          }
        ],
        labels: [],

      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scale: {
          x: {
            ticks: {
              maxTicksLimit: 10
            }
          }
        }
      }
    }
  )
}

function exibirDetalhesServidor(idServidor) {
  var servidor = dataClient.hosts[idServidor]
  // Nome
  document.getElementById('modal_cabecalho_indicador').innerText = 'Servidor | ' + servidor.host_id
  document.getElementById('modal_detalhe_nome_servidor').innerText = servidor.hostname
  // Metricas
  document.getElementById('modal_detalhe_uso_cpu').innerText = servidor.metricas.cpu_percent[ultimoValor] + '%'
  document.getElementById('modal_detalhe_uso_ram').innerText = servidor.metricas.ram_perc[ultimoValor] + '%'
  document.getElementById('modal_detalhe_uso_disco').innerText = servidor.metricas.disco_usado[ultimoValor] + 'Gb'
  document.getElementById('modal_detalhe_preenchimento_cpu').style.width = `${servidor.metricas.cpu_percent[ultimoValor]}%`
  document.getElementById('modal_detalhe_preenchimento_ram').style.width = `${servidor.metricas.ram_perc[ultimoValor]}%`
  document.getElementById('modal_detalhe_preenchimento_disco').style.width = `${servidor.metricas.disco_porcentagem[ultimoValor]}%`
  // infos adicionais 
  document.getElementById('modal_info_processos').innerText = servidor.metricas.processos[ultimoValor]
  document.getElementById('modal_info_temperatura').innerHTML = '30' + ' °C'
  document.getElementById('modal_info_disco').innerText = servidor.metricas.disco_total[ultimoValor] + ' Gb'
  document.getElementById('modal_info_conexao_tcp').innerText = '1,439'
}

function exibirGraficos(idServidor) {
  console.log('sdasd')
  const servidor = dataClient.hosts[idServidor]

  let data = [];
  for (var i = 0; i <= ultimoValor; i++) {
    data[i] = new Date(servidor.metricas.datahora[i]).toLocaleTimeString()
  }

  var graficoPorcentagens = Chart.getChart('perfomaInfra')
  graficoPorcentagens.data.datasets[0].data = servidor.metricas.ram_perc
  graficoPorcentagens.data.datasets[1].data = servidor.metricas.cpu_percent
  graficoPorcentagens.data.datasets[2].data = servidor.metricas.disco_porcentagem
  graficoPorcentagens.data.labels = data

  var graficoProcessos = Chart.getChart('perfomaInfra2')
  graficoProcessos.data.datasets[0].data = servidor.metricas.ram_perc
  graficoProcessos.data.labels = data
}

function detalhesServidor(idServidor) {
  var modal = document.getElementById("modalDetalhes")
  modal.style.display = 'flex'
  exibirDetalhesServidor(idServidor)
  exibirGraficos(idServidor)
}

function removerServidor(idServidor) {
  var servidor = dataClient.hosts[idServidor]
  var modal = document.getElementById("modalRemoverServidor")
  modal.style.display = 'flex'
  document.getElementById('modal_remover_servidor').innerText = 'Remover Servidor: ' + servidor.hostname + ' - #' + servidor.host_id
}

function buscarServidorPorNome(texto) {
  if (texto == '') {
    listarServidor()
  } else {
    var nomesServidores = []
    var idServidores = []
    var listaServidores = ''
    for (var i = 0; i < dataClient.resumo.hosts_ativos; i++) {
      nomesServidores[i] = dataClient.hosts[i].hostname.toLowerCase()
      idServidores[i] = dataClient.hosts[i].host_id.toLowerCase()
    }
    for (var i = 0; i < dataClient.resumo.hosts_ativos; i++) {
      var servidor = dataClient.hosts[i]
      if (
        servidor.hostname.toLowerCase().includes(texto) ||
        servidor.host_id.toLowerCase().includes(texto)
      ) {
        listaServidores += `
        <tr>
                <td><span class="etiqueta-bold etiqueta-amarela">● Atenção</span></td>
                <td><span class="nome-servidor">${servidor.hostname.toUpperCase()}</span>
                  <span class="servidor-id">#${servidor.host_id}</span>
                </td>
                <td><span class="end-ip">10.0.0.1</span></td>
                <td><span class="nome-so">Ubuntu 22.04</span></td>
                <td>
                  <div class="container-barra">
                    <div class="barra">
                      <div class="preenchimento" style="width: ${servidor.metricas.cpu_percent[ultimoValor]}%"></div>
                    </div>
                    <span>${servidor.metricas.cpu_percent[ultimoValor]}%</span>
                  </div>
                </td>
                <td>
                  <div class="container-barra">
                    <div class="barra">
                        <div class="preenchimento" style="width: ${servidor.metricas.ram_perc[ultimoValor]}%"></div>
                    </div>
                    <span>${servidor.metricas.ram_perc[ultimoValor]}%</span>
                  </div>
                </td>
                <td>
                  <div class="container-barra">
                    <div class="barra">
                      <div class="preenchimento" style="width: ${servidor.metricas.disco_porcentagem[ultimoValor]}%"></div>
                    </div>
                    <span> ${servidor.metricas.disco_porcentagem[ultimoValor]}%</span>
                  </div>
                </td>
                <td>42h13min</td>
                <td>
                  <button class="btn-detalhes" onclick="detalhesServidor(${i})">Detalhes</button>
                  <button class="btn-remover" onclick="removerServidor(${i})">Remover</button>
                </td>
              </tr>
        `
      }
    }
    if (listaServidores == '') {
      listaServidores = `
          <tr>
            <td>
              <h4>Nenhum servidor encontrado</h4>
            </td>
          </tr>
        `
    }
    var tabela = document.getElementById("tabela_lista_servidor")
    tabela.innerHTML = listaServidores
  }
}





//  exportar as funções ou tornar visivel para o html globalmente
window.detalhesServidor = detalhesServidor
window.removerServidor = removerServidor
window.exibirGraficos = exibirGraficos
export {
  listarServidor, criarGraficos, listarResumoServidores,
  graficoResulmoServidores, trocarGrafico, trocarKpi, buscarServidorPorNome
}