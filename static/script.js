const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");


function addMessage(message, type) {

    const messageDiv = document.createElement("div");

    messageDiv.className = `message ${type}`;

    const avatar = document.createElement("div");

    avatar.className = `message-avatar ${
        type === "ai" ? "ai-avatar" : "user-avatar"
    }`;

    avatar.textContent = type === "ai" ? "🤖" : "👤";


    const content = document.createElement("div");

    content.className = "message-content";

    content.textContent = message;


    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function showTyping() {

    const typingDiv = document.createElement("div");

    typingDiv.className = "message ai";
    typingDiv.id = "typingMessage";

    typingDiv.innerHTML = `
        <div class="message-avatar ai-avatar">🤖</div>

        <div class="message-content">
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function removeTyping() {

    const typingMessage =
        document.getElementById("typingMessage");

    if (typingMessage) {
        typingMessage.remove();
    }
}


async function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }


    addMessage(message, "user");

    messageInput.value = "";

    sendButton.disabled = true;

    showTyping();


    try {

        const response = await fetch("/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })

        });


        const data = await response.json();

        removeTyping();


        if (data.success) {

            addMessage(data.answer, "ai");

        } else {

            addMessage(
                "Sorry, I could not process your request right now.",
                "ai"
            );

        }


    } catch (error) {

        removeTyping();

        addMessage(
            "Unable to connect to the AI server. Please try again.",
            "ai"
        );

        console.error(error);

    }


    sendButton.disabled = false;

    messageInput.focus();
}


function askQuestion(question) {

    messageInput.value = question;

    sendMessage();

}


messageInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});