const herName = "Palak (Chatori)";
const metDate = "2025-12-11T00:00:00";
const defaultNextDate = "2026-03-14T19:00:00";
const password = "11-12";
const nextMeetStorageKey = "loveStoryNextMeetDate";
const defaultMissYouNumber = "6350631658";
let nextDate = localStorage.getItem(nextMeetStorageKey) || defaultNextDate;

// Personalize simple text values.
document.getElementById("herName").textContent = herName;
document.getElementById("sinceDate").textContent = metDate.slice(0, 10);
document.getElementById("nextDate").textContent = nextDate.replace("T", " ");
const nextMeetInput = document.getElementById("nextMeetInput");
if (nextMeetInput) nextMeetInput.value = nextDate;

// Scroll reveal.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Smooth start button.
document.getElementById("scrollStart").addEventListener("click", () => {
  document.getElementById("timeline").scrollIntoView({ behavior: "smooth" });
});

// Side miss-you ping button (SMS helper).
const missYouBtn = document.getElementById("missYouBtn");
if (missYouBtn) {
  missYouBtn.addEventListener("click", () => {
    const message = `I miss you right now ❤️ (${new Date().toLocaleTimeString()})`;
    window.location.href = `sms:${defaultMissYouNumber}?&body=${encodeURIComponent(message)}`;
  });
}

// Background music toggle.
const audio = document.getElementById("ourSong");
const musicBtn = document.getElementById("musicToggle");
let playing = false;
musicBtn.addEventListener("click", async () => {
  try {
    if (!playing) {
      await audio.play();
      musicBtn.textContent = "Pause Our Song";
    } else {
      audio.pause();
      musicBtn.textContent = "Play Our Song";
    }
    playing = !playing;
  } catch {
    musicBtn.textContent = "Add assets/our-song.mp3";
  }
});

// Beauty notes cards.
const beautyNotes = [
  "Your eyes are so beautiful, I first fell for your eyes and later for you",
  "When you smile, your eyes smile too",
  "Even when you cry, you look so cute",
  "When you open your hair, you look beautiful",
  "You look stunning in traditional outfits",
  "Your cute little habits make me smile",
  "When you try to act cute, it works every time",
  "Your voice feels soft and addictive",
  "Your laugh is my favorite sound",
  "Your hugs feel warm, safe, and peaceful",
  "Your face in random moments looks unreal",
  "Your expressions are naturally pretty",
  "The way you carry yourself is beautiful",
  "Your simple look is still my weakness",
  "You look beautiful in every mood"
];

const reasonsGrid = document.getElementById("reasonsGrid");
beautyNotes.forEach((note, idx) => {
  const card = document.createElement("article");
  card.className = "reason-card";
  card.innerHTML = `
    <div class="reason-inner">
      <div class="reason-face reason-front"><strong>Beauty Note #${idx + 1}</strong><br />Tap to reveal</div>
      <div class="reason-face reason-back">${note} 💖</div>
    </div>
  `;
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    card.classList.remove("love-hit");
    void card.offsetWidth;
    card.classList.add("love-hit");
    setTimeout(() => card.classList.remove("love-hit"), 700);
  });
  reasonsGrid.appendChild(card);
});

// Floating hearts animation.
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "float-heart";
  heart.textContent = "💗";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${4 + Math.random() * 5}s`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 9000);
}
setInterval(spawnHeart, 1200);

// Catch-the-hearts game.
const gameArea = document.getElementById("gameArea");
const basket = document.getElementById("basket");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const resultEl = document.getElementById("gameResult");
const highScoreValueEl = document.getElementById("highScoreValue");
const highScoreByEl = document.getElementById("highScoreBy");
const gamePlayerSelect = document.getElementById("gamePlayerSelect");
const gameScoreStorageKey = "loveStoryGameHighScore";
let gameTimer;
let heartTimer;
let timeLeft = 30;
let score = 0;
let basketX = gameArea.clientWidth / 2;
let highScore = { score: 0, by: "Not set" };

try {
  const savedScore = JSON.parse(localStorage.getItem(gameScoreStorageKey) || "{}");
  if (Number.isFinite(savedScore.score) && typeof savedScore.by === "string") {
    highScore = {
      score: savedScore.score,
      by: savedScore.by || "Not set"
    };
  }
} catch {}

function renderHighScore() {
  if (highScoreValueEl) highScoreValueEl.textContent = String(highScore.score || 0);
  if (highScoreByEl) highScoreByEl.textContent = highScore.by || "Not set";
}

renderHighScore();

function moveBasket(x) {
  const min = 20;
  const max = gameArea.clientWidth - 20;
  basketX = Math.min(max, Math.max(min, x));
  basket.style.left = `${basketX}px`;
}

document.addEventListener("mousemove", (e) => {
  const rect = gameArea.getBoundingClientRect();
  if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
    moveBasket(e.clientX - rect.left);
  }
});

gameArea.addEventListener("touchmove", (e) => {
  const rect = gameArea.getBoundingClientRect();
  moveBasket(e.touches[0].clientX - rect.left);
});

function dropHeart() {
  const heart = document.createElement("span");
  heart.className = "falling-heart";
  heart.textContent = "❤️";
  const x = Math.random() * (gameArea.clientWidth - 26);
  let y = -20;
  heart.style.left = `${x}px`;
  gameArea.appendChild(heart);

  const fall = setInterval(() => {
    y += 3.4;
    heart.style.top = `${y}px`;

    const basketCenter = basketX;
    const heartCenter = x + 12;
    if (y > gameArea.clientHeight - 45 && Math.abs(basketCenter - heartCenter) < 32) {
      score += 1;
      scoreEl.textContent = score;
      heart.remove();
      clearInterval(fall);
    }

    if (y > gameArea.clientHeight + 12) {
      heart.remove();
      clearInterval(fall);
    }
  }, 16);
}

function endGame() {
  clearInterval(gameTimer);
  clearInterval(heartTimer);
  const playerName = gamePlayerSelect?.value || "Aloo Paratha";
  if (score > highScore.score) {
    highScore = { score, by: playerName };
    localStorage.setItem(gameScoreStorageKey, JSON.stringify(highScore));
    renderHighScore();
    resultEl.textContent = `Final score: ${score}. New highest score by ${playerName}. Beat this record!`;
    return;
  }
  resultEl.textContent = `Final score: ${score}. Beat this record!`;
}

document.getElementById("startGame").addEventListener("click", () => {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = "0";
  timeEl.textContent = "30";
  resultEl.textContent = "";

  gameArea.querySelectorAll(".falling-heart").forEach((h) => h.remove());

  clearInterval(gameTimer);
  clearInterval(heartTimer);

  gameTimer = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  heartTimer = setInterval(dropHeart, 580);
});

// Time counters.
function getDiffParts(ms) {
  const total = Math.max(ms, 0);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((total / (1000 * 60)) % 60);
  const secs = Math.floor((total / 1000) % 60);
  return { days, hours, mins, secs };
}

function updateCounters() {
  const now = Date.now();
  const since = new Date(metDate).getTime();
  const date = new Date(nextDate).getTime();

  const together = getDiffParts(now - since);
  const countdown = getDiffParts(date - now);

  document.getElementById("timeTogether").textContent = `${together.days}d ${together.hours}h ${together.mins}m ${together.secs}s`;
  document.getElementById("nextDateCountdown").textContent = `${countdown.days}d ${countdown.hours}h ${countdown.mins}m ${countdown.secs}s`;
}
setInterval(updateCounters, 1000);
updateCounters();

const saveNextMeetBtn = document.getElementById("saveNextMeet");
if (saveNextMeetBtn) {
  saveNextMeetBtn.addEventListener("click", () => {
    const picked = (nextMeetInput?.value || "").trim();
    if (!picked) return;
    nextDate = picked;
    localStorage.setItem(nextMeetStorageKey, nextDate);
    document.getElementById("nextDate").textContent = nextDate.replace("T", " ");
    updateCounters();
  });
}

// Movie night planner.
const movieStorageKey = "loveStoryMovies";
const movieSuggestInput = document.getElementById("movieSuggestInput");
const addMovieSuggestBtn = document.getElementById("addMovieSuggest");
const movieSuggestList = document.getElementById("movieSuggestList");
const movieWatchedInput = document.getElementById("movieWatchedInput");
const movieRatingInput = document.getElementById("movieRatingInput");
const addMovieWatchedBtn = document.getElementById("addMovieWatched");
const movieWatchedList = document.getElementById("movieWatchedList");

function loadMovies() {
  try {
    const parsed = JSON.parse(localStorage.getItem(movieStorageKey) || "{}");
    return {
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
      watched: Array.isArray(parsed.watched) ? parsed.watched : []
    };
  } catch {
    return { watchlist: [], watched: [] };
  }
}

function saveMovies(data) {
  localStorage.setItem(movieStorageKey, JSON.stringify(data));
}

let moviesData = loadMovies();

function renderMovieLists() {
  if (movieSuggestList) {
    if (!moviesData.watchlist.length) {
      movieSuggestList.innerHTML = "<p class=\"section-intro\">No movie added yet.</p>";
    } else {
      movieSuggestList.innerHTML = moviesData.watchlist
        .map(
          (movie, idx) => `
          <article class="movie-item">
            <div class="movie-item-main">
              <p class="movie-title">${movie.title}</p>
              <p class="movie-sub">To watch together</p>
            </div>
            <button class="movie-del" data-type="watchlist" data-index="${idx}">Delete</button>
          </article>
        `
        )
        .join("");
    }
  }

  if (movieWatchedList) {
    if (!moviesData.watched.length) {
      movieWatchedList.innerHTML = "<p class=\"section-intro\">No watched movie saved yet.</p>";
    } else {
      movieWatchedList.innerHTML = moviesData.watched
        .map(
          (movie, idx) => `
          <article class="movie-item">
            <div class="movie-item-main">
              <p class="movie-title">${movie.title}</p>
              <p class="movie-sub">Rating: ${movie.rating}/5</p>
            </div>
            <button class="movie-del" data-type="watched" data-index="${idx}">Delete</button>
          </article>
        `
        )
        .join("");
    }
  }

  document.querySelectorAll(".movie-del").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const index = Number(btn.dataset.index);
      if (!Number.isInteger(index)) return;
      if (type === "watchlist") moviesData.watchlist.splice(index, 1);
      if (type === "watched") moviesData.watched.splice(index, 1);
      saveMovies(moviesData);
      renderMovieLists();
    });
  });
}

if (addMovieSuggestBtn) {
  addMovieSuggestBtn.addEventListener("click", () => {
    const title = (movieSuggestInput?.value || "").trim();
    if (!title) return;
    moviesData.watchlist.push({ title });
    saveMovies(moviesData);
    renderMovieLists();
    movieSuggestInput.value = "";
  });
}

if (addMovieWatchedBtn) {
  addMovieWatchedBtn.addEventListener("click", () => {
    const title = (movieWatchedInput?.value || "").trim();
    const rating = Number(movieRatingInput?.value || 5);
    if (!title) return;
    moviesData.watched.push({ title, rating });
    saveMovies(moviesData);
    renderMovieLists();
    movieWatchedInput.value = "";
    if (movieRatingInput) movieRatingInput.value = "5";
  });
}

renderMovieLists();

// Digital love letter editor.
const loveLetterStorageKey = "loveStoryLetterText";
const loveLetterInput = document.getElementById("loveLetterInput");
const saveLoveLetterBtn = document.getElementById("saveLoveLetter");
const clearLoveLetterBtn = document.getElementById("clearLoveLetter");

if (loveLetterInput) {
  loveLetterInput.value = localStorage.getItem(loveLetterStorageKey) || "";
}

if (saveLoveLetterBtn) {
  saveLoveLetterBtn.addEventListener("click", () => {
    const text = (loveLetterInput?.value || "").trim();
    localStorage.setItem(loveLetterStorageKey, text);
  });
}

if (clearLoveLetterBtn) {
  clearLoveLetterBtn.addEventListener("click", () => {
    if (loveLetterInput) loveLetterInput.value = "";
    localStorage.removeItem(loveLetterStorageKey);
  });
}

// Funny couple scoreboard.
const scoreStorageKey = "loveStoryScoreboard";
const scoreDefaults = {
  fightCount: 0,
  patchCount: 0,
  sorryMeCount: 0,
  sorryHerCount: 0
};

function loadScores() {
  try {
    const parsed = JSON.parse(localStorage.getItem(scoreStorageKey) || "{}");
    return {
      fightCount: Number(parsed.fightCount) || 0,
      patchCount: Number(parsed.patchCount) || 0,
      sorryMeCount: Number(parsed.sorryMeCount) || 0,
      sorryHerCount: Number(parsed.sorryHerCount) || 0
    };
  } catch {
    return { ...scoreDefaults };
  }
}

function saveScores(scores) {
  localStorage.setItem(scoreStorageKey, JSON.stringify(scores));
}

function getWinnerLine(scores) {
  if (scores.patchCount >= scores.fightCount) return "Currently winning: Peace and love 💖";
  if (scores.sorryMeCount > scores.sorryHerCount) return "Currently winning: Chatori (Aloo Paratha saying sorry more 😅)";
  if (scores.sorryHerCount > scores.sorryMeCount) return "Currently winning: Aloo Paratha (Chatori saying sorry more 😄)";
  return "Currently winning: Tie, but still forever together ❤️";
}

let scoreboard = loadScores();

function renderScores() {
  Object.keys(scoreDefaults).forEach((key) => {
    const el = document.getElementById(key);
    if (el) el.textContent = scoreboard[key];
  });
  const winnerLine = document.getElementById("winnerLine");
  if (winnerLine) winnerLine.textContent = getWinnerLine(scoreboard);
}

document.querySelectorAll(".score-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.stat;
    if (!key || !(key in scoreboard)) return;
    scoreboard[key] += 1;
    saveScores(scoreboard);
    renderScores();
  });
});

const resetScoresBtn = document.getElementById("resetScores");
if (resetScoresBtn) {
  resetScoresBtn.addEventListener("click", () => {
    scoreboard = { ...scoreDefaults };
    saveScores(scoreboard);
    renderScores();
  });
}

renderScores();

// Couple remarks board.
const remarksStorageKey = "loveStoryRemarks";
const remarkAuthorSelect = document.getElementById("remarkAuthor");
const remarkTextInput = document.getElementById("remarkText");
const remarksList = document.getElementById("remarksList");
const addRemarkBtn = document.getElementById("addRemark");
const clearRemarksBtn = document.getElementById("clearRemarks");

function loadRemarks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(remarksStorageKey) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRemarks(items) {
  localStorage.setItem(remarksStorageKey, JSON.stringify(items));
}

function formatDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

let remarks = loadRemarks();

function renderRemarks() {
  if (!remarksList) return;
  if (!remarks.length) {
    remarksList.innerHTML = "<p class=\"section-intro\">No remarks yet. Add the first one.</p>";
    return;
  }

  remarksList.innerHTML = remarks
    .slice()
    .reverse()
    .map(
      (item) => `
      <article class="remark-item">
        <div class="remark-head">
          <span class="remark-name">${item.name}</span>
          <span>${formatDateTime(item.createdAt)}</span>
        </div>
        <p class="remark-text">${item.text}</p>
      </article>
    `
    )
    .join("");
}

if (addRemarkBtn) {
  addRemarkBtn.addEventListener("click", () => {
    const name = (remarkAuthorSelect?.value || "Aloo Paratha").trim();
    const text = (remarkTextInput?.value || "").trim();
    if (!text) return;

    remarks.push({ name, text, createdAt: new Date().toISOString() });
    saveRemarks(remarks);
    renderRemarks();
    if (remarkTextInput) remarkTextInput.value = "";
  });
}

if (clearRemarksBtn) {
  clearRemarksBtn.addEventListener("click", () => {
    remarks = [];
    saveRemarks(remarks);
    renderRemarks();
  });
}

renderRemarks();

// Secret puzzle checker.
const q1Metro = document.getElementById("q1Metro");
const q2Birth = document.getElementById("q2Birth");
const q3Items = document.getElementById("q3Items");
const q4Best = document.getElementById("q4Best");
const checkPuzzleBtn = document.getElementById("checkPuzzle");
const puzzleResult = document.getElementById("puzzleResult");
const puzzlePassword = document.getElementById("puzzlePassword");

function normalizeBirthInput(value) {
  return value.replace(/\s+/g, "").replace(/\//g, "-");
}

if (checkPuzzleBtn) {
  checkPuzzleBtn.addEventListener("click", () => {
    const a1 = (q1Metro?.value || "").trim().toLowerCase();
    const a2 = normalizeBirthInput((q2Birth?.value || "").trim());
    const a3 = (q3Items?.value || "").trim();
    const a4 = (q4Best?.value || "").trim().toLowerCase();

    const ok1 = a1 === "haus khas";
    const ok2 = a2 === "12-07" || a2 === "12-7";
    const ok3 = a3 === "7";
    const ok4 = a4 === "eyes" || a4 === "eye";

    if (puzzleResult) puzzleResult.classList.remove("hidden");

    if (ok1 && ok2 && ok3 && ok4) {
      if (puzzlePassword) puzzlePassword.textContent = password;
      if (puzzleResult) {
        puzzleResult.innerHTML = `<p>You unlocked it 💖</p><p>Secret Surprise Password: <strong id="puzzlePassword">${password}</strong></p>`;
      }
      return;
    }

    if (puzzleResult) {
      puzzleResult.innerHTML = "<p>Some answers are wrong. Try again, Chatori 😊</p>";
    }
  });
}

// Password surprise.
document.getElementById("unlockBtn").addEventListener("click", () => {
  const typed = document.getElementById("passwordInput").value.trim();
  if (typed === password) {
    window.location.href = "surprise-love.html";
  } else {
    alert("Wrong password, try first meet date format.");
  }
});

// Final heart burst.
const burst = document.getElementById("heartBurst");
for (let i = 0; i < 20; i += 1) {
  const h = document.createElement("span");
  h.className = "pop-heart";
  h.style.animationDelay = `${i * 0.08}s`;
  h.textContent = "❤";
  burst.appendChild(h);
}
