const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const letterContent = document.getElementById("letterContent");
const letterHelp = document.getElementById("letterHelp");

const renderLetter = (text) => {
  if (!letterContent) {
    return false;
  }

  const cleanText = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!cleanText.length) {
    return false;
  }

  letterContent.innerHTML = "";

  cleanText.forEach((paragraph) => {
    const paragraphNode = document.createElement("p");
    paragraphNode.textContent = paragraph;
    letterContent.appendChild(paragraphNode);
  });

  return true;
};

const showLetterFallback = () => {
  if (letterHelp) {
    letterHelp.hidden = false;
  }

  if (letterContent && !letterContent.textContent.trim()) {
    letterContent.innerHTML = "<p>the letter text file is ready, but this browser is being shy about loading it automatically.</p>";
  }
};

const loadLetter = async () => {
  try {
    const response = await fetch("confession-letter.txt", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Failed to load letter: ${response.status}`);
    }

    const text = await response.text();

    if (!renderLetter(text)) {
      showLetterFallback();
    }
  } catch {
    showLetterFallback();
  }
};

const celebrate = () => {
  if (reduceMotion || typeof window.confetti !== "function") {
    return;
  }

  const colors = ["#f7e6d3", "#d8aa73", "#b8835a", "#fff4ea"];

  window.confetti({
    particleCount: 90,
    spread: 74,
    startVelocity: 28,
    scalar: 0.94,
    ticks: 170,
    origin: { x: 0.5, y: 0.72 },
    colors
  });

  window.setTimeout(() => {
    window.confetti({
      particleCount: 36,
      spread: 56,
      startVelocity: 22,
      scalar: 0.82,
      ticks: 130,
      origin: { x: 0.52, y: 0.67 },
      colors
    });
  }, 180);
};

window.addEventListener("load", async () => {
  celebrate();
  await loadLetter();
});
