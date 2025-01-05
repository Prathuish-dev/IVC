function speakText() {
    const text = "Mnemonic to remember the continents: Antarctica, Africa, Asia, Europe, Oceania, North America, South America. Mnemonic: Aunt Alice Ate Every Orange Near Sunflowers";
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

function previousQuestion() {
    // Logic to navigate to the previous question
    alert("Navigate to the previous question");
}

function nextQuestion() {
    // Logic to navigate to the next question
    alert("Navigate to the next question");
}
