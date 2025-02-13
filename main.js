document.addEventListener("DOMContentLoaded", () => {
  const chatBody = document.querySelector(".chat-body");
  const buttons = document.querySelectorAll(".chat-toggle-btn");
  const chatInput = document.querySelector(".chat-input");
  const sendBtn = document.querySelector(".send-msg-button");

  const chatMessages = {
    btn1: [
      "Oi, estou procurando um presente para minha esposa, mas não sei por onde começar. Alguma ideia? 🎁",
      "**WOZ**: Olá! Tudo bem? 😊 Claro que posso te ajudar. Me fala um pouquinho sobre ela: gosta mais de coisas para o dia a dia, acessórios ou algo criativo?",
      "Ah, ela gosta de acessórios e ama cores neutras.",
      "**WOZ**: Perfeito! Tenho algumas sugestões que podem combinar com o estilo dela. Que tal um colar minimalista com detalhes em prata? Ou um relógio clássico que é super elegante?",
      "Sim, quero ver como funciona!",
    ],
    btn2: [
      "Oi, preciso devolver um produto que comprei, mas não sei se ainda posso.",
      "**WOZ**: Oi! Tudo bem? Vou te ajudar com isso. Você pode me informar o número do pedido ou o nome do produto? 📦",
      "O número do pedido é #56789.",
      "**WOZ**: Obrigado! Verifiquei aqui e, sim, você está dentro do prazo de 30 dias para devolução. Só mais uma pergunta: o produto está na embalagem original?",
      "Está sim.",
      "**WOZ**: Ótimo! Vou te enviar um link com as instruções para iniciar o processo.",
    ],
    btn3: [
      "Olá, estou com um problema para finalizar o pagamento no meu pedido. Aparece um erro estranho.",
      "**WOZ**: Oi, tudo bem? Sinto muito pelo transtorno! Vou verificar aqui. Você está usando boleto ou cartão?",
      "Estou tentando pagar com cartão, mas dá erro na última etapa.",
      "**WOZ**: Entendido! Parece ser um caso mais técnico. Vou transferir você agora para o Guilherme, do nosso time de pagamentos, para resolvermos isso rapidinho. 🚀",
      "Olá, aqui é o Guilherme! Recebi as informações do seu caso e vou revisar os detalhes do pagamento.",
    ],
    btn4: [
      "Oi, estou pensando em comprar o seu produto, mas queria saber se é compatível com Mac e iPhone.",
      "**WOZ**: Olá! Sim, é compatível com ambos. 💻📱 Ele funciona no macOS Ventura e no iOS 16 ou superior. Se precisar, posso te mandar um link com o guia de instalação.",
      "Ah, legal! E o suporte ajuda se eu tiver dúvidas?",
      "**WOZ**: Claro! Nosso suporte funciona 24/7, e você pode falar comigo ou com um atendente humano. Se quiser, posso te mostrar como agendar uma demonstração.",
    ],
  };

  let typingInterval;
  let currentMessageIndex = 0;
  let autoSwitchTimer;

  const displayMessage = (text, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = text;
    messageElement.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    chatBody.prepend(messageElement);

    setTimeout(() => {
      messageElement.classList.add("visible");
      chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  const simulateTypingInInput = (message, callback) => {
    clearInterval(typingInterval);

    let index = 0;
    chatInput.value = "";
    chatInput.style.height = "1.5em"; // Define altura mínima como uma linha

    typingInterval = setInterval(() => {
      if (index < message.length) {
        chatInput.value += message[index];
        chatInput.scrollTop = chatInput.scrollHeight; // Faz o texto rolar automaticamente
        chatInput.style.height = `${chatInput.scrollHeight, 60}px`; // Ajusta a altura dinamicamente
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          if (typeof callback === "function") {
            callback();
          }
        }, 500);
      }
    }, 40);
  };

  const simulateUserTyping = (message, callback) => {
    simulateTypingInInput(message, () => {
      displayMessage(message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'), "message-right");
      chatInput.value = "";
      chatInput.style.height = "1.5em"; // Redefine para altura mínima após envio
      if (typeof callback === "function") {
        callback();
      }
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
          simulateUserTyping(messages[currentMessageIndex], () => simulateBotResponse(messages, onComplete));
        } else if (onComplete && typeof onComplete === "function") {
          onComplete();
        }
      }, 1500);
    }
  };

  const initializeChat = (buttonId, onComplete) => {
    const button = document.querySelector(`#${buttonId}`);
    if (button) {
      const mockupScreen = document.querySelector(".mockup-screen");

      // Remove todas as classes de tema anteriores
      mockupScreen.classList.remove(
        "theme-btn1",
        "theme-btn2",
        "theme-btn3",
        "theme-btn4"
      );

      // Adiciona a classe do tema correspondente
      mockupScreen.classList.add(`theme-${button.id}`);

      // Remove a classe 'selected' de todos os botões
      buttons.forEach((btn) => btn.classList.remove("selected"));

      // Adiciona a classe 'selected' apenas ao botão clicado
      button.classList.add("selected");

      console.log(`Tema aplicado: theme-${button.id}`); // Debug

      currentMessageIndex = 0;
      chatBody.innerHTML = "";

      const messages = chatMessages[button.id];
      simulateUserTyping(messages[0], () => {
        simulateBotResponse(messages, () => {
          if (onComplete) {
            onComplete(); // Chama o callback após a conversa ser concluída
          }
        });
      });
    }
  };

  const switchToNextTheme = () => {
    const currentButton = document.querySelector(".chat-toggle-btn.selected");
    const currentIndex = Array.from(buttons).indexOf(currentButton);
    const nextIndex = (currentIndex + 1) % buttons.length;
    const nextButton = buttons[nextIndex];

    console.log(`Alternando para o próximo tema: ${nextButton.id}`); // Debug

    autoSwitchTimer = setTimeout(() => {
      initializeChat(nextButton.id, switchToNextTheme); // Inicia a próxima conversa
    }, 5000); // Aguarda 5 segundos antes de mudar para o próximo tema
  };

  // Inicia o chat automaticamente ao carregar a página
  initializeChat("btn1", switchToNextTheme);

  // Adiciona event listeners para os botões
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      clearTimeout(autoSwitchTimer); // Cancela a troca automática ao clicar
      initializeChat(button.id, switchToNextTheme); // Inicia a conversa do botão clicado
    });
  });
});