(function () {
  if (window.__antiProductivitySuiteInjected) {
    return;
  }
  window.__antiProductivitySuiteInjected = true;

  const body = document.body;
  if (!body) {
    return;
  }

  misspellMostUsedWord();
  injectAiScoreIndicator();
  rotatePageSlightly();
  maybeApplyRandomFont();
  setupLinkConfirmation();
  setupClickCounter();

  function injectAiScoreIndicator() {
    const container = document.createElement("div");
    container.id = "anti-productivity-ai-score";
    container.textContent = `AI Score: ${generateScore()}% (Parody / Random)`;
    Object.assign(container.style, {
      position: "fixed",
      top: "16px",
      right: "16px",
      padding: "12px 16px",
      background: "rgba(0, 0, 0, 0.8)",
      color: "#ffeb3b",
      fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
      fontSize: "16px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.35)",
      zIndex: "2147483646",
      textAlign: "center",
    });
    body.appendChild(container);
  }

  function rotatePageSlightly() {
    const min = 2;
    const max = 10;
    const degrees = Math.floor(Math.random() * (max - min + 1)) + min;
    body.style.transition = body.style.transition
      ? `${body.style.transition}, transform 0.6s ease-out`
      : "transform 0.6s ease-out";
    body.style.transformOrigin = body.style.transformOrigin || "50% 50%";
    body.style.transform = `rotate(${degrees}deg)`;
  }

  function maybeApplyRandomFont() {
    if (Math.random() >= 0.5) {
      return;
    }

    const uglyFonts = [
      "'Comic Sans MS', 'Comic Sans', cursive",
      "'Papyrus', fantasy",
      "'Impact', sans-serif",
      "'Brush Script MT', cursive",
      "'Courier New', monospace",
    ];

    const selection = uglyFonts[Math.floor(Math.random() * uglyFonts.length)];
    document.documentElement.style.fontFamily = selection;
  }

  function misspellMostUsedWord() {
    try {
      const text = body.innerText;
      if (!text) {
        return;
      }

      const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g);
      if (!words || words.length === 0) {
        return;
      }

      let topWord = "";
      let highestCount = 0;
      const counts = new Map();

      for (const word of words) {
        const nextCount = (counts.get(word) || 0) + 1;
        counts.set(word, nextCount);
        if (nextCount > highestCount) {
          topWord = word;
          highestCount = nextCount;
        }
      }

      if (!topWord) {
        return;
      }

      const misspelling = generateMisspelling(topWord);
      if (!misspelling || misspelling === topWord) {
        return;
      }

      const pattern = new RegExp(`\\b${escapeRegExp(topWord)}\\b`, "gi");
      body.innerHTML = body.innerHTML.replace(pattern, (match) => adaptCase(misspelling, match));
    } catch (error) {
      // If we break something, we prefer silence?this suite loves chaos anyway.
    }
  }

  function setupLinkConfirmation() {
    let modalActive = false;

    document.addEventListener(
      "click",
      (event) => {
        if (modalActive) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        if (event.defaultPrevented || event.button !== 0) {
          return;
        }

        const anchor = event.target.closest("a[href]");
        if (!anchor) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        modalActive = true;
        const destination = anchor.href;
        const target = anchor.target;
        const modal = buildModal(destination, () => {
          modal.remove();
          modalActive = false;
        });

        modal.querySelector("button[data-action='yes']")?.addEventListener("click", () => {
          modal.remove();
          modalActive = false;
          if (target && target !== "_self") {
            window.open(destination, target);
          } else {
            window.location.href = destination;
          }
        });

        modal.querySelector("button[data-action='no']")?.addEventListener("click", () => {
          modal.remove();
          modalActive = false;
        });

        body.appendChild(modal);
      },
      true
    );
  }

  function setupClickCounter() {
    let clickCount = 0;
    document.addEventListener("mousedown", () => {
      clickCount += 1;
      try {
        chrome.runtime.sendMessage({ type: "CLICK_COUNT", count: clickCount });
      } catch (error) {
        // Ignore messaging issues.
      }
    });
  }

  function buildModal(destination, onClose) {
    const overlay = document.createElement("div");
    overlay.id = "anti-productivity-link-modal";
    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0, 0, 0, 0.65)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "2147483647",
    });

    const modal = document.createElement("div");
    Object.assign(modal.style, {
      width: "min(90vw, 340px)",
      background: "#ffffff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
    });

    const heading = document.createElement("h2");
    heading.textContent = "Whoa there!";
    heading.style.margin = "0 0 16px";
    heading.style.fontSize = "20px";

    const message = document.createElement("p");
    message.style.margin = "0 0 20px";
    message.style.fontSize = "14px";
    message.textContent = `Are you sure you want to visit: ${destination}?`;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "12px";
    actions.style.justifyContent = "center";

    const yesButton = document.createElement("button");
    yesButton.dataset.action = "yes";
    yesButton.textContent = "Yes, obviously";
    styleModalButton(yesButton, "#4caf50");

    const noButton = document.createElement("button");
    noButton.dataset.action = "no";
    noButton.textContent = "No, keep me safe";
    styleModalButton(noButton, "#f44336");

    actions.appendChild(yesButton);
    actions.appendChild(noButton);

    modal.appendChild(heading);
    modal.appendChild(message);
    modal.appendChild(actions);

    overlay.appendChild(modal);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.remove();
        onClose();
      }
    });

    return overlay;
  }

  function styleModalButton(button, backgroundColor) {
    Object.assign(button.style, {
      flex: "1",
      border: "none",
      borderRadius: "6px",
      padding: "10px 12px",
      background: backgroundColor,
      color: "#ffffff",
      cursor: "pointer",
      fontSize: "14px",
      transition: "transform 0.15s ease, opacity 0.15s ease",
    });

    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.03)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
    });
  }

  function generateScore() {
    return (Math.random() * 100).toFixed(1);
  }

  function generateMisspelling(word) {
    if (word.length < 2) {
      return `${word}z`;
    }

    const chars = word.split("");
    const index = Math.max(1, Math.floor(chars.length / 2));
    const swapIndex = Math.min(chars.length - 1, index + 1);
    [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
    return `${chars.join("")}z`;
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function adaptCase(sourceWord, templateWord) {
    if (templateWord === templateWord.toUpperCase()) {
      return sourceWord.toUpperCase();
    }

    if (templateWord[0] === templateWord[0].toUpperCase()) {
      return sourceWord.charAt(0).toUpperCase() + sourceWord.slice(1);
    }

    return sourceWord;
  }
})();
