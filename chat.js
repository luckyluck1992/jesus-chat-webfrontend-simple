let messages = [];

function renderMessages() {
  const container = document.getElementById('messages');
  container.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = msg.sender;
    const span = document.createElement('span');
    span.innerText = msg.text;
    if (msg.loading) span.classList.add('loading');
    div.appendChild(span);
    container.appendChild(div);
  });
  container.scrollTop = container.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;

  // Nutzer-Nachricht
  messages.push({ sender: 'user', text });
  renderMessages();
  input.value = '';

  // Placeholder für Jesus
  const placeholder = { sender: 'jesus', text: 'Jesus antwortet ...', loading: true };
  messages.push(placeholder);
  const placeholderIndex = messages.length - 1;
  renderMessages();

  // Anfrage ans Backend
  fetch('https://foto-ice-finishing-hardcover.trycloudflare.com/message', {
    method: 'POST',
    body: text
  })
    .then(response => {
      if (!response.ok) throw new Error('Fehler: ' + response.status);
      return response.json();
    })
    .then(data => {
      const regx = /<think>[\s\S]*?<\/think>/g;
      let answer = data.response.replace(regx, '');
      messages[placeholderIndex] = { sender: 'jesus', text: answer };
      renderMessages();
    })
    .catch(error => {
      console.error(error);
      messages[placeholderIndex] = { sender: 'jesus', text: "Jesus ist zur zeit leider nicht verfügbar. Er wird woanders gebraucht, um Frieden und Freude für die Menschen zu schaffen! " +
                                "Call Jesus later Bro!" };
      renderMessages();
    });
}
