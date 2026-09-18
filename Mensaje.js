const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.querySelector(".chat-messages");

const userImage =
    "https://i.pinimg.com/736x/43/b8/f7/43b8f757efbe31ed48e6875165f3ee5d.jpg";


sendButton.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});


function sendMessage() {

    const text = messageInput.value.trim();

    if (text === "") {
        return;
    }

    const now = new Date();

    const date = now.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("es-MX", {
        hour: "numeric",
        minute: "2-digit"
    });

    const messageRow = document.createElement("div");

    messageRow.classList.add(
        "message-row",
        "user-message"
    );

    messageRow.innerHTML = `
        <img src="${userImage}" alt="Tu">

        <div class="message-content">

            <div class="message-name">
                Tu
            </div>

            <div class="message-bubble">
                ${text}
            </div>

            <span class="message-time">
                ${date}, ${time}
            </span>

        </div>
    `;

    chatMessages.appendChild(messageRow);

    messageInput.value = "";

    chatMessages.scrollTop = chatMessages.scrollHeight;

}