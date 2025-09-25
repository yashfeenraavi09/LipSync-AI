// Content script for LipSync AI Chrome Extension
console.log("[LipSync AI] Content script loaded")

// Declare chrome variable
const chrome = window.chrome

// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[LipSync AI] Received message:", request)

  switch (request.action) {
    case "scroll_up":
      window.scrollBy(0, -300)
      sendResponse({ success: true, action: "scroll_up" })
      break

    case "scroll_down":
      window.scrollBy(0, 300)
      sendResponse({ success: true, action: "scroll_down" })
      break

    case "click":
      // Click on the currently focused element or center of screen
      const focusedElement = document.activeElement
      if (focusedElement && focusedElement !== document.body) {
        focusedElement.click()
      } else {
        // Click center of viewport
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const element = document.elementFromPoint(centerX, centerY)
        if (element) element.click()
      }
      sendResponse({ success: true, action: "click" })
      break

    case "back":
      window.history.back()
      sendResponse({ success: true, action: "back" })
      break

    case "forward":
      window.history.forward()
      sendResponse({ success: true, action: "forward" })
      break

    case "search":
      // Focus on search input if available
      const searchInputs = document.querySelectorAll(
        'input[type="search"], input[name*="search"], input[placeholder*="search"]',
      )
      if (searchInputs.length > 0) {
        searchInputs[0].focus()
      }
      sendResponse({ success: true, action: "search" })
      break

    default:
      sendResponse({ success: false, error: "Unknown action" })
  }
})

// Inject floating status indicator
function createFloatingIndicator() {
  const indicator = document.createElement("div")
  indicator.id = "lipsync-indicator"
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: none;
    backdrop-filter: blur(10px);
  `
  indicator.textContent = "LipSync AI Active"
  document.body.appendChild(indicator)
  return indicator
}

// Show/hide indicator based on extension state
chrome.storage.local.get(["lipsyncActive"], (result) => {
  if (result.lipsyncActive) {
    const indicator = createFloatingIndicator()
    indicator.style.display = "block"
  }
})

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.lipsyncActive) {
    const indicator = document.getElementById("lipsync-indicator") || createFloatingIndicator()
    indicator.style.display = changes.lipsyncActive.newValue ? "block" : "none"
  }
})
