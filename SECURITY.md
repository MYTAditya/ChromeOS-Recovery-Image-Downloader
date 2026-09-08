# Security Policy

## Supported Versions

ChromeOS Recovery Image Downloader is a small, actively-maintained client-side tool. There is no long-term support policy for older versions — security attention is focused on the latest code on the `master` branch, which is also what powers the live deployment at [chromeos-recovery-image-downloader.vercel.app](https://chromeos-recovery-image-downloader.vercel.app).

| Version | Supported |
| --- | --- |
| Latest release | :white_check_mark: |
| `master` branch | :white_check_mark: |
| Older releases | :x: |

If you're running an older fork or self-hosted copy, please update to the latest `master` before reporting an issue, since it may already be fixed.

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.** Publicly disclosing a vulnerability before it's fixed can put users at risk.

Instead, please report it privately using one of the following methods:

1. **Preferred:** Use GitHub's private vulnerability reporting feature for this repository:
   [github.com/MYTAditya/ChromeOS-Recovery-Image-Downloader/security/advisories/new](https://github.com/MYTAditya/ChromeOS-Recovery-Image-Downloader/security/advisories/new)
2. **Discord:** Message the maintainer directly on Discord: [discord.com/users/808184827177336832](https://discord.com/users/808184827177336832)
3. If neither of the above works, open a regular issue asking to be contacted privately (without including vulnerability details), and the maintainer will follow up.

> [!NOTE]
> **No bug bounty:** This is a free, volunteer-maintained project with no budget, so **no monetary bug bounty or reward is offered** for vulnerability reports. Valid reports are still very much appreciated and will be credited (if you'd like) once a fix is out.

When reporting, please include as much of the following as you can:

- A description of the vulnerability and its potential impact.
- Steps to reproduce it (a minimal example or proof-of-concept is very helpful).
- The affected version/commit.
- Any suggested fix or mitigation, if you have one.

### What to Expect

This project is maintained on a best-effort, volunteer basis, so please be patient with response times. As a general guide:

- **Acknowledgment:** We'll aim to acknowledge your report within a few days.
- **Assessment:** We'll investigate and let you know whether it's confirmed as a valid issue.
- **Fix & disclosure:** If confirmed, we'll work on a fix and coordinate an appropriate disclosure timeline with you. Credit will be given to reporters who wish to be acknowledged, once a fix is released.

## Scope

ChromeOS Recovery Image Downloader is a client-side web app (Vue 3 + Vite) that reads ChromeOS recovery image metadata from a catalog file (under `public/catalog`) committed to this repository. That file is kept up to date by a scheduled GitHub Actions workflow rather than a live backend service. Relevant security concerns include (but aren't limited to):

- Cross-site scripting (XSS) via user-supplied input (e.g. device/board selections or query parameters rendered into the page).
- Integrity of the catalog-generation workflow itself — e.g. injection of malicious data/URLs into `public/catalog` via a compromised workflow, action, or dependency.
- Dependency vulnerabilities (e.g. flagged by `npm audit` or GitHub Dependabot alerts), including in the workflow's own scripts.
- Issues in the build/deployment configuration (Vite, Vercel) that could expose sensitive data.
- Integrity of downloaded recovery images (e.g. ensuring links point to legitimate Google-hosted sources).

Since this is a fan-made project and not an official Google product, vulnerabilities in Google's own recovery image infrastructure or the official Chromebook Recovery Utility should be reported directly to Google, not here.

## Disclaimer

> [!WARNING]
> **THIS PROJECT IS NOT AFFILIATED WITH GOOGLE OR GOOGLE INC.** This is a fan-made tool by Mastered YT Aditya that surfaces publicly available ChromeOS recovery images for download. It does not host, modify, or vet the image files themselves, which are served from Google's own infrastructure. The maintainer is not liable for the content of downloaded images or any consequences of using them.

This project is provided under the ISC License, "as is," without warranty of any kind. See [LICENSE](./LICENSE) for details.
