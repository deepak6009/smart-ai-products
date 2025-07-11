const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');
if (!productId) alert("❌ Missing product_id");

let chatHistory = [];

function displayMessage(sender, message) {
  const chatBox = document.getElementById("chatBox");
  const msg = document.createElement("div");
  msg.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
  msg.innerHTML = message.replace(/\n/g, "<br>");
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  displayMessage("user", message);
  chatHistory.push({ role: "user", content: message });
  input.value = "";

  const res = await fetch("https://ube2eg0cl4.execute-api.us-east-1.amazonaws.com/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: productId,
      user_message: message,
      chat_history: chatHistory
    })
  });

  const data = await res.json();
  const reply = data.reply || "No reply found.";
  const audioUrl = data.audio_url;

  displayMessage("bot", reply);
  chatHistory.push({ role: "assistant", content: reply });

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
