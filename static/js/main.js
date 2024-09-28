const navTriggerBtn = document.querySelector('#nav_trigger_btn');
const navMenu = document.querySelector('#nav_menu');

const questions = [
    "¿Cual es tu nombre?",
    "¿Cuantos años tienes?",
    "¿Cual es el servicio que quieres reservar?",
    "¿A que hora quieres reservar?",
    "¿Cuando quieres agendar la cita?"
];

let questionIndex = 0;
let answers = {};

function toggleChat() {
    const chatBox = document.getElementById('chatbot-window');
    chatBox.classList.toggle('hidden');

    if (!chatBox.classList.contains('hidden') && questionIndex === 0) {
        askQuestion();
    }
}

function askQuestion() {
    const chatContent = document.getElementById('chatContent');
    chatContent.innerHTML += `
        <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
            <i class="ri-robot-line mr-2"></i>
            ${questions[questionIndex]}
        </div>`;
    scrollToBottom();
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const chatContent = document.getElementById('chatContent');

    if (userInput.trim() === '') return;

    chatContent.innerHTML += `
        <div class="user-message flex items-center bg-gray-300 text-gray-700 p-2 rounded-lg my-1">
            <i class="ri-user-line mr-2"></i>
            ${userInput}
        </div>`;
    
    answers[questions[questionIndex]] = userInput;

    document.getElementById('userInput').value = '';

    questionIndex++;
    if (questionIndex < questions.length) {
        setTimeout(askQuestion, 1000);
    } else {
        setTimeout(reservation, 1000);
    }

    scrollToBottom();
}

function reservation() {
    const chatContent = document.getElementById('chatContent');
    chatContent.innerHTML += `
        <div class="bot-message flex items-center bg-blue-600 text-gray-800 p-2 rounded-lg my-1">
            <i class="ri-robot-line mr-2"></i>
            Su reserva está en proceso...
        </div>`;
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
        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-green-600 text-gray-800 p-2 rounded-lg my-1">
                <i class="ri-check-line mr-2"></i>
                Su reserva ha sido agendada exitosamente.
            </div>`;
      }).catch(error => {
        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-red-600 text-gray-800 p-2 rounded-lg my-1">
                <i class="ri-error-warning-line mr-2"></i>
                Ha ocurrido un error al agendar su reserva.
            </div>`;
      });

    scrollToBottom();
}

function scrollToBottom() {
    const chatContent = document.getElementById('chatContent');
    chatContent.scrollTop = chatContent.scrollHeight;
}

// Event listener
navTriggerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('nav-is-open')
})

// swiper
const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    
    slidesPerView: 3,
    spaceBetween: 20,
    breakpoints: {
        320: {
            slidesPerView: 1
        },
        960: {
            slidesPerView: 2
        },
        1200: {
            slidesPerView: 3,
        },
    }
})