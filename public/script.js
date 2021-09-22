const socket = io('http://localhost:3000')

let trackData = {
  current_step: 1,

  bpm: 120,

  tracks:[]
};

trackData.tracks = new Array(7).fill(new Array(32).fill(false));

function loop () {
  clearHighlight();
  highlightBoxes();

  if(trackData.current_step + 1 === 33)
  {
    trackData.current_step = 1; 
  }
  else
  {
    trackData.current_step += 1;
  }
  window.setTimeout(loop,(60/trackData.bpm)*1000);
};

loop();


let bpm_div = document.querySelector('#bpm');
bpm_div.addEventListener('change',function(){
  trackData.bpm = bpm_div.value;
});


let grid_boxes = document.getElementsByClassName('drum-box');

for(let i=0;i<grid_boxes.length;i++)
{
  grid_boxes[i].addEventListener('click',(e)=>{
    if(e.target.classList.contains("clicked"))
    {
      e.target.classList.remove("clicked");
      for(let i = 0; i<e.target.classList.length;i++)
      {
        if(e.target.classList[i].includes('step'))
        {
          let searchStep = e.target.classList[i].indexOf('-');
          let stepIndex = e.target.classList[i].substring(searchStep+1);
          let searchInstrument = e.target.closest('.instrument').id.indexOf('-');
          let instrumentIndex = e.target.closest('.instrument').id.substring(searchInstrument+1);
          
          trackData.tracks[instrumentIndex-1][stepIndex-1] = false;
        }
      }
    }
    else
    {
      e.target.classList.add("clicked");
      for(let i = 0; i<e.target.classList.length;i++)
      {
        if(e.target.classList[i].includes('step'))
        {
          let searchStep = e.target.classList[i].indexOf('-');
          let stepIndex = e.target.classList[i].substring(searchStep+1);
          let searchInstrument = e.target.closest('.instrument').id.indexOf('-');
          let instrumentIndex = e.target.closest('.instrument').id.substring(searchInstrument+1);
          
          trackData.tracks[instrumentIndex-1][stepIndex-1] = true;
        }
      }
    }
  })
}

function clearHighlight () {
  const divsToRemoveHighlight = document.getElementsByClassName('highlighted');

  while(divsToRemoveHighlight.length)
  {
    divsToRemoveHighlight[0].classList.remove('highlighted');
  }
}

function highlightBoxes () {
  const divsToHighlight = document.getElementsByClassName('step-'+trackData.current_step);
  
  for(let i=0;i<divsToHighlight.length;i++)
  {
    divsToHighlight[i].classList.add('highlighted');
  }
};  

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
    socket.emit("send_audio",{
      file: fileList[0],
      roomName,
      instrumentNum: instrument_div.id,
      fileName:fileList[0].name,
    });
  });

  instrument_div.prepend(fileInput);
};

socket.on('user-connected', name => {
  console.log('user connected:'+name);
})

socket.on('upload-complete', (fileName,downloadURL,instrumentNum) =>{
  /*console.log(instrumentNum);
  const instrumentDiv = document.getElementById(instrumentNum);
  if(instrumentDiv.querySelector('input'))
  {
    instrumentDiv.querySelector('input').remove();
  }
  instrumentDiv.querySelector('.add-sample').style.display="flex";*/
});

socket.on('audio_url', (fileName, downloadURL,instrumentNum) => {
  appendMessage(`${fileName} uploaded`)
  const audioDiv = document.createElement("audio");
  audioDiv.setAttribute("src",downloadURL);
  const instrumentDiv = document.getElementById(instrumentNum);
  if(instrumentDiv !== null)
  {
    instrumentDiv.querySelector('.add-sample').querySelector('.add-sample-descrip').innerText = fileName;
    instrumentDiv.prepend(audioDiv);
    audioDiv.play();
  }

  if(instrumentDiv.querySelector('input'))
  {
    instrumentDiv.querySelector('input').remove();
  }
  instrumentDiv.querySelector('.add-sample').style.display="flex";
});


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