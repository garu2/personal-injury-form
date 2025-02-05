document.addEventListener("DOMContentLoaded", () => {
  const chatWindow = document.getElementById("chat-window");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendMessageButton = document.getElementById("send-message");
  const openChatbotButton = document.getElementById("open-chatbot");

  // Detect if we are on localhost or in production (Vercel)
  const BASE_URL = window.location.hostname.includes("localhost")
      ? "http://localhost:5000"
      : "https://tu-proyecto.vercel.app";

  // Create the spinner (loading)
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.style.display = "none"; 
  chatMessages.appendChild(spinner);

  openChatbotButton.addEventListener("click", () => {
      chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
  });

  sendMessageButton.addEventListener("click", async () => {
      const userMessage = chatInput.value.trim();
      if (!userMessage) return;

      appendMessage("You", userMessage);
      chatInput.value = "";

      // Show spinner while response is being processed
      spinner.style.display = "block";

      try {
          let response = await fetch(`${BASE_URL}/chatbot`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ message: userMessage })
          });

          let data = await response.json();

          // Hide spinner when answer is ready
          spinner.style.display = "none";
          appendMessage("Bot", data.response);
      } catch (error) {
          console.error("Chatbot error:", error);
          spinner.style.display = "none";
          appendMessage("Bot", "Sorry, I couldn't process your request.");
      }
  });

  function appendMessage(sender, message) {
      let messageElement = document.createElement("p");
      messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
