document.addEventListener("DOMContentLoaded", () => {
  const chatBody = document.querySelector(".chat-body");
  const buttons = document.querySelectorAll(".chat-toggle-btn");
  const chatInput = document.querySelector(".chat-input");
  const sendBtn = document.querySelector(".send-msg-button");

  const chatMessages = {
    btn1: [
      "Oi, estou procurando um presente para minha esposa, mas não sei por onde começar. Alguma ideia? 🎁",
      "Olá! Tudo bem? 😊 Claro que posso te ajudar. Me fala um pouquinho sobre ela: gosta mais de coisas para o dia a dia, acessórios ou algo criativo?",
      "Ah, ela gosta de acessórios e ama cores neutras.",
      "Perfeito! Tenho algumas sugestões que podem combinar com o estilo dela. Que tal um colar minimalista com detalhes em prata? Ou um relógio clássico que é super elegante?",
      "Sim, quero ver como funciona!",
    ],
    btn2: [
      "Oi, preciso devolver um produto que comprei, mas não sei se ainda posso.",
      "Oi! Tudo bem? Vou te ajudar com isso. Você pode me informar o número do pedido ou o nome do produto? 📦",
      "O número do pedido é #56789.",
      "Obrigado! Verifiquei aqui e, sim, você está dentro do prazo de 30 dias para devolução. Só mais uma pergunta: o produto está na embalagem original?",
      "Está sim.",
      "Ótimo! Vou te enviar um link com as instruções para iniciar o processo.",
    ],
    btn3: [
      "Olá, estou com um problema para finalizar o pagamento no meu pedido. Aparece um erro estranho.",
      "Oi, tudo bem? Sinto muito pelo transtorno! Vou verificar aqui. Você está usando boleto ou cartão?",
      "Estou tentando pagar com cartão, mas dá erro na última etapa.",
      "Entendido! Parece ser um caso mais técnico. Vou transferir você agora para o Guilherme, do nosso time de pagamentos, para resolvermos isso rapidinho. 🚀",
      "Olá, aqui é o Guilherme! Recebi as informações do seu caso e vou revisar os detalhes do pagamento.",
    ],
    btn4: [
      "Oi, estou pensando em comprar o seu produto, mas queria saber se é compatível com Mac e iPhone.",
      "Olá! Sim, é compatível com ambos. 💻📱 Ele funciona no macOS Ventura e no iOS 16 ou superior. Se precisar, posso te mandar um link com o guia de instalação.",
      "Ah, legal! E o suporte ajuda se eu tiver dúvidas?",
      "Claro! Nosso suporte funciona 24/7, e você pode falar comigo ou com um atendente humano. Se quiser, posso te mostrar como agendar uma demonstração.",
    ],
  };

  let typingInterval; // Variável para controlar o intervalo de digitação
  let currentMessageIndex = 0; // Índice para acompanhar a mensagem atual
  let autoSwitchTimer; // Timer para alternar automaticamente entre os temas

  const displayMessage = (text, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = text;

    chatBody.prepend(messageElement);

    setTimeout(() => {
      messageElement.classList.add("visible");
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const simulateTypingInInput = (message, callback) => {
    clearInterval(typingInterval); // Limpa qualquer intervalo anterior

    let index = 0;
    chatInput.value = ""; // Limpa o campo de input

    typingInterval = setInterval(() => {
      if (index < message.length) {
        chatInput.value += message[index];
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          callback(); // Chama o callback para enviar a mensagem
        }, 500); // Aguarda um pequeno delay antes de enviar
      }
    }, 40); // Tempo para cada letra ser "digitada"
  };

  const simulateUserTyping = (message, theme, callback) => {
    simulateTypingInInput(message, () => {
      displayMessage(message, "message-right");
      chatInput.value = ""; // Limpa o campo de input após o envio
      callback();
    });
  };

  const simulateBotResponse = (messages, onComplete) => {
    if (currentMessageIndex < messages.length - 1) {
      currentMessageIndex++;
      const responseMessage = messages[currentMessageIndex];

      setTimeout(() => {
        displayMessage(responseMessage, "message-left");
        if (currentMessageIndex < messages.length - 1) {
          currentMessageIndex++;
          simulateUserTyping(messages[currentMessageIndex], "", () => simulateBotResponse(messages, onComplete));
        } else if (onComplete) {
          onComplete();
        }
      }, 1500); // Aguarda 1.5 segundo antes de responder
    }
  };

  const initializeChat = (buttonId) => {
    const button = document.querySelector(`#${buttonId}`);
    if (button) {
      buttons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");

      currentMessageIndex = 0; // Reinicia o índice da mensagem
      chatBody.innerHTML = ""; // Limpa o conteúdo da conversa

      const theme = `theme-${button.id}`;
      const messages = chatMessages[button.id];

      simulateUserTyping(messages[0], theme, () => simulateBotResponse(messages, switchToNextTheme));
    }
  };

  const switchToNextTheme = () => {
    const currentButton = document.querySelector(".chat-toggle-btn.selected");
    const currentIndex = Array.from(buttons).indexOf(currentButton);
    const nextIndex = (currentIndex + 1) % buttons.length; // Próximo botão (circular)
    const nextButton = buttons[nextIndex];

    autoSwitchTimer = setTimeout(() => {
      initializeChat(nextButton.id);
    }, 3000); // Aguarda 3 segundos antes de mudar para o próximo tema
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      clearTimeout(autoSwitchTimer); // Cancela a troca automática ao clicar
      initializeChat(button.id);
    });
  });

  // Inicia o chat automaticamente ao carregar a página
  initializeChat("btn1");
  switchToNextTheme(); // Começa o fluxo automático
});
