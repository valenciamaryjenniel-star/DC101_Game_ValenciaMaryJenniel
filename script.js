let playerQueue = [];
let computerQueue = [];
let undoCount = 3;


const moveIcons = {
  "Rock": "🪨",
  "Paper": "📄",
  "Scissors": "✂️"
};

// Timestamp generator
function getTimeStamp() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `[${h}:${m}:${s}]`;
}

// Log message
function addLog(msg) {
  const logBox = document.getElementById("logContent");
  const entry = document.createElement("p");
  entry.innerHTML = `<span class="timestamp">${getTimeStamp()}</span> ${msg}`;
  logBox.appendChild(entry);
  logBox.scrollTop = logBox.scrollHeight;
}

// Add move
function addMove(move) {
  if (playerQueue.length >= 5) {
    alert("You can only select up to 5 moves!");
    return;
  }

  playerQueue.push(move);
  document.getElementById("playerMoves").innerText =
    `Your Queue: [${playerQueue.join(", ")}]`;

  addLog(`You added <b>${move}</b> to your queue.`);

  if (playerQueue.length > 0 && undoCount > 0) {
    document.getElementById("undoBtn").disabled = false;
  }

  if (playerQueue.length >= 3) {
    document.getElementById("startBtn").disabled = false;
  }
}

// Undo move
function undoMove() {
  if (playerQueue.length === 0 || undoCount <= 0) return;

  const removed = playerQueue.pop();
  undoCount--;

  addLog(`<span class="important-log">↩️ Undo used!</span> Removed <b>${removed}</b> from your queue.`);

  document.getElementById("playerMoves").innerText =
    `Your Queue: [${playerQueue.join(", ")}]`;

  // Update undo button label
  document.getElementById("undoBtn").innerText = `↩️ Undo (${undoCount})`;

  if (undoCount === 0 || playerQueue.length === 0) {
    document.getElementById("undoBtn").disabled = true;
  }

  if (playerQueue.length < 3) {
    document.getElementById("startBtn").disabled = true;
  }
}

// Start game
function startGame() {
  const options = ["Rock", "Paper", "Scissors"];
  const numMoves = playerQueue.length;

  computerQueue = [];
  for (let i = 0; i < numMoves; i++) {
    computerQueue.push(options[Math.floor(Math.random() * 3)]);
  }

  addLog(`<hr><b>GAME START!</b>`);
  addLog(`Computer prepared ${numMoves} moves.`);

  document.querySelector(".container").classList.add("hidden");
  document.getElementById("resultContainer").classList.remove("hidden");

  revealRounds();
}

// Reveal rounds
function revealRounds() {
  let playerScore = 0;
  let computerScore = 0;
  const totalRounds = playerQueue.length;
  const roundResultsDiv = document.getElementById("roundResults");
  roundResultsDiv.innerHTML = "";

  function playNextRound(roundIndex) {
    if (roundIndex >= totalRounds) {
      let finalMessage = "";
      if (playerScore > computerScore) finalMessage = "⭐ YOU WIN! ⭐";
      else if (playerScore < computerScore) finalMessage = "👾 COMPUTER WINS!";
      else finalMessage = "🤝 IT'S A TIE!";

      document.getElementById("finalResult").innerText = finalMessage;
      addLog(`<hr><span class="important-log"><b>Final Result:</b> ${finalMessage}</span>`);

      return;
    }

    const playerMove = playerQueue.shift();
    const computerMove = computerQueue.shift();
    const winner = determineWinner(playerMove, computerMove);
    document.getElementById("roundDisplay").innerText = "Round " + (roundIndex + 1);


    addLog(
      `Round ${roundIndex + 1}: You chose <b>${playerMove}</b>, Computer chose <b>${computerMove}</b>`
    );

    if (winner === "Player") {
      playerScore++;
      addLog(`<span class="important-log">✅ You WIN the round!</span>`);
    } else if (winner === "Computer") {
      computerScore++;
      addLog(`<span class="important-log">❌ Computer wins the round.</span>`);
    } else {
      addLog(`<span class="important-log">🤝 Round is a tie.</span>`);
    }

    const card = document.createElement("div");
    card.className = "round-card";
    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.innerHTML = `<span style="font-size:24px;">🃏 Round ${roundIndex + 1}</span>`;

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    cardBack.innerHTML = `
      <div style="font-size: 40px;">${moveIcons[playerMove]} vs ${moveIcons[computerMove]}</div>
    `;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    roundResultsDiv.appendChild(card);

    setTimeout(() => cardInner.classList.add("flipped"), 500);
    setTimeout(() => playNextRound(roundIndex + 1), 1500);
  }

  playNextRound(0);
}

// Winner calculation
function determineWinner(pMove, cMove) {
  if (pMove === cMove) return "Tie";
  if (
    (pMove === "Rock" && cMove === "Scissors") ||
    (pMove === "Paper" && cMove === "Rock") ||
    (pMove === "Scissors" && cMove === "Paper")
  ) return "Player";
  return "Computer";
}
// Undo move
function undoMove() {
  if (playerQueue.length === 0 || undoCount <= 0) return;

  const removed = playerQueue.pop();
  undoCount--;

  // 🔥 NEW WARNING WHEN ONLY 1 UNDO REMAINS
  if (undoCount === 1) {
    showUndoWarning();
}


  addLog(`<span class="important-log">↩️ Undo used!</span> Removed <b>${removed}</b> from your queue.`);

  document.getElementById("playerMoves").innerText =
    `Your Queue: [${playerQueue.join(", ")}]`;

  // Update undo button label
  document.getElementById("undoBtn").innerText = `↩️ Undo (${undoCount})`;

  if (undoCount === 0 || playerQueue.length === 0) {
    document.getElementById("undoBtn").disabled = true;
  }

  if (playerQueue.length < 3) {
    document.getElementById("startBtn").disabled = true;
  }
}
function showUndoWarning() {
  document.getElementById("undoWarning").classList.remove("hidden");
}

function closeUndoWarning() {
  document.getElementById("undoWarning").classList.add("hidden");
}

// Reset
function playAgain() {
  location.reload();
}
