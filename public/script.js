const socket = io('http://localhost:3000')

const samples = document.getElementsByClassName("add-sample");

for(let i = 0; i<samples.length;i++)
{
  samples[i].addEventListener("click", (e) => loadSample(e));
}


function loadSample (e) {
  const add_sample_div = e.target.closest(".add-sample");
  const instrument_div = e.target.closest(".instrument");
  add_sample_div.style.display="none";

  let fileInput = document.createElement("input");
  fileInput.setAttribute('type','file');
  fileInput.setAttribute('accept','.wav, .mp3');
  fileInput.addEventListener("change", (e)=>{
    const fileList = e.target.files;
    console.log(fileList[0]);
    socket.emit("send_audio",{
      file: fileList[0]
    });
  });

  instrument_div.prepend(fileInput);
};






const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
  const name = prompt('What is your name?')
  appendMessage('You joined')
  socket.emit('new-user', roomName, name)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    messageInput.value = ''
  })
}

socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}