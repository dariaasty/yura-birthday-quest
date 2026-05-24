const questions = [
  {
    text: "Кто твоя самая красивая, самая лучшая и единственная на свете подружка, которая всю жизнь будет с тобой?",
    answers: [
      "Даша",
      "Дашенька",
      "Даша, моя любимая подружка",
      "Даша, моя самая красивая подружка"
    ],
    points: 140,
    stamp: "Правильно",
    result: "Ну конечно! 💜",
    resultImage: "./assets/encourage-red.jpg",
    resultFit: "crop-encourage-1"
  },
  {
    text: "А кто моя лучшая подружка?",
    answers: [
      "Настя",
      "Юрочка",
      "Бобёрчик",
      "Юрий Александрович"
    ],
    points: 140,
    stamp: "Фактишь",
    result: "Фактишь 😌",
    resultImage: "./assets/encourage-food.jpg",
    resultFit: "crop-encourage-2"
  },
  {
    text: "Как мы называем, когда у нас совпадают мысли?",
    image: "./assets/one-brain-new.jpg",
    imageFit: "fit-contain",
    answers: [
      "Одна мозга",
      "Миндальная связь",
      "Это прямо сейчас в моей голове"
    ],
    answerResults: {
      "Одна мозга": "Одна мозга вышла на связь 😏",
      "Миндальная связь": "Миндальная связь подтверждена 💜",
      "Это прямо сейчас в моей голове": "Это прямо сейчас было в моей голове 😌"
    },
    points: 140,
    stamp: "Синхрон",
    result: "Синхронизация прошла успешно 😏"
  },
  {
    text: "Какая наша самая главная песня?",
    answers: [
      "Я в моменте",
      "Блонды гламур",
      "Наследство",
      "Бар две лесбухи"
    ],
    points: 140,
    stamp: "Хит",
    result: "Музыкальная совместимость подтверждена 🔥"
  },
  {
    text: "В какой город мы летим?",
    image: "./assets/flight-sleep.jpg",
    imageFit: "crop-flight",
    answers: [
      "Измир",
      "Стамбул",
      "На Пхукет",
      "В Питер"
    ],
    correct: "Измир",
    wrongResult: "Вообще-то мы летим в Измир. Есть самое вкусное мясо на рынке, бухать на балконе, кататься на трамвае с турками 😌",
    points: 140,
    stamp: "Летим",
    result: "Есть самое вкусное мясо на рынке, бухать на балконе, кататься на трамвае с турками 😌"
  },
  {
    text: "Какая МОЯ любимая еда в Тае?",
    image: "./assets/thai-food.jpg",
    imageFit: "crop-food",
    answers: [
      "Чоризо в Unnis",
      "Буфет",
      "Креветки с пивом",
      "Маргарита 😇"
    ],
    correct: "Маргарита 😇",
    retryOnly: true,
    retryMessages: [
      "Подумай еще 😌",
      "Подумай еще",
      "Реально? Ты серьезно?",
      "Ты гонишь?"
    ],
    points: 140,
    stamp: "Вот она",
    result: "ЭТО МОЯ ПОДРУЖКА 🔥",
    resultImage: "./assets/encourage-beach.jpg",
    resultFit: "fit-soft"
  },
  {
    text: "Какой это год?",
    video: "./assets/year-video.mov",
    answers: [
      "2019",
      "2021",
      "2020",
      "2018"
    ],
    correct: "2019",
    points: 160,
    stamp: "Память",
    result: "Да, Юрий Александрович, память работает 💜"
  }
];

const screens = document.querySelectorAll(".screen");
const startBtn = document.querySelector("#startBtn");
const nextBtn = document.querySelector("#nextBtn");
const quizBackBtn = document.querySelector("#quizBackBtn");
const resultBackBtn = document.querySelector("#resultBackBtn");
const officialBtn = document.querySelector("#officialBtn");
const bonusBtn = document.querySelector("#bonusBtn");
const bonusUnlockBtn = document.querySelector("#bonusUnlockBtn");
const scoreText = document.querySelector("#scoreText");
const scoreMeter = document.querySelector("#scoreMeter");
const stepText = document.querySelector("#stepText");
const questionText = document.querySelector("#questionText");
const answersEl = document.querySelector("#answers");
const answerFeedback = document.querySelector("#answerFeedback");
const mediaSlot = document.querySelector("#mediaSlot");
const resultMedia = document.querySelector("#resultMedia");
const resultStamp = document.querySelector("#resultStamp");
const resultCopy = document.querySelector("#resultCopy");
const resultScore = document.querySelector("#resultScore");

let current = 0;
let score = 0;
let completedPoints = [];

function stopVideos() {
  document.querySelectorAll("video").forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
}

function showScreen(name) {
  stopVideos();
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function updateScore() {
  score = completedPoints.reduce((sum, points) => sum + points, 0);
  const capped = Math.min(score, 1000);
  scoreText.textContent = `${capped} / 1000`;
  resultScore.textContent = `${capped} / 1000`;
  scoreMeter.style.width = `${capped / 10}%`;
}

function mediaMarkup(question) {
  if (question.image) {
    return `<img class="${question.imageFit || ""}" src="${question.image}" alt="">`;
  }

  if (question.video) {
    return `<video src="${question.video}" controls playsinline preload="metadata"></video>`;
  }

  return "";
}

function renderQuestion() {
  const question = questions[current];
  updateScore();
  quizBackBtn.hidden = current === 0;
  stepText.textContent = `Вопрос ${current + 1} из ${questions.length}`;
  questionText.textContent = question.text;
  mediaSlot.innerHTML = mediaMarkup(question);
  answersEl.innerHTML = "";
  answerFeedback.textContent = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => answerQuestion(answer, button));
    answersEl.append(button);
  });
}

function answerQuestion(answer, button) {
  const question = questions[current];
  const isWrongRetry = question.retryOnly && answer !== question.correct;

  if (isWrongRetry) {
    const wrongCount = answersEl.querySelectorAll(".wrong").length;
    button.classList.add("wrong");
    answerFeedback.textContent = question.retryMessages[Math.min(wrongCount, question.retryMessages.length - 1)];
    return;
  }

  score = Math.min(1000, score + question.points);
  completedPoints[current] = question.points;
  updateScore();

  const isWrongYear = question.correct && !question.retryOnly && answer !== question.correct;
  resultStamp.textContent = isWrongYear ? "Почти" : question.stamp;
  resultCopy.textContent = isWrongYear
    ? question.wrongResult || `Почти. Но я добрая, поэтому засчитываю. Это был ${question.correct}.`
    : question.answerResults?.[answer] || question.result;

  resultMedia.innerHTML = question.resultImage
    ? `<img class="${question.resultFit || ""}" src="${question.resultImage}" alt="">`
    : "";
  showScreen("result");
}

function next() {
  current += 1;
  if (current >= questions.length) {
    updateScore();
    showScreen("official");
    return;
  }
  renderQuestion();
  showScreen("quiz");
}

startBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  completedPoints = questions.map(() => 0);
  renderQuestion();
  showScreen("quiz");
});

nextBtn.addEventListener("click", next);
quizBackBtn.addEventListener("click", () => {
  if (current === 0) return;
  current -= 1;
  completedPoints[current] = 0;
  renderQuestion();
  showScreen("quiz");
});
resultBackBtn.addEventListener("click", () => {
  completedPoints[current] = 0;
  renderQuestion();
  showScreen("quiz");
});
officialBtn.addEventListener("click", () => {
  const currentScore = completedPoints.reduce((sum, points) => sum + points, 0);
  completedPoints = [1000, ...questions.slice(1).map(() => 0)];
  score = Math.max(1000, currentScore);
  updateScore();
  showScreen("final");
});
bonusBtn.addEventListener("click", () => showScreen("bonus"));
bonusUnlockBtn.addEventListener("click", () => showScreen("archive"));

document.querySelectorAll("[data-archive]").forEach((button) => {
  button.addEventListener("click", () => showScreen("never"));
});
