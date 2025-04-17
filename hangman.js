let selectedWord = "", hint = "";
let score = 0, highScore = 0, guesses = 0, guessedLetters = [], maxGuesses = 6;
let currentDifficulty = "Easy";


const wordPools = {
  Easy: {},
  Medium: {},
  Hard: {}
};

const usedWords = {
  Easy: new Set(),
  Medium: new Set(),
  Hard: new Set()
};

const difficultySettings = {
  Easy: { start: 5, min: 4 },
  Medium: { start: 7, min: 5 },
  Hard: { start: 10, min: 7 }
};

let currentLengthByDifficulty = {
  Easy: 5,
  Medium: 7,
  Hard: 10
};


window.onload = () => {
  loadCategories();
};

async function loadCategories() {
  const categorySelect = document.getElementById('category');
  try {
    const res = await fetch('https://www.wordgamedb.com/api/v1/categories');
    const data = await res.json();
    categorySelect.innerHTML = "";
    data.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load categories:", err);
    categorySelect.innerHTML = `<option value="food">Food (default)</option>`;
  }
}

function startGame() {
  const name = document.getElementById('playerName').value.trim();
  if (!name) return alert("Name is required!");

  currentDifficulty = document.getElementById('difficulty').value;
  document.getElementById('start-page').classList.add('hidden');
  document.getElementById('game-page').classList.remove('hidden');
  document.getElementById("currentLevel").innerText = currentDifficulty;

  
  document.getElementById("gameOverAlert").style.display = "none";
  document.getElementById("customAlert").style.display = "none";

  score = 0;
  highScore = parseInt(localStorage.getItem("hangmanHighScore")) || 0;
  document.getElementById("score").innerText = score;
  document.getElementById("highScore").innerText = highScore;
  document.getElementById("highScoreInGame").innerText = highScore;

  loadNewWord();
}

// loop which decrease and reset to the orignal length
async function loadNewWord() {
    const category = document.getElementById("category").value || "food";
    const settings = difficultySettings[currentDifficulty];
    let length = currentLengthByDifficulty[currentDifficulty];
  
    while (length >= settings.min) {
      // Load pool if not already
      if (!wordPools[currentDifficulty][length]) {
        try {
          const apiUrl = `https://www.wordgamedb.com/api/v1/words/?category=${category}&numLetters=${length}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          wordPools[currentDifficulty][length] = data || [];
        } catch (err) {
          console.error(`Error loading ${length}-letter words:`, err);
          wordPools[currentDifficulty][length] = [];
        }
      }
  
      // Available word that not used
      const pool = wordPools[currentDifficulty][length].filter(wordObj =>
        !usedWords[currentDifficulty].has(wordObj.word.toLowerCase())
      );
  
      if (pool.length > 0) {
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        selectedWord = chosen.word.toLowerCase();
        hint = chosen.hint || "Guess the word:";
        usedWords[currentDifficulty].add(selectedWord);
  
        guessedLetters = [];
        guesses = 0;
  
        document.getElementById("hint").textContent = hint;
        document.getElementById("guesses").textContent = `${guesses}/6`;
        updateWordDisplay();
        updateKeyboard();
        updateImage();
        return;
      }
  
      // if no more words at this length, try next smaller length
      length--;
      currentLengthByDifficulty[currentDifficulty] = length;
    }
  
    // Reset back to start if all word completed
    currentLengthByDifficulty[currentDifficulty] = settings.start;
    usedWords[currentDifficulty].clear();
    loadNewWord();
  }
  
  

function updateWordDisplay() {
  let display = "";
  for (let char of selectedWord) {
    display += guessedLetters.includes(char) ? char + " " : "_ ";
  }
  document.getElementById("wordDisplay").textContent = display.trim();
}

document.addEventListener("keydown", function(event) {
  const letter = event.key?.toLowerCase();
  if (/^[a-z]$/.test(letter) && !guessedLetters.includes(letter) && guesses < maxGuesses) {
    handleLetterClick(letter);
  }
});

function updateKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = '';
  for (let i = 65; i <= 90; i++) {
    const char = String.fromCharCode(i).toLowerCase();
    const btn = document.createElement("button");
    btn.textContent = char.toUpperCase();
    btn.id = char;
    btn.disabled = guessedLetters.includes(char) || guesses >= maxGuesses;
    btn.onclick = () => handleLetterClick(char);
    keyboard.appendChild(btn);
  }
}

function handleLetterClick(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);
  document.getElementById(letter).disabled = true;

  if (selectedWord.includes(letter)) {
    updateWordDisplay();
    if (isWordGuessed()) {
      score += 5;
      const wasHighScore = score > highScore;
      updateScore();

      if (wasHighScore) {
        showCustomAlert();
        playCongratsSound();
        burstEmojis();
      }

      setTimeout(loadNewWord, 1000);
    }
  } else {
    guesses++;
    document.getElementById("guesses").textContent = `${guesses}/6`;
    updateImage();


    if (guesses >= maxGuesses) {
      document.getElementById("guesses").textContent = `${guesses}/6`;
      updateImage();
      setTimeout(() => {
        showGameOverMessage(selectedWord);
      }, 100);
    } 
  }

  updateKeyboard();
}

function isWordGuessed() {
  return [...selectedWord].every(char => guessedLetters.includes(char));
}

function updateScore() {
  document.getElementById("score").textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("hangmanHighScore", score);
    document.getElementById("highScore").textContent = score;
    document.getElementById("highScoreInGame").textContent = score;
  }
}

function updateImage() {
  const image = document.getElementById("mainImage");
  image.src = `img/stickman${guesses === 0 ? "" : "-" + guesses}.jpg`;
}

function showGameOverMessage(word) {
  document.getElementById("gameOverAlert").style.display = "none";

  document.getElementById("revealedWord").textContent = word;
  alertBox.style.display = "block";
  
  setTimeout(() => {
    alertBox.style.display = "none";
    endGame();
  }, 3000); 
}


function showCustomAlert() {
  const alertBox = document.getElementById("customAlert");
  alertBox.style.display = "block";
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 2000);
}

function playCongratsSound() {
  const audio = document.getElementById("congratsSound");
  audio.currentTime = 0;
  audio.play();
}

function burstEmojis() {
  for (let i = 0; i < 10; i++) {
    createEmoji("🎉", "left");
    createEmoji("🎊", "right");
  }
}

function createEmoji(char, side) {
  const emoji = document.createElement("div");
  emoji.classList.add("emoji");
  emoji.textContent = char;
  emoji.style.left = side === "left" ? "0px" : "calc(100% - 30px)";
  emoji.style.bottom = "0px";
  document.body.appendChild(emoji);
  setTimeout(() => emoji.remove(), 2000);
}

function endGame() {
  document.getElementById("start-page").classList.remove("hidden");
  document.getElementById("game-page").classList.add("hidden");
}

function showGameOverMessage(word) {
  const alertBox = document.getElementById("gameOverAlert");
  document.getElementById("revealedWord").textContent = word;
  alertBox.style.display = "block";
  disableKeyboard();
}

function disableKeyboard() {
  const buttons = document.querySelectorAll("#keyboard button");
  buttons.forEach(btn => btn.disabled = true);
}
