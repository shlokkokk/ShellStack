<div align="center">

# SHELLSTACK
### Cybersecurity study terminal for CEH modules, tools, and tactical cheat sheets

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white&style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white&style=for-the-badge)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/Motion-GSAP-39FF14?logo=greensock&logoColor=white&style=for-the-badge)](https://greensock.com/gsap/)
[![Radix UI](https://img.shields.io/badge/UI-Radix%20UI-111827?style=for-the-badge)](https://www.radix-ui.com/)

**A full-screen offensive security workspace with a terminal-first aesthetic.**

[Live Demo](https://shell-stack.vercel.app/) • [Features](#features) • [Routes](#routes) • [Deployment](#deployment)

</div>

---

## Overview

ShellStack is a React + TypeScript web app built as a high-density cybersecurity study hub. It combines a curated tools directory, CEH module explorer, live terminal experience, and a command cheat sheet into one visually intense interface.

The project is designed around authorized learning and exam preparation. The UI emphasizes fast scanning, compact information hierarchy, and modal-driven drill-downs so you can move between concepts without losing context.

---

## Features

- Home dashboard with a terminal-inspired hero, featured tools, and a Kali-style hub snapshot.
- Tools directory with search, category filters, inline command previews, and full tool detail modals.
- CEH module browser with module summaries, key tools, countermeasures, and deeper topic drill-downs.
- Live terminal section for a more immersive command-line study flow.
- Study toolkit for quick review and exam-focused navigation.
- Master cheat sheet with searchable commands and clipboard copy support.
- Persistent app shell with custom cursor, cyber grid background, scanlines, and modal overlays.

---

## Routes

- `/` - landing page and featured security hub.
- `/tools` - searchable offensive tools directory.
- `/ceh` - CEH module explorer.
- `/terminal` - live terminal experience.
- `/study` - study toolkit.
- `/cheatsheet` - command cheat sheet.

---

## Content Library

- 13 tool categories covering reconnaissance, web application testing, wireless, forensics, reverse engineering, reporting, and more.
- A CEH module database with topic-level breakdowns, key points, commands, and countermeasures.
- A master cheat sheet organized by attack phase and command family.
- Tool and module detail modals for deeper inspection without leaving the page.

---

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Motion | GSAP |
| UI Primitives | Radix UI |
| Routing | React Router DOM |
| Utilities | Lucide React, clsx, tailwind-merge, cva |

---

## Project Structure

- `src/pages/` - routed screens like Home, Tools Directory, and Cheat Sheet.
- `src/sections/` - larger landing-page sections and content blocks.
- `src/components/` - shared UI, background effects, and modal components.
- `src/data/` - tool, module, and cheat sheet content sources.
- `src/hooks/` - reusable client hooks.
- `src/lib/` - utility helpers.

---

## Visual System

ShellStack uses a dark terminal palette, neon green accents, layered background effects, and high-contrast panels to create a dense security-console feel. The layout is intentionally compact, with modals and panels used to keep the interface fast and focused.

---

## Deployment

The app is live on Vercel:

[https://shell-stack.vercel.app/](https://shell-stack.vercel.app/)

ShellStack is presented as a finished deployed experience, not a starter kit.

---

## Notes

- Built for study, lab work, and authorized security training.
- The content is organized for fast exam review and practical command discovery.
- The UI is intentionally bold, cinematic, and information-heavy.

---

<div align="center">

### STAY SHARP. STAY AUTHORIZED.

ShellStack

</div>
