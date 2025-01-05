function speakText() {
    const text = "Mnemonic to remember the order of planets from the Sun:Mercury Venus Earth Mars JupiterSaturn Uranus Neptune Mnemonic: My Very Educated Mother Just Served Us Nachos";
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

