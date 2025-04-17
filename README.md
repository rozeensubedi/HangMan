# 🎮 HangMan Game

A web-based Hangman game with category selection, difficulty levels, score tracking, and a polished user interface.

---

🧠 About the Project

This is a classic Hangman game built with HTML, CSS, and JavaScript. Players can choose from different categories and difficulty levels, guess letters to reveal hidden words, and try to beat the high score. The game also includes sound effects and celebratory animations when a new high score is achieved.

---

🕹️ How to Play

1. Enter your name.
2. Choose levels: Easy, Medium, or Hard.
3. Choose categoory: Animal, Country, Food, Plant, or Sport.
4. Click Start Game.
5. Read the question or hint, then guess the word one letter at a time.
6. Use the on-screen keyboard or type letters.
7. Guess correctly to increase your score.
8. The game ends after 6 incorrect guesses.

---

✨ Features

- Difficulty Levels: Easy, Medium, and Hard
- Player Name Input
- Dynamic category loading from Word Game DB 
- Real-time score and high score tracking using localStorage
- Keyboard input support
- Word pool reset after completion
- Sound Effects on High Score
- Emoji Animation Bursts for Celebrations
- Responsive UI Design
- Progressive hangman images as lives decrease

---

📷 Screenshots

![image alt](https://github.com/rozeensubedi/Hangman/blob/777dae85324af691765dcc6aea68b718b0cf5c82/img/hangman-start-page.png)

![image alt](https://github.com/rozeensubedi/Hangman/blob/777dae85324af691765dcc6aea68b718b0cf5c82/img/hangman-game-page.png)

---

🗂️ Project Structure

- hangman					# Main folder
	- /img                    		# Hangman image folder
		- stickman.jpg
		- stickman-1.jpg
		- ... up to stickman-6.jpg
		- hangman-game-Page.png
		- hangman-start-page.png
	- /sound                  		# Sound folder
		- applause-sound.mp3
	- /style.css				# CSS folder
		- style.css
	- README.md               		# Project documentation (this file)
	- hangman.html              		# Main HTML file

---

🧰 Technologies Used

- HTML5

- CSS

- JavaScript

- External API

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

	- Open hangman.html in your preferred browser.

	- Start playing! 🎉

---

📬 API Used

- WordGameDB – used for fetching words and questions based on difficulty and category.

---



