const socket = io('http://localhost:3000')

const samples = document.getElementsByClassName("add-sample");
//const joinBtns = document.getElementsByClassName('join-room-btn');


/*for(let i = 0; i<joinBtns.length;i++)
{
  joinBtns[i].addEventListener("click", (e) => redirectToRoom(e));
}*/


for(let i = 0; i<samples.length;i++)
{
  samples[i].addEventListener("click", (e) => loadSample(e));
}

/*function redirectToRoom(e){

  socket.emit('joining-room',e.target.id);
  let domain = location.host;
  window.location.replace(window.location.protocol + "//" + domain+e.target.id);
};*/

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
      file: fileList[0],
      roomName,
      instrumentNum: instrument_div.id,
    });
  });

  instrument_div.prepend(fileInput);
};

socket.on('user-connected', name => {
  console.log('user connected:'+name);
})


socket.on('audio_url', (downloadURL,instrumentNum) => {
  console.log('REACHY');
  console.log(downloadURL);
  console.log(instrumentNum);
  const audioDiv = document.createElement("audio");
  audioDiv.setAttributes("src",downloadURL);
});


const joinPublicBtn = document.getElementById('join-public-btn');

/*
joinPublicBtn.addEventListener('click',function(){
  socket.emit('joining-room');
});*/


const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

if (messageForm != null) {
  const name = prompt('What is your name?')
  appendMessage('You joined')
  socket.emit('joining-room', roomName, name)

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