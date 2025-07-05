const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/chat.html'));
});

app.listen(5500, () => {
  console.log("🤖 Chatbot running on http://localhost:5500");
});
