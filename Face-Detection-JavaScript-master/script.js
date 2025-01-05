const video = document.getElementById('video');

// Emotion weights for attentiveness
const emotionWeights = {
  neutral: 1.0,
  happy: 0.8,
  surprised: 0.7,
  sad: -0.4,
  angry: -0.6,
  fearful: -0.5,
  disgusted: -0.7,
};

// Variables to store cumulative scores
let totalWeightedSum = 0;
let detectionCount = 0;

// Start video and load models
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
      video.srcObject = stream;
    },
    err => console.error(err)
  );
}

// Attentiveness score calculation
function calculateAttentiveness(expressions) {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [emotion, probability] of Object.entries(expressions)) {
    if (emotionWeights[emotion] !== undefined) {
      weightedSum += probability * emotionWeights[emotion];
      totalWeight += probability;
    }
  }

  // Normalize score to scale 1–10
  const rawScore = weightedSum / (totalWeight || 1); // Avoid division by zero
  const normalizedScore = Math.max(1, Math.min(10, (rawScore + 1) * 5)); // Scale -1 to 1 --> 1 to 10
  return normalizedScore;
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  // Create a container for attentiveness
  const attentivenessDisplay = document.createElement('div');
  attentivenessDisplay.id = 'attentiveness-score';
  attentivenessDisplay.style.position = 'absolute';
  attentivenessDisplay.style.bottom = '10px';
  attentivenessDisplay.style.left = '10px';
  attentivenessDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  attentivenessDisplay.style.color = 'white';
  attentivenessDisplay.style.padding = '10px';
  attentivenessDisplay.style.borderRadius = '5px';
  attentivenessDisplay.style.fontFamily = 'Arial, sans-serif';
  attentivenessDisplay.style.fontSize = '18px';
  attentivenessDisplay.textContent = 'Calculating attentiveness...';
  document.body.appendChild(attentivenessDisplay);

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

    // Calculate attentiveness for all detections
    detections.forEach(detection => {
      const expressions = detection.expressions;
      const score = calculateAttentiveness(expressions);

      // Update cumulative scores
      totalWeightedSum += score;
      detectionCount++;

      // Update attentiveness display
      const averageScore = (totalWeightedSum / detectionCount).toFixed(2);
      attentivenessDisplay.textContent = `Attentiveness: ${averageScore} / 10`;
    });
  }, 1000);
});
