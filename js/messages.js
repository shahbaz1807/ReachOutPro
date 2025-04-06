// Extract category name from query parameter
const urlParams = new URLSearchParams(window.location.search);
const categoryName = urlParams.get("id");

// Check if categoryName is valid
if (!categoryName) {
    console.error("Category name is missing in the URL.");
    alert("Category name is missing in the URL.");
    window.location.href = "index.html";
} else {
    console.log("Category name:", categoryName);
}

// DOM elements
const backButton = document.getElementById("backButton");
const categoryTitle = document.getElementById("categoryTitle");
const loadingMessages = document.getElementById("loadingMessages");
const noMessages = document.getElementById("noMessages");
const messagesList = document.getElementById("messagesList");
const newMessageInput = document.getElementById("newMessage");
const sendMessageBtn = document.getElementById("sendMessageBtn");

// Data
let messages = [];

// Load messages from backend
async function loadMessages() {
    try {
        const response = await fetch(`https://reach-out-pro-backend.vercel.app/categories/${categoryName}`);
        const data = await response.json();

        if (data.success) {
            messages = data.data.messages;
            categoryTitle.textContent = data.data.name; // Show category title
            renderMessages();
        } else {
            console.error("Error loading messages:", data.error);
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("en-PK", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
    });
}

// Render messages
function renderMessages() {
    messagesList.innerHTML = "";

    if (messages.length === 0) {
        loadingMessages.style.display = "none";
        noMessages.style.display = "block";
        messagesList.style.display = "none";
        return;
    }

    loadingMessages.style.display = "none";
    noMessages.style.display = "none";
    messagesList.style.display = "flex";

    messages.forEach((message) => {
        const messageElement = document.createElement("div");
        messageElement.className = "message";

        // Replace \n with <br> for line breaks in HTML
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-time">${formatDate(message.createdAt)}</span>
            </div>
            <p>${message.text.replace(/\n/g, "<br>")}</p>
        `;

        messagesList.appendChild(messageElement);
    });
}


// Add new message
async function addMessage() {
    const messageText = newMessageInput.value.trim();

    if (messageText) {
        const newMessage = {
            category: categoryName,    // This is required by your server
            message: messageText       // This is also required by your server
        };

        try {
            const response = await fetch(`https://reach-out-pro-backend.vercel.app/add-message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMessage),
            });

            const data = await response.json();

            if (data.success) {
                // Push the last added message from the updated messages array
                const latestMessage = data.data.messages[data.data.messages.length - 1];
                messages.push(latestMessage);
                renderMessages();
                newMessageInput.value = "";
            } else {
                console.error("Failed to add message:", data.error);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
}


// Initialize
function init() {
    // Back button event
    backButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Send message events
    sendMessageBtn.addEventListener("click", addMessage);
    newMessageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addMessage();
        }
    });

    categoryTitle.textContent = "Loading...";
    loadMessages();
}

init();
