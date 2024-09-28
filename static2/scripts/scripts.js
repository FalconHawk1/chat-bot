const questions = [
    "What's your name?",
    "How old are you?",
    "What gender are you?",
    "What time do you want to book?",
    "When do you want to book?"
];

let questionIndex = 0;
let answers = {};
const serviceMessages = {
    facial: "Un tratamiento facial es una excelente elección para revitalizar tu piel. ¿Te gustaría agendar tu cita?",
    hidroterapia: "Hidroterapia service selected. Let's gather some details for your booking.",
    masajes: "You selected a massage session. Let's proceed with the booking details.",
    aromaterapia: "Aromatherapy service selected. Please provide the details for your reservation."
};

document.querySelector('#facial').addEventListener('click', () => startChat('facial'));
document.getElementById('hidroterapia').addEventListener('click', () => startChat('hidroterapia'));
document.getElementById('masajes').addEventListener('click', () => startChat('masajes'));
document.getElementById('aromaterapia').addEventListener('click', () => startChat('aromaterapia'));


function startChat(service) {
    toggleChat();
    showInitialMessage(service);
};

function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    chatBox.classList.toggle('hidden');

    if (!chatBox.classList.contains('hidden') && questionIndex === 0) {
        askQuestion();
    }
}

function showInitialMessage(service) {
    const chatContent = document.getElementById('chatContent');
    const message = serviceMessages[service];
    chatContent.innerHTML += `<div class="bot-message">${message}</div>`;
    scrollToBottom();
}

function askQuestion() {
    const chatContent = document.getElementById('chatContent');
    chatContent.innerHTML += `<div class="bot-message">${questions[questionIndex]}</div>`;
    scrollToBottom();
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const chatContent = document.getElementById('chatContent');

    if (userInput.trim() === '') return;

    chatContent.innerHTML += `<div class="user-message">${userInput}</div>`;
    answers[questions[questionIndex]] = userInput;
    document.getElementById('userInput').value = '';

    questionIndex++;
    if (questionIndex < questions.length) {
        setTimeout(askQuestion, 1000);  // Ask next question after a delay
    } else {
        setTimeout(reservation, 1000);
    }

    scrollToBottom();
}

function reservation() {
    const chatContent = document.getElementById('chatContent');
    chatContent.innerHTML += `<div class="bot-message">Thank you! Your reservation is being processed...</div>`;
    scrollToBottom();

    // Send data to the backend (e.g., to save in MySQL and blockchain)
    fetch('/reservation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
    }).then(response => response.json())
      .then(data => {
          chatContent.innerHTML += `<div class="bot-message">${data.message}</div>`;
      }).catch(error => {
          chatContent.innerHTML += `<div class="bot-message">Error saving reservation. Please try again later.</div>`;
      });

    scrollToBottom();
}

function scrollToBottom() {
    const chatContent = document.getElementById('chatContent');
    chatContent.scrollTop = chatContent.scrollHeight;
}
