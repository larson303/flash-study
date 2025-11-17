const card = document.getElementById("flashcard");
const term = card.querySelector(".term");
const definition = card.querySelector(".definition");
const checkButton = document.querySelector(".check");
const nextButton = document.querySelector(".next");
const restartButton = document.querySelector(".restart");
const counterDisplay = document.getElementById("counter");
const themeToggle = document.getElementById("theme-toggle");

const categoryButtons = document.querySelectorAll(".category-btn");
const categoryScreen = document.getElementById("category-screen");
const studyScreen = document.getElementById("study-screen");

// NEW: track which set is currently active
let currentSetName = null;

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
  { term: "ת", definition: "Taw: t sound" },
];

const GeometryPostulates = [
  {
    term: "Postulate 1",
    definition: "A straight line segment can be drawn joining any two points.",
  },
  {
    term: "Postulate 2",
    definition:
      "Any straight line segment can be extended indefinitely in a straight line.",
  },
  {
    term: "Postulate 3",
    definition:
      "Given any straight line segment, a circle can be drawn having the segment as radius and one endpoint as center.",
  },
  { term: "Postulate 4", definition: "All right angles are congruent." },
  {
    term: "Postulate 5",
    definition:
      "If a line segment intersec...t side on which the angles sum to less than two right angles.",
  },
];

const HeisigKanji = [
  { term: "日", definition: "Sun/Day" },
  { term: "月", definition: "Moon/Month" },
  { term: "火", definition: "Fire" },
  { term: "水", definition: "Water" },
  { term: "木", definition: "Tree/Wood" },
  { term: "金", definition: "Gold/Money" },
  { term: "土", definition: "Earth/Soil" },
  { term: "山", definition: "Mountain" },
];

let data = [];
let queue = [];
let current = null;
let reverseMode = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadSet(setName) {
  currentSetName = setName;
  reverseMode = false; // default

  switch (setName) {
    case "hebrew-alphabet":
      data = HebrewAlphabet;
      break;
    case "geometry-postulates":
      data = GeometryPostulates;
      reverseMode = true; // show term first
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

  // Front/back text mapping
  if (reverseMode) {
    // Geometry: prompt is "Postulate 1", answer is the long statement
    definition.innerHTML = `<h3>${current.term}</h3>`;
    term.innerHTML = `<h3>${current.definition}</h3>`;
  } else {
    // Hebrew / Kanji: prompt = definition, answer = glyph
    definition.innerHTML = `<h3>${current.definition}</h3>`;
    term.innerHTML = `<h3>${current.term}</h3>`;
  }

  // === Dynamic font sizing for the ANSWER side ===
  const termH3 = term.querySelector("h3");

  // Reset any previous inline styling so we don't accumulate weirdness
  termH3.style.fontSize = "";

  if (currentSetName === "geometry-postulates") {
    // Geometry → make long answers smaller based on length
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
    // Hebrew / Kanji → keep answers nice and large
    termH3.style.fontSize = "3rem";
  }

  counterDisplay.textContent = `${currentIndex + 1} : ${total}`;
}

checkButton.addEventListener("click", () => {
  card.classList.add("flipped");
});

nextButton.addEventListener("click", () => {
  showNextCard();
});

// Restart the **current** subject
restartButton.addEventListener("click", () => {
  if (currentSetName) {
    loadSet(currentSetName);
  }
});

// Theme toggle still works
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light")
    ? "☀️"
    : "🌙";
});

// Category selection screen
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedSet = button.dataset.set;
    categoryScreen.style.display = "none";
    studyScreen.style.display = "flex"; // use flex here
    loadSet(selectedSet);
  });
});

// NOTE: we no longer call loadSet() on startup.
// The app starts on the category screen.

const backButton = document.getElementById("back-to-categories");
const addSubjectButton = document.getElementById("add-subject");

backButton.addEventListener("click", () => {
  // Go back to subject selection
  studyScreen.style.display = "none";
  categoryScreen.style.display = "block";
  // Optional: clear card content
  definition.innerHTML = "<h3>Definition</h3>";
  term.innerHTML = "<h3>Term</h3>";
  counterDisplay.textContent = "0 : 0";
});

// For now, just a placeholder
addSubjectButton.addEventListener("click", () => {
  alert("Add New Subject: feature coming soon!");
});
