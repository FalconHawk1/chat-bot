const navTriggerBtn = document.querySelector('#nav_trigger_btn');
const navMenu = document.querySelector('#nav_menu');

let questionIndex = 0;
let answers = {};
let questions = [];
let questionsLoaded = false;
let step = 0;
let userInfo = {};
 
let facial = "Un tratamiento facial es una excelente elección para revitalizar tu piel. ¿Te gustaría agendar tu cita?";
let hidroterapia = "La hidroterapia es ideal para aliviar el estrés. ¿Te gustaría agendar tu cita?";
let masajes = "Un masaje es la mejor manera de desconectar. ¿Te gustaría agendar tu cita?";
let aromaterapia = "La aromaterapia es una experiencia sensorial única. ¿Te gustaría agendar tu cita?";

/*
document.querySelector('#facial').addEventListener('click', () => startChat('facial'));
document.getElementById('hidroterapia').addEventListener('click', () => startChat('hidroterapia'));
document.getElementById('masajes').addEventListener('click', () => startChat('masajes'));
document.getElementById('aromaterapia').addEventListener('click', () => startChat('aromaterapia'));

function startChat(service) {
    toggleChat();
    showInitialMessage(service);
}

function showInitialMessage(service) {
    const chatContent = document.getElementById('chatContent');
    
    // Mensaje de bienvenida (sólo si es la primera vez)
    if (questionIndex === 0 && !chatContent.innerHTML.includes('Bienvenido a su servicio de spa')) {
        const greeting = "Bienvenido a su servicio de spa. ¿En qué puedo ayudarle?";
        chatContent.innerHTML += `
            <div class="bot-message flex items-center bg-blue-600 text-accent p-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ${greeting}
            </div>`;
    }

    // Mensaje relacionado al servicio
    const message = serviceMessages[service];
    chatContent.innerHTML += `<div class="bot-message">${message}</div>`;
    
    scrollToBottom();
}
*/
function toggleChat(servicio) {
    const chatBox = document.getElementById('chatbot-window');
    const chatContent = document.getElementById('chatContent');
    chatContent.innerHTML = '';

    chatBox.classList.toggle('hidden');

    if (!chatBox.classList.contains('hidden')) {
        if (questionIndex === 0 && questionsLoaded) {
            askQuestion();
        }

        if (servicio) {
            // Mostrar el mensaje del servicio seleccionado
            chatContent.innerHTML += 
            `<div class="bot-message text-accent flex items-center p-2 rounded-lg gap-2 my-1">
                <i class="ri-user-line mr-3"></i>
                ${servicio}
            </div>`;
            scrollToBottom();
        }

    }
}

function scrollToBottom() {
    const chatContent = document.getElementById('chatContent');
    chatContent.scrollTop = chatContent.scrollHeight;

    console.log(scrollHeight)
}

function askQuestion() {
    const chatContent = document.getElementById('chatContent');

    const greeting = "Bienvenido a su servicio de spa.";
    chatContent.innerHTML += `
        <div class="bot-message text-accent flex items-center p-2 gap-2 rounded-lg my-1">
            <i class="ri-robot-line mr-3 flex items-start"></i>
            ${greeting}
        </div>`;
    
    scrollToBottom();
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value.trim();
    const chatContent = document.getElementById('chatContent');

    if (userInput === '') return;

    chatContent.innerHTML += `
        <div class="user-message flex items-center bg-gray-300 text-gray-700 p-2 gap-2 rounded-lg my-1">
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
            const response = matchingQuestion["Respuesta"];
            chatContent.innerHTML += `
                <div class="bot-message flex items-center text-accent gap-2 p-2 rounded-lg my-1">
                    <i class="ri-robot-line p-2"></i>
                    ${response}
                </div>`;
            step = 1;
            chatContent.innerHTML += `
                <div class="bot-message flex items-center text-accent p-2 gap-2 rounded-lg my-1">
                    <i class="ri-robot-line mr-2"></i>
                    Indicanos tu nombre para continuar con la reserva.
                </div>`;
        } else {
            chatContent.innerHTML += `
                <div class="bot-message flex items-center text-accent p-2 gap-2 rounded-lg my-1">
                    <i class="ri-error-warning-line mr-2"></i>
                    Lo siento, no entendí tu respuesta.
                </div>`;
        }
    } else if (step === 1) {
        userInfo.name = userInput;
        step = 2;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center text-accent p-2 gap-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿Cuántos años tienes?
            </div>`;
    } else if (step === 2) {
        userInfo.age = userInput;
        step = 3;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center text-accent p-2 gap-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿Qué servicio quieres reservar?
            </div>`;
    } else if (step === 3) {
        userInfo.service = userInput;
        step = 4;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center text-accent p-2 gap-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿A qué hora quieres reservar?
            </div>`;
    } else if (step === 4) {
        userInfo.time = userInput;
        step = 5;
        chatContent.innerHTML += `
            <div class="bot-message flex items-center text-accent p-2 gap-2 rounded-lg my-1">
                <i class="ri-robot-line mr-2"></i>
                ¿Cuando quieres agendar la cita?
            </div>`;
    } else if (step === 5) {
        userInfo.date = userInput;
        step = 0;


        if (window.confirm("Desea confirmar su reserva?")) {
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
                    <div class="bot-message flex items-center text-accent p-2 gap-2 rounded-lg my-1">
                        <i class="ri-check-line mr-2"></i>
                        ¡Gracias! Hemos recibido tu información:
                        Su reserva está en proceso...
                    </div>`;

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
        } else {
            chatContent.innerHTML += `
                    <div class="bot-message flex items-center bg-red-600 text-accent p-2 rounded-lg my-1">
                        <i class="ri-error-warning-line mr-2"></i>
                        La reserva ha sido cancelada.
                    </div>`;
        }
                

        function showAlert(type, message) {
            const alertBox = document.createElement('div');
            let alertTemplate = '';

            if (type === 'success') {
                alertTemplate = `
                    <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                        <div class="flex">
                            <div class="py-1">
                                <svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="font-bold">Éxito</p>
                                <p class="text-sm">${message}</p>
                            </div>
                        </div>
                    </div>`;
            } else if (type === 'error') {
                alertTemplate = `
                    <div class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md" role="alert">
                        <div class="flex">
                            <div class="py-1">
                                <svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="font-bold">Error</p>
                                <p class="text-sm">${message}</p>
                            </div>
                        </div>
                    </div>`;
            }

            alertBox.innerHTML = alertTemplate;
            document.body.appendChild(alertBox);

            setTimeout(() => {
                alertBox.remove();
            }, 5000);
        }
    }
    scrollToBottom();
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