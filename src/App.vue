<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recovery-catalog`
const API_HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
}

const loading = ref(true)
const loadError = ref('')
const records = ref([])

const selectedChannel = ref('')
const selectedManufacturer = ref('')
const selectedModel = ref('')

const EXTENSION_URL =
  'https://chromewebstore.google.com/detail/chromebook-recovery-utili/pocpnlppkickgojjlmhdmidojbmbodfm'
const EXTENSION_WINDOW_URL =
  'chrome-extension://pocpnlppkickgojjlmhdmidojbmbodfm/window.html'

const CHANNEL_ORDER = ['LTC', 'LTR', 'Beta', 'Stable']

function formatBytesToGB(bytes) {
  if (!bytes || bytes <= 0) return '—'
  const gb = bytes / 1_000_000_000
  return `${gb.toFixed(2)} GB`
}

async function loadData() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await fetch(API_URL, { headers: API_HEADERS })
    if (!res.ok) {
      let msg = `Request failed (${res.status})`
      try {
        const body = await res.json()
        if (body?.error) msg = body.error
      } catch {
        /* ignore */
      }
      throw new Error(msg)
    }
    const body = await res.json()
    if (!body?.records || !Array.isArray(body.records) || body.records.length === 0) {
      throw new Error('No recovery image records were returned.')
    }
    records.value = body.records
  } catch (err) {
    console.error(err)
    loadError.value =
      (err?.message ?? 'Unable to load recovery image data.') +
      ' Please check your network connection and try again.'
    records.value = []
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const channels = computed(() => {
  const set = new Set(records.value.map((r) => r.channel).filter(Boolean))
  const list = [...set]
  list.sort((a, b) => {
    const ai = CHANNEL_ORDER.indexOf(a)
    const bi = CHANNEL_ORDER.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })
  return list
})

const manufacturers = computed(() => {
  const set = new Set(
    records.value
      .filter((r) => r.channel === selectedChannel.value)
      .map((r) => r.manufacturer)
      .filter(Boolean),
  )
  return [...set].sort((a, b) => a.localeCompare(b))
})

const models = computed(() => {
  const set = new Set(
    records.value
      .filter(
        (r) =>
          r.channel === selectedChannel.value &&
          r.manufacturer === selectedManufacturer.value,
      )
      .map((r) => r.model)
      .filter(Boolean),
  )
  return [...set].sort((a, b) => a.localeCompare(b))
})

watch(channels, (list) => {
  if (list.length && !list.includes(selectedChannel.value)) {
    selectedChannel.value = ''
  }
})
watch(manufacturers, (list) => {
  if (list.length && !list.includes(selectedManufacturer.value)) {
    selectedManufacturer.value = ''
  }
})
watch(models, (list) => {
  if (list.length && !list.includes(selectedModel.value)) {
    selectedModel.value = ''
  }
})

const selectedRecord = computed(() => {
  if (!selectedChannel.value || !selectedManufacturer.value || !selectedModel.value)
    return null
  return (
    records.value.find(
      (r) =>
        r.channel === selectedChannel.value &&
        r.manufacturer === selectedManufacturer.value &&
        r.model === selectedModel.value,
    ) || null
  )
})

const allSelected = computed(
  () =>
    !!selectedChannel.value &&
    !!selectedManufacturer.value &&
    !!selectedModel.value &&
    !!selectedRecord.value,
)
</script>

<template>
  <header class="app-header">
    <h1>ChromeOS Recovery Image Downloader</h1>
    <p class="subtitle">
      Browse and download official ChromeOS recovery images and CloudReady
      builds.
    </p>
  </header>

  <section class="status" v-if="loading">
    <div class="spinner" aria-hidden="true"></div>
    <p>Loading recovery image catalog…</p>
  </section>

  <section class="status error" v-else-if="loadError">
    <p>{{ loadError }}</p>
    <button class="retry-btn" @click="loadData">Retry</button>
  </section>

  <template v-else>
    <section class="selectors">
      <div class="selector">
        <label for="sel-channel">Channel</label>
        <div class="select-wrap">
          <select
            id="sel-channel"
            v-model="selectedChannel"
            :disabled="channels.length === 0"
          >
            <option value="" disabled>Select a channel…</option>
            <option v-for="c in channels" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="selector">
        <label for="sel-manufacturer">Manufacturer</label>
        <div class="select-wrap">
          <select
            id="sel-manufacturer"
            v-model="selectedManufacturer"
            :disabled="!selectedChannel || manufacturers.length === 0"
          >
            <option value="" disabled>Select a manufacturer…</option>
            <option v-for="m in manufacturers" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
      </div>

      <div class="selector">
        <label for="sel-model">Model Name</label>
        <div class="select-wrap">
          <select
            id="sel-model"
            v-model="selectedModel"
            :disabled="!selectedManufacturer || models.length === 0"
          >
            <option value="" disabled>Select a model…</option>
            <option v-for="m in models" :key="m" :value="m">{{ m }}</option>
          </select>
        </div>
      </div>
    </section>

    <p class="hint" v-if="!allSelected">
      Choose a channel, manufacturer, and model to reveal the recovery image
      details.
    </p>

    <Transition name="reveal">
      <section v-if="allSelected" class="details">
        <div class="info-grid">
          <div class="info-box">
            <span class="info-label">Channel</span>
            <span class="info-value">{{ selectedRecord.channel }}</span>
          </div>
          <div class="info-box">
            <span class="info-label">Manufacturer &amp; Model</span>
            <span class="info-value"
              >{{ selectedRecord.manufacturer }} |
              {{ selectedRecord.model }}</span
            >
          </div>
          <div class="info-box">
            <span class="info-label">Version</span>
            <span class="info-value">{{ selectedRecord.version }}</span>
          </div>
          <div class="info-box">
            <span class="info-label">Chrome OS Version</span>
            <span class="info-value">{{
              selectedRecord.chrome_version
            }}</span>
          </div>
          <div class="info-box">
            <span class="info-label">File Size</span>
            <span class="info-value">{{
              formatBytesToGB(selectedRecord.zipfilesize)
            }}</span>
          </div>
          <div class="info-box">
            <span class="info-label">Link</span>
            <span class="info-value link-value" :title="selectedRecord.url">{{ selectedRecord.url }}</span>
          </div>
        </div>

        <a
          class="download-btn"
          :href="selectedRecord.url"
          download
          rel="noopener noreferrer"
        >
          Download Recovery Image
        </a>
      </section>
    </Transition>
  </template>

  <footer class="app-footer">
    <p>
      Data sourced from Google's public ChromeOS recovery image catalogs.
      Recovery images are large; downloads may take significant time and
      bandwidth.
    </p>
    <div class="footer-links">
      <a :href="EXTENSION_URL" target="_blank" rel="noopener noreferrer"
        >Chromebook Recovery Utility (Extension Link)</a
      >
      <a :href="EXTENSION_WINDOW_URL">Open Extension Window</a>
    </div>
  </footer>
</template>

<style scoped>
.app-header {
  margin-bottom: 2.5rem;
}
.app-header h1 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
  color: #e6edf3;
}
.subtitle {
  margin: 0;
  color: #8b949e;
  font-size: 1rem;
}

.status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: #8b949e;
}
.status.error {
  color: #ff6b6b;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #21262d;
  border-top-color: #a9e43a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.retry-btn {
  background: #a9e43a;
  color: #0d1117;
}
.retry-btn:hover {
  background: #8bc928;
}

.selectors {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}
.selector {
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 0.5rem;
}
.selector label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #c9d1d9;
  letter-spacing: 0.02em;
}
.select-wrap {
  position: relative;
}
.select-wrap::after {
  content: '▾';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #8b949e;
  font-size: 0.8em;
}
.select-wrap select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  color: #e6edf3;
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.select-wrap select:hover:not(:disabled) {
  border-color: #a9e43a;
}
.select-wrap select:focus {
  outline: none;
  border-color: #a9e43a;
  box-shadow: 0 0 0 3px rgba(169, 228, 58, 0.2);
}
.select-wrap select:disabled {
  background-color: #0d1117;
  color: #484f58;
  cursor: not-allowed;
}

.hint {
  color: #8b949e;
  font-size: 0.95rem;
  padding: 1rem 0;
}

.details {
  margin-top: 1.5rem;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.75rem;
}
.info-box {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}
.info-box:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
  border-color: #a9e43a;
}
.info-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #a9e43a;
}
.info-value {
  font-size: 0.98rem;
  font-weight: 500;
  color: #e6edf3;
  word-break: break-word;
}
.link-value {
  font-size: 0.82rem;
  display: inline-block;
  color: #8b949e;
  user-select: all;
}

.download-btn {
  display: inline-block;
  background: #a9e43a;
  color: #0d1117;
  font-weight: 600;
  padding: 0.85rem 2rem;
  border-radius: 10px;
  transition: background-color 0.2s, transform 0.1s;
  margin-bottom: 1.5rem;
}
.download-btn:hover {
  background: #8bc928;
  text-decoration: none;
}
.download-btn:active {
  transform: translateY(1px);
}

.app-footer {
  margin-top: 3rem;
  color: #6e7681;
  font-size: 0.82rem;
  line-height: 1.5;
}
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1rem;
}
.footer-links a {
  color: #a9e43a;
  font-size: 0.85rem;
}

.reveal-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.reveal-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 760px) {
  .selectors {
    grid-template-columns: 1fr;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
