# GitHate CLI - Comprehensive Architecture & Implementation Guide

This documentation provides a deep dive into the **GitHate** CLI tool. The goal is to explain the codebase so thoroughly that a developer could rebuild it from scratch without needing the original source code.

## 1. Project Overview

**GitHate** is a command-line interface (CLI) tool built with Node.js that tracks who unfollows a user on GitHub. It works by:

1.  Authenticating with GitHub using a Personal Access Token (PAT).
2.  Storing the current list of followers locally.
3.  Comparing the current list against the stored list on subsequent runs to identify "haters" (unfollowers) and new fans.

### Core Tech Stack

- **Runtime**: Node.js
- **Language**: JavaScript (ES Modules)
- **CLI Framework**: `commander` (for command routing and argument parsing)
- **UI/UX**: `@clack/prompts` (interactive prompts), `chalk` & `picocolors` (colors), `boxen` (boxes), `ora` (spinners via clack), `figlet` & `gradient-string` (ASCII art).
- **API Client**: `@octokit/rest` (official GitHub SDK).
- **Data Persistence**: `conf` (simple local JSON storage).

---

## 2. Architecture (Level 0)

The high-level architecture follows a standard CLI pattern: **Input -> Router -> Controller -> Service -> Storage/API**.

```mermaid
graph TD
    User([User]) -->|Run Command| CLI[bin/hater.js]
    CLI -->|Parses Args| Router{Commander}

    Router -->|check| CheckCmd[lib/commands/check.js]
    Router -->|login| LoginCmd[lib/commands/login.js]
    Router -->|follow/unfollow| SocialCmd[lib/commands/follow.js / unfollow.js]
    Router -->|followers/following| ListCmd[lib/commands/followers.js / following.js]

    subgraph "Core Logic & Services"
        CheckCmd --> Auth[lib/utils/auth.js]
        CheckCmd --> Store[lib/utils/store.js]
        LoginCmd --> Auth
        LoginCmd --> Store
        SocialCmd --> Auth
        ListCmd --> Auth
    end

    subgraph "External Systems"
        Auth -->|API Calls| GitHubAPI[GitHub OAuth/REST API]
        Store -->|Read/WriteJSON| LocalConfig[Local File System (Config)]
    end

    subgraph "UI Layer"
        CLI --> Display[lib/ui/display.js]
        CheckCmd --> Display
        CheckCmd --> Art[lib/ui/art.js]
    end
```

---

## 3. Directory Structure

The project is organized to separate concerns: entry point, commands, logic/utils, and UI.

```
.
├── bin/
│   └── hater.js          # Entry point. Sets up the CLI program.
├── lib/
│   ├── commands/         # Business logic for each CLI command.
│   │   ├── check.js      # Main logic: compares followers.
│   │   ├── login.js      # Handles authentication.
│   │   ├── follow.js     # Logic to follow a user.
│   │   ├── unfollow.js   # Logic to unfollow a user.
│   │   ├── followers.js  # Lists current followers.
│   │   └── following.js  # Lists who you are following.
│   ├── ui/               # Presentation layer.
│   │   ├── art.js        # ASCII art generation.
│   │   └── display.js    # Console output helpers (colors, spinners).
│   └── utils/            # Shared utilities.
│       ├── auth.js       # GitHub API client initialization.
│       └── store.js      # Local data persistence (conf).
├── package.json          # Dependencies and metadata.
└── README.md             # User documentation.
```

---

## 4. Component Details (Level 1) & Implementation Guide

### 4.1. The Entry Point: `bin/hater.js`

This file is the specific entry point defined in `package.json` under `bin`. It sets up the `commander` program.

**Key Responsibilities:**

1.  **Shebang**: `#!/usr/bin/env node` makes it executable.
2.  **Metadata**: Reads `version` from `package.json`.
3.  **Command Definition**: Defines the available commands (`login`, `check`, etc.) and maps them to their respective functions in `lib/commands/`.
4.  **Interactive Mode**: If no arguments are provided, it launches an interactive prompt using `@clack/prompts` to let the user select a command from a list.

**Code Structure:**

- Imports `Command` from `commander`.
- Uses dynamic `import()` for commands to improve startup performance (only load what's used).
- `program.parse(process.argv)` triggers the parsing.

---

### 4.2. State Management: `lib/utils/store.js`

This module handles all local data persistence using the `conf` library. It acts as a wrapper around the file system.

**Stored Data Schema:**

- `token`: String (GitHub Personal Access Token).
- `username`: String (The authenticated user's login).
- `followers`: Array (List of follower usernames from the last check).
- `lastCheck`: String (ISO date string of the last successful check).

**Key Functions:**

- `getStoredToken()`, `setStoredToken()`.
- `getStoredFollowers()`, `setStoredFollowers()`.
- `getStoredUsername()`: Critical for remembering who to track.

---

### 4.3. Authentication: `lib/utils/auth.js`

This module manages the connection to GitHub.

**Key Responsibilities:**

- **`getOctokit()`**: Returns a singleton instance of the `Octokit` client. It attempts to load the token from `store.js`. If no token exists, it initializes without auth (Guest mode), which has lower rate limits (60 req/hr).
- **`verifyToken(token)`**: Used during login. It attempts to make an API call (`octokit.rest.users.getAuthenticated()`) to validate the token before saving it.

---

### 4.4. Core Logic: `lib/commands/check.js`

This is the heart of the application. It orchestrates the "hater detection" algorithm.

**Algorithm Flow:**

```mermaid
graph TD
    Start[Run 'check'] --> LoadStore[Load Token & Stored Followers]
    LoadStore --> Auth{Token Exists?}

    Auth --Yes--> GetUser[Get Authenticated Username]
    Auth --No--> AskUser[Ask for Username (Guest Mode)]

    GetUser --> FetchAPI[Fetch Current Followers from GitHub]
    AskUser --> FetchAPI

    FetchAPI --> Compare{Is this First Run?}

    Compare --Yes--> SaveAll[Save all followers]
    SaveAll --> NotifyFirst[Display 'Tracking Started']

    Compare --No--> Diff[Diff Stored vs Current]

    Diff --> NewF[Identify New Followers]
    Diff --> UnF[Identify Unfollowers]

    NewF --> DisplayNew[Display Green List]
    UnF --> DisplayHaters[Display Red List + ASCII Art]

    DisplayHaters --> UpdateStore[Update Store with Current List]
    DisplayNew --> UpdateStore
    NotifyFirst --> End
    UpdateStore --> End
```

**Implementation Details:**

- Uses `octokit.paginate` to fetch _all_ followers, handling pagination automatically (GitHub limits to 100 per page).
- **Diff Logic**:
  - `newFollowers = current - stored`
  - `unfollowers = stored - current`
- **UX**: Uses `createSpinner` from `display.js` to indicate activity during API calls.
- **Drift Handling**: Always updates the store with the _current_ list at the end, so the next check is relative to _now_.

---

### 4.5. The "Login" Command: `lib/commands/login.js`

Simple but crucial.

1.  Prompts user for PAT using `password` prompt (masks input).
2.  Calls `auth.verifyToken(token)`.
3.  If valid, saves to store via `setStoredToken`.
4.  Displays success with logged-in username.

---

### 4.6. Social Commands (`follow.js`, `unfollow.js`)

These are wrappers around GitHub's user relationship APIs.

- **`follow(username)`**: Calls `PUT /user/following/{username}`.
- **`unfollow(username)`**: Calls `DELETE /user/following/{username}`.
- **Error Handling**: Catches 404s (user not found) or network errors and displays them nicely.

---

### 4.7. UI Layer (`lib/ui/`)

**`art.js`**

- Uses `figlet` to generate large ASCII text.
- `getBanner()`: Generates the "GITHATE" header using "ANSI Shadow" font and "retro" gradient.
- `getHaterReveal()`: Generates the dramatic "THE HATERS" text using "DOS Rebel" font and "passion" gradient (reds/oranges).

**`display.js`**

- Centralizes all `console.log` calls to ensure consistent styling.
- Exports helpers like `displayError` (uses `boxen` for a red error box), `displaySuccess` (green tick), and `displayHater` (formatted message with broken heart icon).
- Randomized "Tips" shown on startup to add personality.

---

## 5. API Reference

The app relies heavily on the GitHub REST API.

| Command     | GitHub API Endpoint           | Method   | Octokit Method                            | Scope Required |
| :---------- | :---------------------------- | :------- | :---------------------------------------- | :------------- |
| `login`     | `/user`                       | `GET`    | `users.getAuthenticated()`                | `read:user`    |
| `check`     | `/users/{username}/followers` | `GET`    | `users.listFollowersForUser`              | `read:user`    |
| `follow`    | `/user/following/{username}`  | `PUT`    | `users.follow`                            | `user:follow`  |
| `unfollow`  | `/user/following/{username}`  | `DELETE` | `users.unfollow`                          | `user:follow`  |
| `followers` | `/user/followers`             | `GET`    | `users.listFollowersForAuthenticatedUser` | `read:user`    |
| `following` | `/user/following`             | `GET`    | `users.listFollowedByAuthenticated`       | `read:user`    |

**Rate Limits**:

- **Authenticated**: 5,000 requests/hour.
- **Unauthenticated (Guest)**: 60 requests/hour.
  - _Logic checks for 403 errors and warns user to login if rate-limited._

---

## 6. How to Rebuild from Scratch

1.  **Initialize Project**:
    ```bash
    mkdir githate && cd githate
    npm init -y
    ```
2.  **Install Dependencies**:
    ```bash
    npm install commander @octokit/rest conf @clack/prompts chalk picocolors boxen figlet gradient-string
    ```
3.  **Configure `package.json`**:
    - Add `"type": "module"` (Project uses ES Modules).
    - Add `"bin": { "githate": "bin/hater.js" }`.
4.  **Scaffold Directory**:
    - Create the folders: `bin`, `lib/commands`, `lib/ui`, `lib/utils`.
5.  **Implement Utils First**:
    - Write `store.js` to handle data saving.
    - Write `auth.js` to handle Octokit initialization.
6.  **Implement Commands**:
    - Start with `login.js` to get a token.
    - Implement `check.js` with the logic described in section 4.4.
7.  **Wire up the CLI**:
    - Create `bin/hater.js`, set up Commander, and link the commands.
8.  **Polish UI**:
    - Add `art.js` and `display.js` to make it look "pro".

---

This documentation should provide everything needed to understand, maintain, or rewrite the **GitHate** CLI tool. is 100% complete and accurate to the current implementation.
