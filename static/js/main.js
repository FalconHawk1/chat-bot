const navTriggerBtn = document.querySelector('#nav_trigger_btn');
const navMenu = document.querySelector('#nav_menu');

let questionIndex = 0;
let answers = {};
let questions = [];
let questionsLoaded = false;
let step = 0;
let userInfo = {};

function toggleChat() {
    const chatBox = document.getElementById('chatbot-window');
    chatBox.classList.toggle('hidden');

    if (!chatBox.classList.contains('hidden') && questionIndex === 0 && questionsLoaded) {
        askQuestion();
    }
}

function askQuestion() {
    const chatContent = document.getElementById('chatContent');

    const greeting = "Bienvenido a su servicio de spa. ¿En qué puedo ayudarle?";
    chatContent.innerHTML += `
        <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
            <i class="ri-robot-line mr-2"></i>
            ${greeting}
        </div>`;
    
    scrollToBottom();
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value.trim();
    const chatContent = document.getElementById('chatContent');

    if (userInput === '') return;

    chatContent.innerHTML += `
        <div class="user-message flex items-center bg-gray-300 text-gray-700 p-2 rounded-lg my-1">
            <i class="ri-user-line mr-2"></i>
            ${userInput}
        </div>`;

    document.getElementById("userInput").value = "";

    if (step === 0) {
        const matchingQuestion = questions.find((q) => {
            const csvMessage = q["Mensaje"] ? q["Mensaje"].toLowerCase().trim() : '';
            return csvMessage === userInput.toLowerCase().trim();
        });

        if (matchingQuestion) {
            // Provide service info and move to the next question (name)
            const response = matchingQuestion["Respuesta"];
            chatContent.innerHTML += `
                <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
                    <i class="ri-robot-line mr-2"></i>
                    ${response}
                </div>`;
            step = 1;
            chatContent.innerHTML += `
                <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
                    <i class="ri-robot-line mr-2"></i>
                    Indicanos tu nombre para continuar con la reserva.
                </div>`;
        } else {
            // If no service match found, show a default message
            chatContent.innerHTML += `
                <div class="bot-message flex items-center bg-red-600 text-white p-2 rounded-lg my-1">
                    <i class="ri-error-warning-line mr-2"></i>
                    Lo siento, no entendí tu respuesta.
                </div>`;
        }
    } else if (step === 1) {
        // Step 1: Save the user's name and ask for the age
        userInfo.name = userInput;
        step = 2;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿Cuántos años tienes?
            </div>`;
    } else if (step === 2) {
        // Step 2: Save the user's age and ask for the time
        userInfo.age = userInput;
        step = 3;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿Qué servicio quieres reservar?
            </div>`;
    } else if (step === 3) {
        // Step 2: Save the user's age and ask for the time
        userInfo.service = userInput;
        step = 4;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿A qué hora quieres reservar?
            </div>`;
    }
    else if (step === 4) {
        // Step 2: Save the user's age and ask for the time
        userInfo.time = userInput;
        step = 5;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿Cuando quieres agendar la cita?
            </div>`;
    } else if (step === 5) {
        // Step 4: Save the date and confirm the reservation
        userInfo.date = userInput;
        step = 0;  // Reset the steps for the next reservation

        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-green-600 text-accent p-2 rounded-lg my-1">
                <i class="ri-check-line mr-2"></i>
                ¡Gracias! Hemos recibido tu información:
                Su reserva está en proceso...
            </div>`;

        // Send data to the backend (e.g., MySQL and blockchain)
        fetch('/reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        })
        .then(response => response.json())
        .then(data => {
            chatContent.innerHTML += `
                <div class="bot-message flex items-center bg-green-600 text-accent p-2 rounded-lg my-1">
                    <i class="ri-check-line mr-2"></i>
                    Su reserva ha sido agendada exitosamente.
                </div>`;
        })
        .catch(error => {
            chatContent.innerHTML += `
                <div class="bot-message flex items-center bg-red-600 text-accent p-2 rounded-lg my-1">
                    <i class="ri-error-warning-line mr-2"></i>
                    Ha ocurrido un error al agendar su reserva.
                </div>`;
        });
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
    const chatBox  = document.getElementById('chatContent');
    chatBox.scrollTop = chatBox.scrollHeight;
}

fetch('/getQuestions')
  .then(response => response.json())
  .then(data => {
    questions = data;
    questionsLoaded = true;
    console.log('Questions loaded:', questions);
  })
  .catch ( error => {
    console.error('Error loading questions:', error);
    questionsLoaded = false;
  });

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