document.addEventListener("DOMContentLoaded", function() {
    const chatBox = document.getElementById("chat-box");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-btn");

    sendButton.addEventListener("click", function() {
      const message = messageInput.value.trim();
      if (message !== "") {
        sendMessage(message);
        messageInput.value = ""; // Clear the input field after sending the message
      }
    });

    function sendMessage(message) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/generate-response", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText).response;
            receiveMessage(response);
          } else {
            console.error("Error:", xhr.status, xhr.statusText);
          }
        }
      };
      xhr.send(JSON.stringify({ user_input: message }));
    }

    function receiveMessage(response) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", "received");
      messageElement.textContent = response;
      chatBox.appendChild(messageElement);
      chatBox.scrollTop = chatBox.scrollHeight; // Automatically scroll to the bottom of the chat box
    }
  });