const statusEl = document.getElementById('display-status')
const installButton = document.getElementById('install-button')
const countEl = document.getElementById('count')
const incrementButton = document.getElementById('increment')
const decrementButton = document.getElementById('decrement')

const STORAGE_KEY = 'pwa-demo:count'

function loadCount() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const value = Number(raw)
  return Number.isFinite(value) ? value : 0
}

function saveCount(value) {
  localStorage.setItem(STORAGE_KEY, String(value))
}

let count = loadCount()

function renderCount() {
  countEl.textContent = count
}

incrementButton.addEventListener('click', () => {
  count += 1
  saveCount(count)
  renderCount()
})

decrementButton.addEventListener('click', () => {
  count -= 1
  saveCount(count)
  renderCount()
})

renderCount()

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function updateStatus() {
  if (isStandalone()) {
    statusEl.textContent = 'インストール済みのアプリとして起動中です ✅'
    statusEl.className = 'status status--ok'
  } else {
    statusEl.textContent = 'ブラウザで表示中です。\nホーム画面に追加するとアプリとして起動できます。'
    statusEl.className = 'status status--pending'
  }
}

updateStatus()
window.matchMedia('(display-mode: standalone)').addEventListener('change', updateStatus)

let deferredPrompt = null

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event
  installButton.hidden = false
})

installButton.addEventListener('click', async () => {
  if (!deferredPrompt) return
  installButton.disabled = true
  deferredPrompt.prompt()
  await deferredPrompt.userChoice
  deferredPrompt = null
  installButton.hidden = true
})

window.addEventListener('appinstalled', () => {
  installButton.hidden = true
  updateStatus()
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.error('Service worker registration failed:', err)
    })
  })
}
