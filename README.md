<!--
  githate - GitHub Unfollower Tracker CLI Tool
  Track who unfollowed you on GitHub | GitHub follower tracker | GitHub unfollow checker
  Find out who unfollowed you on GitHub from the command line
  GitHub CLI tool | npm CLI tool | GitHub followers | GitHub unfollowers | track GitHub followers

  Author: Anant Singhal
  GitHub: https://github.com/GithubAnant
  Twitter: https://twitter.com/anant_hq
  LinkedIn: https://linkedin.com/in/anantsinghal1

  Keywords: github unfollower tracker, github follower checker, who unfollowed me on github,
  github cli tool, track github followers, github unfollow notification, githate, npm githate,
  github follower manager, github social tracker, open source github tool
-->

<p align="center">
  <img src="https://raw.githubusercontent.com/trickastle/githate-media/main/githate1_compressed.png" alt="GitHate CLI" width="700" />
</p>

<h1 align="center">GitHate</h1>

<p align="center">
  Track who unfollowed you on GitHub. Directly from your terminal.<br/>
  <a href="https://www.npmjs.com/package/githate"><strong>npmjs.com/package/githate</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/githate"><img src="https://img.shields.io/npm/v/githate" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/githate"><img src="https://img.shields.io/npm/dm/githate" alt="npm downloads" /></a>
  <a href="https://github.com/GithubAnant/githate"><img src="https://img.shields.io/github/stars/GithubAnant/githate" alt="GitHub stars" /></a>
  <a href="https://github.com/GithubAnant/githate/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/githate" alt="license" /></a>
</p>

---

## Install

```bash
npm install -g githate
```

or if you prefer pnpm:

```bash
pnpm add -g githate
```

Then just run:

```bash
githate
```

That's it. You get an interactive REPL shell. Type `/help` to see all commands.

---

## What It Does

GitHate fetches your current GitHub followers, compares them against your last saved list, and reveals:

- **Who unfollowed you** (the haters)
- **Who started following you** (the fans)

It stores everything locally on your machine. No server, no database, no third-party services.

---

## Getting Started

### 1. Login

Run `githate` and type `/login`. It uses GitHub OAuth Device Flow — open the link in your browser, enter the code, done. No tokens to copy-paste.

### 2. Scan

Type `/scan` to check for changes. On the first run it saves your current followers as a baseline. On every run after that, it diffs and shows you who left and who joined.

### 3. View Hater History

Type `/haters` to see every person who has ever unfollowed you, with dates. Repeat offenders are flagged.

---

## Commands

GitHate works in two modes:

**REPL mode** (run `githate` with no arguments):

| Command      | Description                                     |
| ------------ | ----------------------------------------------- |
| `/scan`      | Check for new unfollowers and followers         |
| `/haters`    | View the hall of shame (historical unfollowers) |
| `/followers` | List your current followers                     |
| `/following` | List who you are following                      |
| `/login`     | Authenticate with GitHub                        |
| `/logout`    | Remove stored credentials                       |
| `/start`     | Start background auto-tracking service          |
| `/stop`      | Stop background service                         |
| `/status`    | Check if background service is running          |
| `/why`       | The origin story                                |
| `/help`      | Show all commands                               |
| `/quit`      | Exit                                            |

**Direct CLI mode** (single commands):

```bash
githate scan
githate login
githate haters
githate followers
githate following
githate follow <username>
githate unfollow <username>
githate start --interval 60
githate stop
githate status
githate clearcache
githate logout
```

---

## Background Tracking

Start a background service that polls GitHub on an interval and sends you a desktop notification when someone unfollows you.

```bash
githate start
```

Default interval is 720 minutes (12 hours). Change it with:

```bash
githate start --interval 60
```

Check status or stop it:

```bash
githate status
githate stop
```

---

## How It Works

1. On first `/scan`, GitHate fetches all your followers from the GitHub API and saves them locally.
2. On subsequent scans, it fetches again and diffs against the saved list.
3. New followers and unfollowers are displayed. Unfollowers are saved to a persistent "hater history."
4. The background service (`/start`) does the same thing in a detached process and sends OS notifications.

Data is stored in your OS config directory:

- **macOS**: `~/Library/Preferences/githate-cli-nodejs/config.json`
- **Linux**: `~/.config/githate-cli-nodejs/config.json`
- **Windows**: `%APPDATA%/githate-cli-nodejs/config.json`

---

## Guest Mode

You can use GitHate without logging in. Just run `/scan` and enter any public GitHub username. Guest mode is limited to 60 API requests per hour. Login to get 5,000 requests per hour.

---

## Built By

**Anant Singhal**

- [GitHub](https://github.com/GithubAnant)
- [Twitter](https://twitter.com/anant_hq)
- [LinkedIn](https://linkedin.com/in/anantsinghal1)

---

## License

ISC
