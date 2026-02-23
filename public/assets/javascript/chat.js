// Adiciona um evento ao ícone de chat para quando ser clicado, abrir o chat
const chatIcon = document.getElementById('chat');
const chatBox = document.getElementById('conversation');
const sendButton = document.getElementById('send');
const closeChat = document.getElementById('close-chat');


// Fecha o chat pelo ícone de X
closeChat.addEventListener('click', () => {
    chatBox.style.display = 'none';
});

// Adiciona um ouvinte de clique
chatIcon.addEventListener('click', () => {


    if (chatBox.style.display === 'none') {
        chatBox.style.display = 'flex';
    } else {
        chatBox.style.display = 'none';
    }
});

// Coleta os dados da mensagem e envia
sendButton.addEventListener('click', () => {

    let dia = new Date().getDate();
    let mesTexto = new Date().toLocaleString('pt-BR', { month: 'long' });
    let hora = new Date().getHours();
    let minutos = new Date().getMinutes();

    let mesAbreviado = mesTexto.substring(0, 3);

    let dataHora = `${dia} ${mesAbreviado}., ${hora}:${minutos}`;

    let contentInput = document.getElementById('mensagem');

    if (contentInput.value === '') {
        sendButton.disable();
    } else {
        document.getElementById('chat-conversation').innerHTML += `
            <div class="baloon-user">
                <span>${contentInput.value}</span>
            </div>
            <span class="date-time-user">${dataHora}</span>
        `;

        contentInput.value = "";
    }

})

// Função para enviar a mensagem para a AI (Gemini)
function sendMessageToAi() {}

