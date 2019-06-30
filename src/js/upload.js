// Constantes útiles

const apiKey = 'JQhP1sBxi7d1SKpBsMlFDJYPGUobpcpK';
const apiBaseUrl = 'http://api.giphy.com/v1/gifs/';

// Subir gifs

// Elementos del HTML con los que vamos a interactuar
const start = document.getElementById('start')
const video = document.querySelector('video')
const record = document.getElementById('record')
const stop = document.getElementById('stop')
const restart = document.getElementById('restart');
const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const progressBar = document.getElementsByClassName('progress-bar-item');
const uploadMessage = document.getElementById('upload-msg')
const download = document.getElementById('download')
const copy = document.getElementById('copy')
const nav = document.getElementById('nav')
const main  = document.getElementById('main')


 // definimos el objeto recorder - tiene que se global para que podamos accederlo en todos los listeners
 let recorder;


 // También una variable recording para manejar el timer
 let recording = false;


// Obtener video y grabación

function getStreamAndRecord () {
   
    // empieza a correr la cámara
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { 
      height: { max: 480 }
    }
  })
    .then(function(stream) {

      // Usamos el stream de la cámara como source de nuestra tag <video> en el html
      video.srcObject = stream;
      video.play()
       
      record.addEventListener('click', () => {

      document.getElementById('camera-button').src = './../../public/images/Combined Shape.svg'

      this.disabled = true;
      recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
          console.log('started')
        },
      });
      
      recorder.startRecording();
      recording = true
      getDuration()
     
      // modificamos el dom para que se note que estamos grabando
      record.classList.add('button-recording')
      record.innerHTML = 'Listo'
      stop.classList.add('button-recording')

      // cortamos el stream de la cámara
      recorder.camera = stream; 

      stop.addEventListener('click', () => {
          this.disabled = true;
          recorder.stopRecording(stopRecordingCallback);
          recording = false;
      });
    });
  });
}


function stopRecordingCallback() {

  // le damos el formato requerido a la data que vamos a enviar como body de nuestro 
  // POST request
  let form = new FormData();
  form.append("file", recorder.getBlob(), 'test.gif');
  
  upload.addEventListener('click', () => {
    uploadMessage.classList.remove('hidden');
    preview.classList.add('hidden')
    animateProgressBar(progressBar);
    uploadGif(form)
  })

  recorder.camera.stop();
  
  objectURL = URL.createObjectURL(recorder.getBlob());
  preview.src = objectURL;

  // modificamos el dom para mostrar la preview, remover el timer
  preview.classList.remove('hidden')
  video.classList.add('hidden')
  document.getElementById('video-record-buttons').classList.add('hidden');
  document.getElementById('video-upload-buttons').classList.remove('hidden');


  recorder.destroy();
  recorder = null;
 
}

start.addEventListener('click', () => {
  // cambiamos de modal pre a modal grabación
  document.getElementById('pre-upload-text').classList.add('hidden');
  document.getElementById('pre-upload-video').classList.remove('hidden');
  
  getStreamAndRecord()
});

restart.addEventListener('click', () => {
  resetDOMtoInitialState()
  getStreamAndRecord()
})

function resetDOMtoInitialState() {
  preview.classList.add('hidden')
  video.classList.remove('hidden')
  document.getElementById('video-record-buttons').classList.remove('hidden');
  document.getElementById('video-upload-buttons').classList.add('hidden');
  record.classList.remove('button-recording')
  stop.classList.remove('button-recording')
  uploadMessage.classList.add('hidden')
  record.innerHTML = 'Grabar'
  document.getElementById('timer').innerHTML=`00:00:00:00`;
  main.classList.remove('gray')
  nav.classList.remove('gray')
  document.getElementById('share-modal-wrapper').add('hidden')
}

function getDuration() {
  let seconds = 0;
  let minutes = 0;
  let timer = setInterval(() => {
    if (recording) {
      if (seconds < 60) {
        if (seconds <= 9) {
          seconds = '0' + seconds;
        }
        document.getElementById('timer').innerHTML=`00:00:0${minutes}:${seconds}`;
        seconds++;
      } else {
        minutes++;
        seconds = 0;
      }
    }
    else {
      clearInterval(timer)
    }
  }, 1000);
} 

// Barra de progreso

let paintedBar = document.getElementsByClassName('progress-bar-item-active')

let counter = 0;
function animateProgressBar (bar) {
    setInterval(() => {
      if (counter < bar.length) {
        bar.item(counter).classList.toggle('progress-bar-item-active')
        counter++;
      } else {
        counter = 0;
      }
    }, 200)
} 



function uploadGif(gif) {

  // formateamos el post según las necesidades particulares de la api de giphy
  // la api key se manda en la url
  fetch('https://upload.giphy.com/v1/gifs' + '?api_key=' + apiKey, {
    method: 'POST', // or 'PUT'
    body: gif,
  }).then(res => {
    console.log(res.status)
    if (res.status != 200 ) {
      uploadMessage.innerHTML = `<h3>Hubo un error subiendo tu Guifo</h3>`
    }
    return res.json();  
  }).then(data => {
    uploadMessage.classList.add('hidden');
    document.getElementById('share-modal-wrapper').classList.remove('hidden')
    // generamos un id único para nuestro gif
    const id = localStorage.length + 1
    
    // TODO traerlos con un get para que sea más consistente y sobreviva cambios a la arq de giphy
    const gifUrl = 'https://media3.giphy.com/media/' + data.data.id + '/200.gif'

    /* Seteamos el dom para mostrar nuestro modal de success */
      preview.classList.remove('hidden')
      main.classList.add('gray')
      nav.classList.add('gray')
    
     document.getElementById('share-modal-preview').src = gifUrl; 
     copy.addEventListener('click', () => {
        document.execCommand('copy', gifUrl);
        alert("Copiado! " + gifUrl);
     })

     document.getElementById('finish').addEventListener('click', () => {
       resetDOMtoInitialState()
     })

     //download.href = gifUrl
     download.download = 'mygif.gif'
    // lo agregamos al local storage
    localStorage.setItem('gif' + id, gifUrl);
  })
  .catch(error => {
    uploadMessage.innerHTML = (`<h3>Hubo un error subiendo tu Guifo</h3>`)
    console.error('Error:', error)
  });
}

function getMyGifs () {
  let items = [];
  for (var i = 0; i < localStorage.length; i++){
    let item = localStorage.getItem(localStorage.key(i))
    if (item.includes('giphy')) {
      items.push(item)
    }
  }
  return items
}

window.addEventListener('load', () => {
  const localGifs = getMyGifs()
  
  localGifs.forEach(item => {
    const img = document.createElement('img')
    img.src = item;
    img.classList.add('results-thumb');
    document.getElementById('results').appendChild(img);
  })
})

getMyGifs()