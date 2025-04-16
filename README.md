# 🎮 HangMan Game

A fun and interactive **Hangman** game built using **HTML**, **CSS**, and **JavaScript** — featuring multiple difficulty levels, emoji bursts, custom alerts, hangman visual feedback, and sound-based celebrations!

---

🕹️ How to Play

1. Enter your name.
2. Select a difficulty level: Easy, Medium, or Hard.
3. Click Start Game.
4. Read the question or hint, then guess the word one letter at a time.
5. Use the on-screen keyboard or type letters.
6. Guess correctly to increase your score.
7. The game ends after 6 incorrect guesses.

---

✨ Features

- Difficulty Levels: Easy, Medium, and Hard
- Player Name Input
- Dynamic Questions with Hints
- Score Tracking & High Score Persistence (LocalStorage)
- Visual Feedback with Hangman Image Progression
- Sound Effects on High Score
- Emoji Animation Bursts for Celebrations
- Responsive UI Design

---

📷 Screenshots

![image alt](https://github.com/rozeensubedi/Hangman/blob/8ba6f4ff88c141eee0460b12b33c64ef780de150/img/startPage.png)

![image alt](https://github.com/rozeensubedi/Hangman/blob/8ba6f4ff88c141eee0460b12b33c64ef780de150/img/mainPage.png)

---

🗂️ Project Structure

- hangman				# Main folder
	- /img                    	# Hangman image folder
		- stickman.jpg
		- stickman-1.jpg
		- ... up to stickman-6.jpg
		- startPage.png
		- mainPage.png
	- /sound                  	# Sound folder
		- applause-sound.mp3
	- README.md               	# Project documentation (this file)
	- hangman.html              	# Main HTML file
	- hangman.css                	# CSS Stylesheet

---

🧰 Technologies Used

- HTML5

- CSS

- JavaScript

- <audio> tag for sound effects

- @keyframes for emoji animations

- localStorage for persistent high score

- Responsive layout using basic CSS techniques

 ---

💎 Custom Features Highlight

- Animated Emoji Burst – celebratory 🎉 and 🎊 emoji effects when achieving a new high score.

- Custom Alert Popup – congratulatory message with animation for high score achievement.

- Progressive Hangman Image – updates image step-by-step as wrong guesses increase.

---

⚙️ Installation & Setup

1. Clone the repository:

	- git clone https://github.com/rozeensubedi/Hangman.git

	- cd hangman-game

2. Add your own media (optional):

	- Add hangman image files to the /img folder.

	- Add your applause sound to the /sound folder.

3. Launch the game:

	- Open index.html in your preferred browser.

	- Start playing! 🎉

---

📬 API Used

- WordGameDB – used for fetching words and questions based on difficulty and category.

---



