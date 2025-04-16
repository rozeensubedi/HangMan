let selectedWord = "", hint = "";
let score = 0, highScore = 0, guesses = 0, guessedLetters = [], maxGuesses = 6, currentDifficulty = "Easy";

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

  score = 0;
  highScore = parseInt(localStorage.getItem("hangmanHighScore")) || 0;
  document.getElementById("score").innerText = score;
  document.getElementById("highScore").innerText = highScore;
  document.getElementById("highScoreInGame").innerText = highScore;

  loadNewWord();
}
async function loadNewWord() {
  let numLetters = currentDifficulty === "Easy" ? 4 : currentDifficulty === "Medium" ? 6 : 6;
  let category = document.getElementById("category").value || "food";
  let apiUrl = `https://www.wordgamedb.com/api/v1/words/?category=${category}&numLetters=${numLetters}`;


  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !data.length) {
      alert("No data found.");
      return;
    }

    const randomWordData = data[Math.floor(Math.random() * data.length)];
    selectedWord = randomWordData.word.toLowerCase();
    hint = randomWordData.hint || "Guess the word:";

    guessedLetters = [];
    guesses = 0;

    document.getElementById("hint").textContent = hint;
    document.getElementById("guesses").textContent = guesses;
    updateWordDisplay();
    updateKeyboard();
    updateImage();
  } catch (error) {
    console.error("Error fetching word:", error);
    alert("Failed to fetch word from API.");
  }
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
    document.getElementById("guesses").textContent = guesses;
    updateImage();
    if (guesses >= maxGuesses) {
      alert("Game Over! The word was: " + selectedWord);
      endGame();
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
