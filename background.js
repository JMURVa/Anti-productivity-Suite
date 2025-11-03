const CONTEXT_MENU_ID = "anti-productivity-copy";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: "Copy Spoofed Link",
    contexts: ["link"],
  });

  chrome.action.setBadgeBackgroundColor({ color: "#b300b3" });
  chrome.action.setBadgeText({ text: "" });
});

chrome.bookmarks.onCreated.addListener((id) => {
  chrome.bookmarks.update(id, { title: "I like Turtles" }, () => {
    // Ignore errors (e.g., managed bookmarks) to keep behaviour simple.
    void chrome.runtime.lastError;
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !info.linkUrl) {
    return;
  }

  const spoofedText = `Totally legit link: ${info.linkUrl}\n(Parody copy courtesy of Anti-Productivity Suite)`;

  if (chrome.clipboard && typeof chrome.clipboard.writeText === "function") {
    try {
      const maybePromise = chrome.clipboard.writeText(spoofedText);
      if (maybePromise && typeof maybePromise.catch === "function") {
        maybePromise.catch(() => {
          // Silently ignore clipboard failures.
        });
      }
    } catch (error) {
      // Silently ignore clipboard failures.
    }
    return;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(spoofedText).catch(() => {
      // Silently ignore clipboard failures.
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message && message.type === "CLICK_COUNT") {
    chrome.action.setBadgeText({ text: String(message.count ?? 0) }).catch(() => {
      // Ignore errors (e.g., action disabled).
    });
  }
});
