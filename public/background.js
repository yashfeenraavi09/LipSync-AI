// Background script for LipSync AI Chrome Extension
console.log("[LipSync AI] Background script loaded")

// Declare chrome variable
const chrome = window.chrome

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("[LipSync AI] Extension installed")

  // Set default settings
  chrome.storage.local.set({
    lipsyncActive: false,
    confidenceThreshold: 80,
    autoExecute: true,
  })
})

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("[LipSync AI] Background received message:", request)

  switch (request.action) {
    case "toggle_lipsync":
      chrome.storage.local.set({ lipsyncActive: request.active })
      sendResponse({ success: true })
      break

    case "execute_command":
      // Forward command to active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              action: request.command,
            },
            (response) => {
              sendResponse(response)
            },
          )
        }
      })
      return true // Keep message channel open for async response

    case "get_settings":
      chrome.storage.local.get(null, (settings) => {
        sendResponse(settings)
      })
      return true

    case "update_settings":
      chrome.storage.local.set(request.settings, () => {
        sendResponse({ success: true })
      })
      return true

    default:
      sendResponse({ success: false, error: "Unknown action" })
  }
})

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("[LipSync AI] Tab updated:", tab.url)
  }
})
