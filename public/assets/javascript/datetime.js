
  // Declaração dos dais da semana e do mes como vetor
  const semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  // busca pela data
  var dataAtual = new Date()
  var dia = dataAtual.getDate()
  var ano = dataAtual.getFullYear()
  // Identifica o dia da semana e o mes atual
  var diaSemana = semana[dataAtual.getDay()]
  var mes = meses[dataAtual.getUTCMonth()]
  // Add o "0" caso a data seja menor que 10 dias pra ficar com dois digitos
  if (dia < 10) dia = "0" + dia

  // Formata a data no modelo: Ter 07 de Abr 2026 
  var dataFormatada = diaSemana + " " + dia + " " + mes + " " + ano + " "

  // busca a hora certinho
  const relogio = setInterval(function time() {
    var horarioAtual = new Date()
    // Pega as informações da hora
    var hr = horarioAtual.getHours();
    var min = horarioAtual.getMinutes();
    var sec = horarioAtual.getSeconds();

    // Formata para dois digitos
    if (hr < 10) hr = '0' + hr
    if (min < 10) min = '0' + min
    if (sec < 10) sec = '0' + sec

    // Formata a data para: hh:min:se
    var horaFormatada = hr + ":" + min + ":" + sec

    // coloca na tela
    dataSistema.innerHTML = dataFormatada + horaFormatada
  })
