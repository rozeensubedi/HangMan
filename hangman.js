let selectedWord = "", hint = "";
let score = 0, highScore = 0, guesses = 0, guessedLetters = [], maxGuesses = 6, currentDifficulty = "Easy";
let usedWords = new Set();
let currentWordLength = 0;
let manuallyEnded = false;
let gameOverTimeout = null;

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
  manuallyEnded = false;
  if (gameOverTimeout) {
    clearTimeout(gameOverTimeout);
    gameOverTimeout = null;
  }

  const name = document.getElementById('playerName').value.trim();
  if (!name) return alert("Name is required!");

  currentDifficulty = document.getElementById('difficulty').value;
  document.getElementById('start-page').classList.add('hidden');
  document.getElementById('game-page').classList.remove('hidden');
  document.getElementById("currentLevel").innerText = currentDifficulty;

  document.getElementById("gameOverAlert").style.display = "none";
  document.getElementById("noWordsAlert").style.display = "none";


  score = 0;
  highScore = parseInt(localStorage.getItem("hangmanHighScore")) || 0;
  document.getElementById("score").innerText = score;
  document.getElementById("highScore").innerText = highScore;
  document.getElementById("highScoreInGame").innerText = highScore;

  usedWords.clear();
  currentWordLength = currentDifficulty === "Easy" ? 4 : currentDifficulty === "Medium" ? 6 : 9;

  loadNewWord();
}

async function loadNewWord() {      ////

  if (currentWordLength <= 0) {
    document.getElementById("noWordsAlert").style.display = "block";
    disableKeyboard();
    return;
  }
  
  document.getElementById("noWordsAlert").style.display = "none";

  const category = document.getElementById("category").value || "food";
  const apiUrl = `https://www.wordgamedb.com/api/v1/words/?category=${category}&numLetters=${currentWordLength}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const availableWords = data.filter(item => !usedWords.has(item.word.toLowerCase()));

    if (availableWords.length === 0) {
      currentWordLength--;
      loadNewWord();
      return;
    }

    const randomWordData = availableWords[Math.floor(Math.random() * availableWords.length)];
    selectedWord = randomWordData.word.toLowerCase();
    hint = randomWordData.hint || "Guess the word:";
    usedWords.add(selectedWord);

    guessedLetters = [];
    guesses = 0;

    document.getElementById("hint").textContent = hint;
    document.getElementById("guesses").textContent = `${guesses}/6`;
    updateWordDisplay();
    updateKeyboard();
    updateImage();
  } 
  catch (error) {
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
    document.getElementById("guesses").textContent = `${guesses}/6`;
    updateImage();

    if (guesses >= maxGuesses) {
      document.getElementById("guesses").textContent = `${guesses}/6`;
      updateImage();
      showGameOverMessage(selectedWord); 
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
  if (manuallyEnded) return;
  const image = document.getElementById("mainImage");
  image.src = `img/stickman${guesses === 0 ? "" : "-" + guesses}.jpg`;
}

function showGameOverMessage(word) {
  const alertBox = document.getElementById("gameOverAlert");
  document.getElementById("revealedWord").textContent = word;
  alertBox.style.display = "block";
  disableKeyboard();
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
  manuallyEnded = true;

  

  if (gameOverTimeout) {
    clearTimeout(gameOverTimeout);
    gameOverTimeout = null;
  }

  // makes visible
  document.getElementById("start-page").classList.remove("hidden");
  document.getElementById("game-page").classList.add("hidden");

  // Reset image
  document.getElementById("mainImage").src = "img/stickman.jpg";

  //hide noWordsAlert
  document.getElementById("noWordsAlert").style.display = "none";

  // Hide game over alert
  document.getElementById("gameOverAlert").style.display = "none";

}

function disableKeyboard() {
  const buttons = document.querySelectorAll("#keyboard button");
  buttons.forEach(btn => btn.disabled = true);
}


  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄';

    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    snowflake.style.animationDuration = (Math.random() * 3 + 3) + 's';

    document.getElementById('snowfall').appendChild(snowflake);

    setTimeout(() => snowflake.remove(), 8000);
  }

  setInterval(createSnowflake, 200); 


  const canvas = document.getElementById("stickmanCanvas");
  const ctx = canvas.getContext("2d");

  let angle = 0;

  function drawStickman(x, y, angle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // for head
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.stroke();

    // for body
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x, y + 50);
    ctx.stroke();

    // for arms
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x + 20 * Math.cos(angle), y + 25 + 20 * Math.sin(angle));
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x - 20 * Math.cos(angle), y + 25 - 20 * Math.sin(angle));
    ctx.stroke();

    // for legs
    ctx.beginPath();
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x + 20 * Math.cos(angle), y + 80);
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x - 20 * Math.cos(angle), y + 80);
    ctx.stroke();
  }

  function animate() {
    angle = Math.sin(Date.now() / 200) * 0.5;
    drawStickman(50, 40, angle); 
    requestAnimationFrame(animate);
  }

  animate();
  