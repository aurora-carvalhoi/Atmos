// Adiciona um evento ao ícone de chat para quando ser clicado, abrir o chat
const chatIcon = document.getElementById('chat');
const chatBox = document.getElementById('conversation');

// Adiciona um ouvinte de clique
chatIcon.addEventListener('click', () => {
    if (chatBox.style.display == 'none') {
        chatBox.style.display = 'flex';
    } else {
        chatBox.style.display = 'none';
    }
});
