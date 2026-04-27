# <div align="center">SHELLSTACK</div>

<div align="center">

### Cybersecurity learning, tool exploration, command building, and tactical reference in one terminal-inspired workspace

[Live Demo](https://shell-stack.vercel.app/) | [Vite](https://vitejs.dev/) | [React](https://react.dev/) | [TypeScript](https://www.typescriptlang.org/)

</div>

---

![ShellStack Preview](./public/social-preview.svg)

## Overview

ShellStack is a visually immersive cybersecurity study platform built for people who want more than static notes.

It combines:

- a curated Kali Linux tool directory
- deep tool detail modals with commands, flags, examples, and guided walkthroughs
- interactive command builders for dynamic command generation
- CEH-aligned learning content across 20 modules
- a large searchable command cheat sheet
- terminal-style learning flows and animated cyber UI

The result is a single environment for learning concepts, exploring tools, and quickly turning knowledge into usable command workflows.

---

## Why It Hits Different

| System | What it gives you |
| --- | --- |
| `Tool Directory` | Browse a large offensive security catalog with ranked search, category filtering, command previews, and drill-down detail views. |
| `Tool Detail Modal` | Explore commands, common flags, usage context, installation notes, examples, legal warnings, and tactical guides without leaving the page. |
| `Interactive Command Builder` | Generate parameterized commands live from form inputs and copy them instantly. |
| `CEH Module Explorer` | Navigate 20 CEH-focused learning modules through a dense, visual study interface. |
| `Cheat Sheet Console` | Search across a large command reference and copy high-value commands quickly. |
| `Terminal Experience` | Learn in an interface designed to feel like a cyber operations console rather than a generic docs page. |

---

## Product Coverage

```text
19 Tool Categories
20 CEH Modules
280+ Curated Security Tools
1000+ Command Entries
800+ Flag References
6 Core Route Experiences
```

---

## Main Experiences

### `/`
The landing experience combines the cinematic hero, Kali/Linux foundation overview, and featured tool discovery into a strong first pass through the platform.

### `/tools`
The full offensive security directory with ranked search, category filtering, command previews, tactical application hints, and full tool documentation modals.

### `/ceh`
A CEH-oriented module explorer built to support structured study instead of flat reading.

### `/terminal`
A live-style terminal learning section for command and output-driven presentation.

### `/study`
A study-oriented route that connects learners to practical resources and guided paths.

### `/cheatsheet`
A dense command-first reference experience with searchable categories, operator-style navigation, and one-click copy actions.

---

## Feature Highlights

### Dynamic command builders

Some tools include interactive builders that turn user input into ready-to-copy commands in real time.

- text, select, and checkbox-driven parameters
- generated output preview
- fast clipboard workflow
- built directly into tool documentation

### Deep tool documentation

Each tool can surface much more than a name and a few commands.

- essential commands
- common flags
- when-to-use guidance
- related tools
- installation notes
- sample output
- practical examples
- tactical walkthroughs for richer tools

### Search designed for discovery

Tool search is not just raw string matching. The platform ranks results to make exact, prefix, and high-signal matches easier to find fast.

### Visual system with purpose

ShellStack leans hard into a cyber-ops identity:

- terminal surfaces
- neon accents
- scanline and HUD-inspired atmosphere
- dense but organized information design
- motion used for orientation, not noise

---

## Built With

- React 19
- TypeScript
- Vite
- Tailwind CSS
- GSAP
- React Router
- Lucide Icons
- Radix UI primitives

---

## Project Shape

```text
app/
|- public/
|- src/
|  |- components/
|  |- data/
|  |  |- modules/
|  |  `- tools/
|  |- pages/
|  `- sections/
|- package.json
`- README.md
```

### Content model

- `src/data/tools/` contains the category-based security tool datasets
- `src/data/modules/` contains the CEH learning modules
- `src/data/masterCheatSheet.ts` powers the command cheat sheet experience

---

## Screens and Systems

- `Home` for intro, featured discovery, and Kali/Linux orientation
- `Tools Directory` for full catalog exploration
- `Tool Detail Modal` for multi-tab deep dives
- `Interactive Command Builder` for dynamic command creation
- `Cheat Sheet Page` for command recall and quick copy
- `Live Terminal` for command-style learning presentation

---

## Philosophy

ShellStack is designed around a simple idea:

> learning security tools should feel operational, not passive

The UI, information density, and route structure are all built to support that feeling.

---

## Responsible Use

This project is intended for authorized cybersecurity learning, lab work, and ethical security education only.

Only use security tools and commands in environments you own or are explicitly permitted to test.

---

## Live

**Production:** https://shell-stack.vercel.app/

---

<div align="center">

### Learn the system. Command the toolkit.

</div>
