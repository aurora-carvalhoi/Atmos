async function buscarClient() {
  const res = await fetch('../assets/javascript/client.json')
  const data = await res.json()
  return data
}
const dataClient = await buscarClient()
const ultimoValor = (dataClient.resumo.total_registros / dataClient.resumo.hosts_ativos) - 1

function listarServidor() {
  var listaServidores = ''
  for (var i = 0; i < dataClient.resumo.hosts_ativos; i++) {
    var servidor = dataClient.hosts[i]
    // var ultimoValor = 100 - 1
    listaServidores += `
        <tr>
                <td><span class="etiqueta-bold etiqueta-amarela">● Atenção</span></td>
                <td><span class="nome-servidor">${servidor.host_id.toUpperCase()}</span>
                  <span class="servidor-id">#002</span>
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
  document.getElementById('modal_remover_servidor').innerText = 'Remover Servidor: '+servidor.hostname+' - #'+servidor.host_id
}






//  exportar as funções ou tornar visivel para o html globalmente
window.detalhesServidor = detalhesServidor
window.removerServidor = removerServidor
export { listarServidor, criarGraficos }