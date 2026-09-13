<div align="center">
  <img src="./src/icon.svg" alt="Official Icon" width="100" />
  <h1 style="font-size: 28px; margin: 10px 0;">ChromeOS Recovery Image Downloader</h1>
</div>

![](https://img.shields.io/github/created-at/MYTAditya/ChromeOS-Recovery-Image-Downloader?color=561BC5&style=for-the-badge&logo=GitHub)
![](https://img.shields.io/github/v/release/MYTAditya/ChromeOS-Recovery-Image-Downloader?color=a9e43a&style=for-the-badge&logo=GitHub)
![](https://img.shields.io/github/license/MYTAditya/ChromeOS-Recovery-Image-Downloader?style=for-the-badge&logo=GitHub&color=1BA0D7)
![](https://img.shields.io/github/languages/top/MYTAditya/ChromeOS-Recovery-Image-Downloader?style=for-the-badge&color=4FC08D&logo=vuedotjs&logoColor=white)
![](https://img.shields.io/github/stars/MYTAditya/ChromeOS-Recovery-Image-Downloader?style=for-the-badge&logo=GitHub&color=01c45b)
![](https://visitor-badge.laobi.icu/badge?page_id=MYTAditya.ChromeOS-Recovery-Image-Downloader&left_text=VISITORS&logo=github&radius=0)

ChromeOS Recovery Image Downloader is a simple tool to download official ChromeOS Recovery Images. The interface is very similar to [Chromebook Recovery Utility](https://chromewebstore.google.com/detail/chromebook-recovery-utili/pocpnlppkickgojjlmhdmidojbmbodfm), the official Chrome Extension by Google Inc. With this tool, you'll be able to download the same recovery images available in [Chromebook Recovery Utility](https://chromewebstore.google.com/detail/chromebook-recovery-utili/pocpnlppkickgojjlmhdmidojbmbodfm).

**🔗 Try it live:** [chromeos-recovery-image-downloader.vercel.app](https://chromeos-recovery-image-downloader.vercel.app)

> [!WARNING]
> This tool surfaces publicly available ChromeOS recovery images for download. It does not host, modify, or vet the image files themselves, which are served from Google's own infrastructure. The maintainer is not responsible for the content of downloaded images or any consequences of using them.

> [!NOTE]
> **THIS PROJECT IS NOT AFFILIATED WITH GOOGLE OR GOOGLE INC.** This is a fan-made tool made by Mastered YT Aditya and is not affiliated with, endorsed by, or sponsored by Google.

<details>
  <summary><b>Table of Contents</b></summary>
  
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Security](#security)
  - [License](#license)
  - [Credits](#credits)

</details>

## Features

- 💽 Browse and download **official ChromeOS Recovery Images** for supported Chromebooks and Chromeboxes
- 🖥️ Interface modeled after the official **Chromebook Recovery Utility**
- 🚫 No browser extension required — works entirely in your browser
- 🔄 Recovery image catalog kept up to date automatically via a scheduled GitHub Actions workflow
- ⚡ Fast, client-side app powered by Vite

## Tech Stack

- **[Vite](https://vitejs.dev)** — build tool and dev server
- **[Vue 3](https://vuejs.org)** — UI framework
- **[Iconify](https://iconify.design)** (`@iconify/vue`) — icons
- **GitHub Actions** — scheduled workflow that generates the recovery image catalog
- Deployed on **[Vercel](https://vercel.com)**

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MYTAditya/ChromeOS-Recovery-Image-Downloader.git
cd ChromeOS-Recovery-Image-Downloader

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open the local URL Vite prints in your terminal (typically `http://localhost:5173`) to use the app.

### Build

```bash
npm run build
```

## Usage

1. Open the [live app](https://chromeos-recovery-image-downloader.vercel.app) (or your local dev server).
2. Select for your Chromebook by device name.
3. Download the recovery image file directly.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, coding guidelines, and the pull request process.

## Security

If you discover a security vulnerability, please **do not** open a public issue. See [SECURITY.md](./SECURITY.md) for how to report it responsibly.

## License

This project is licensed under the [ISC License](./LICENSE). Copyright ©️ 2026-Present, Mastered YT Aditya.

## Credits

Made with ❤️ by [Mastered YT Aditya](https://github.com/MYTAditya).

| Package Name | Copyright | License |
| --- | --- | --- |
| [Vue](https://vuejs.org) | 2018-present, Yuxi (Evan) You and Vue contributors | MIT License |
| [Iconify for Vue](https://iconify.design) (`@iconify/vue`) | 2021-PRESENT Vjacheslav Trushkin | MIT License |
| [Vite](https://vitejs.dev) | 2019-present, VoidZero Inc. and Vite contributors | MIT License |
| [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue) | 2019-present, Yuxi (Evan) You and Vite contributors | MIT License |
