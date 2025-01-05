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
        // Remove existing styles from all answers
        answers.forEach(btn => btn.classList.remove('bg-green-500', 'bg-red-500', 'text-white'));

        // Apply styles based on correctness
        if (this.getAttribute('data-correct') === 'true') {
            this.classList.add('bg-green-500', 'text-white'); // Green for correct answer
        } else {
            this.classList.add('bg-red-500', 'text-white'); // Red for incorrect answer
        }

        // Mark other incorrect buttons as red
        answers.forEach(btn => {
            if (btn !== this && btn.getAttribute('data-correct') === 'false') {
                btn.classList.add('bg-red-500', 'text-white');
            }
        });
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
});

document.getElementById('nextButton').addEventListener('click', function() {
});
