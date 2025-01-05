const video = document.getElementById('video');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

let videoStream = null;
function speakText() {
    const text = "Mnemonic to remember the continents: Antarctica, Africa, Asia, Europe, Australia, North America, South America. Mnemonic: Aunt Alice Ate Every Orange Near Sunflowers";
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

function toggleWhiteNoise() {
    const whiteNoise = document.getElementById('whiteNoise');
    if (whiteNoise.paused) {
        whiteNoise.play();
    } else {
        whiteNoise.pause();
    }
}

// Variables to store emotion counts
const emotionCounts = {
  neutral: 0,
  happy: 0,
  sad: 0,
  angry: 0,
  fearful: 0,
  disgusted: 0,
  surprised: 0,
};
let totalDetections = 0;

// Emotion to emoji mapping
const emotionEmojis = {
  neutral: '😐',
  happy: '😊',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😲',
};

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => {
      videoStream = stream;
      video.srcObject = stream;
    },
    err => console.error(err)
  );
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  // Position the video above the list of emojis
  video.style.position = 'absolute';
  video.style.bottom = '380px';
  video.style.right = '10px';

  // Create the list container for emotions
  const emotionList = document.createElement('ul');
  emotionList.id = 'emotion-list';
  emotionList.style.position = 'absolute';
  emotionList.style.bottom = '10px';
  emotionList.style.right = '10px';
  emotionList.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  emotionList.style.padding = '10px';
  emotionList.style.borderRadius = '5px';
  emotionList.style.fontFamily = 'Arial, sans-serif';
  emotionList.style.fontSize = '16px';
  document.body.appendChild(emotionList);

  // Create a container for displaying the dominant emotion
  const dominantEmotionDisplay = document.createElement('div');
  dominantEmotionDisplay.id = 'dominant-emotion';
  dominantEmotionDisplay.style.position = 'absolute';
  dominantEmotionDisplay.style.bottom = '10px';
  dominantEmotionDisplay.style.left = '10px';
  dominantEmotionDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  dominantEmotionDisplay.style.color = 'white';
  dominantEmotionDisplay.style.padding = '10px';
  dominantEmotionDisplay.style.borderRadius = '5px';
  dominantEmotionDisplay.style.fontFamily = 'Arial, sans-serif';
  dominantEmotionDisplay.style.fontSize = '18px';
  dominantEmotionDisplay.textContent = 'Analyzing...';
  document.body.appendChild(dominantEmotionDisplay);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // Process emotions
    detections.forEach(detection => {
      const expressions = detection.expressions;
      const maxEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      // Increment emotion count
      if (maxEmotion in emotionCounts) {
        emotionCounts[maxEmotion]++;
      }
      totalDetections++;
    });

    // Update the list dynamically
    emotionList.innerHTML = '';
    Object.keys(emotionCounts).forEach(emotion => {
      const percentage = totalDetections
        ? ((emotionCounts[emotion] / totalDetections) * 100).toFixed(2)
        : 0;
      const listItem = document.createElement('li');
      listItem.textContent = `${emotionEmojis[emotion]} ${emotion}: ${percentage}%`;
      emotionList.appendChild(listItem);
    });

    // Display the dominant emotion
    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
      emotionCounts[a] > emotionCounts[b] ? a : b
    );

    const dominantPercentage = totalDetections
      ? ((emotionCounts[dominantEmotion] / totalDetections) * 100).toFixed(2)
      : 0;

    dominantEmotionDisplay.textContent = `The student mostly is ${emotionEmojis[dominantEmotion]} ${dominantEmotion} (${dominantPercentage}%)`;
  }, 1000);
});
