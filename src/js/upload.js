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
const preview = document.getElementById('preview')

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
  record.innerHTML = 'Grabar'
}

function getDuration() {
  let seconds = 0;
  let minutes = 0;
  let timer = setInterval(() => {
    if (recording) {
      if (seconds < 60) {
        if (seconds < 9) {
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


function uploadGif(gif) {

  // formateamos el post según las necesidades particulares de la api de giphy
  // la api key se manda en la url
  fetch('https://upload.giphy.com/v1/gifs' + '?api_key=' + apiKey, {
    method: 'POST', // or 'PUT'
    body: gif,
  }).then(res => {
    return res.json();
  }).then(data => {
    console.log(data)
    const id = localStorage.length
    localStorage.setItem('gif' + id, JSON.stringify(data));
  })
  .catch(error => console.error('Error:', error));
}