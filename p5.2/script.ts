// Text-to-Speech
document.getElementById('speakButton').addEventListener('click', function() {
    const text = document.getElementById('question').innerText;
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
});

// Answer Selection
const answers = document.querySelectorAll('.answer');
answers.forEach(answer => {
    answer.addEventListener('click', function() {
        answers.forEach(btn => btn.classList.remove('bg-blue-500', 'text-white'));
        this.classList.add('bg-blue-500', 'text-white');
    });
});

// White Noise Player
let isPlaying = false;
const audio = new Audio('https://www.soundjay.com/nature/sounds/rain-01.mp3'); // Example white noise
document.getElementById('playPauseButton').addEventListener('click', function() {
    if (isPlaying) {
        audio.pause();
        this.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        this.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// Navigation Buttons
document.getElementById('prevButton').addEventListener('click', function() {
    alert('Previous question');
});

document.getElementById('nextButton').addEventListener('click', function() {
    alert('Next question');
});
