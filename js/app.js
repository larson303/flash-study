// Core DOM references
const card = document.getElementById("flashcard");
const term = card.querySelector(".term");
const definition = card.querySelector(".definition");

const checkButton = document.querySelector(".check");
const nextButton = document.querySelector(".next");
const restartButton = document.querySelector(".restart");
const counterDisplay = document.getElementById("counter");
const themeToggle = document.getElementById("theme-toggle");

// Screens & navigation
const landingScreen = document.getElementById("landing-screen");
const languageScreen = document.getElementById("language-screen");
const mathScreen = document.getElementById("math-screen");
const studyScreen = document.getElementById("study-screen");

const screens = document.querySelectorAll(".screen");
const menuScreens = document.querySelectorAll(".menu-screen");
const navLinks = document.querySelectorAll(".nav-link");
const categoryButtons = document.querySelectorAll(".category-btn");

const backButton = document.getElementById("back-to-categories");
const addSubjectButton = document.getElementById("add-subject");

// State
let currentSetName = null;
let lastMenuScreen = landingScreen;

const HebrewAlphabet = [
  { term: "א", definition: "Alef: silent pronunciation" },
  { term: "ב", definition: "Bet: b sound" },
  { term: "ג", definition: "Gimel: g sound" },
  { term: "ד", definition: "Dalet: d sound" },
  { term: "ה", definition: "He: soft h sound" },
  { term: "ו", definition: "Waw: w sound" },
  { term: "ז", definition: "Zayin: z sound" },
  { term: "ח", definition: "Het: rough h sound" },
  { term: "ט", definition: "Tet: t sound" },
  { term: "י", definition: "Yod: y sound" },
  { term: "כ", definition: "Kaf: k sound" },
  { term: "ל", definition: "Lamed: l sound" },
  { term: "מ", definition: "Mem: m sound" },
  { term: "נ", definition: "Nun: n sound" },
  { term: "ס", definition: "Samek: s sound" },
  { term: "ע", definition: "Ayin: silent pronunciation" },
  { term: "פ", definition: "Pe: p sound" },
  { term: "צ", definition: "Tsade: ts sound" },
  { term: "ק", definition: "Qof: k sound" },
  { term: "ר", definition: "Resh: r sound" },
  { term: "שׂ", definition: "Sin: s sound" },
  { term: "שׁ", definition: "Shin: sh sound" },
  { term: "ת", definition: "Taw: t sound" }
];

const GeometryPostulates = [
  {
    term: "Postulate 1",
    definition: "A straight line segment can be drawn joining any two points."
  },
  {
    term: "Postulate 2",
    definition: "Any straight line segment can be extended indefinitely in a straight line."
  },
  {
    term: "Postulate 3",
    definition:
      "Given any straight line segment, a circle can be drawn having the segment as radius and one endpoint as center."
  },
  {
    term: "Postulate 4",
    definition: "All right angles are congruent."
  },
  {
    term: "Postulate 5",
    definition:
      "If a line segment intersects two straight lines forming two interior angles on the same side that sum to less than two right angles, then the two lines, if extended indefinitely, meet on that side on which the angles sum to less than two right angles."
  }
];

const HeisigKanji = [
  { term: "日", definition: "Sun / Day" },
  { term: "月", definition: "Moon / Month" },
  { term: "火", definition: "Fire" },
  { term: "水", definition: "Water" },
  { term: "木", definition: "Tree / Wood" },
  { term: "金", definition: "Gold / Money" },
  { term: "土", definition: "Earth / Soil" },
  { term: "山", definition: "Mountain" }
];

let data = [];
let queue = [];
let current = null;
let reverseMode = false;

// ---------- Helpers ----------

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function hideAllScreens() {
  screens.forEach((screen) => {
    screen.style.display = "none";
    screen.classList.remove("active");
  });
}

function showScreen(target) {
  let el = typeof target === "string" ? document.getElementById(target) : target;
  if (!el) return;

  if (el.id === "study-screen") {
    el.style.display = "flex";
  } else {
    el.style.display = "block";
  }
  el.classList.add("active");
}

// ---------- Flashcard logic ----------

function loadSet(setName) {
  currentSetName = setName;
  reverseMode = false;

  switch (setName) {
    case "hebrew-alphabet":
      data = HebrewAlphabet;
      break;
    case "geometry-postulates":
      data = GeometryPostulates;
      reverseMode = true; // show label first, statement as answer
      break;
    case "heisig-kanji":
      data = HeisigKanji;
      break;
    default:
      data = [];
  }

  queue = shuffle([...data]);
  restartButton.style.display = "none";
  card.classList.remove("flipped");
  showNextCard();
}

function showNextCard() {
  card.classList.remove("flipped");

  const total = data.length;
  const currentIndex = total - queue.length;

  if (queue.length === 0 || total === 0) {
    definition.innerHTML = "<h3>🎉 All terms reviewed!</h3>";
    term.innerHTML = "";
    counterDisplay.textContent = `${total} : ${total}`;
    restartButton.style.display = total > 0 ? "inline-block" : "none";
    return;
  }

  current = queue.pop();

  // Front/back content
  if (reverseMode) {
    // Geometry: prompt = Postulate label, answer = full statement
    definition.innerHTML = `<h3>${current.term}</h3>`;
    term.innerHTML = `<h3>${current.definition}</h3>`;
  } else {
    // Hebrew / Kanji: prompt = meaning, answer = glyph
    definition.innerHTML = `<h3>${current.definition}</h3>`;
    term.innerHTML = `<h3>${current.term}</h3>`;
  }

  // Dynamic font sizing for ANSWER side
  const termH3 = term.querySelector("h3");
  termH3.style.fontSize = ""; // reset

  if (currentSetName === "geometry-postulates") {
    const len = termH3.textContent.length;
    if (len > 260) {
      termH3.style.fontSize = "0.85rem";
    } else if (len > 200) {
      termH3.style.fontSize = "0.95rem";
    } else if (len > 150) {
      termH3.style.fontSize = "1.05rem";
    } else {
      termH3.style.fontSize = "1.2rem";
    }
  } else {
    // Hebrew / Kanji answers should stay large
    termH3.style.fontSize = "3rem";
  }

  counterDisplay.textContent = `${currentIndex + 1} : ${total}`;
}

// ---------- Event wiring ----------

// Card controls
checkButton.addEventListener("click", () => {
  card.classList.add("flipped");
});

nextButton.addEventListener("click", () => {
  showNextCard();
});

// Restart current deck
restartButton.addEventListener("click", () => {
  if (currentSetName) {
    loadSet(currentSetName);
  }
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

// Top nav links (Home / Language / Math)
navLinks.forEach((link) => {
  const targetId = link.dataset.target;
  if (!targetId) return;

  link.addEventListener("click", () => {
    hideAllScreens();
    const targetScreen = document.getElementById(targetId);
    if (menuScreens && [...menuScreens].includes(targetScreen)) {
      lastMenuScreen = targetScreen;
    }
    showScreen(targetScreen);

    // Leaving study mode via nav: soft reset
    if (targetId !== "study-screen") {
      definition.innerHTML = "<h3>Definition</h3>";
      term.innerHTML = "<h3>Term</h3>";
      counterDisplay.textContent = "0 : 0";
    }
  });
});

// Topic cards -> start studying that set
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedSet = button.dataset.set;
    const parentMenu = button.closest(".menu-screen");

    if (parentMenu) {
      lastMenuScreen = parentMenu;
    }

    hideAllScreens();
    showScreen("study-screen");
    loadSet(selectedSet);
  });
});

// Back to subjects
backButton.addEventListener("click", () => {
  hideAllScreens();
  showScreen(lastMenuScreen || landingScreen);

  // Reset card display
  definition.innerHTML = "<h3>Definition</h3>";
  term.innerHTML = "<h3>Term</h3>";
  counterDisplay.textContent = "0 : 0";
});

// Placeholder for future subject-creation feature
addSubjectButton.addEventListener("click", () => {
  alert("Add New Subject: feature coming soon!");
});

// Initial state: show landing screen
hideAllScreens();
showScreen(landingScreen);
