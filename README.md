# GitHate CLI 🕵️‍♂️

**Track who unfollowed you on GitHub directly from your terminal.**

`githate` is a modern, fast, and beautiful CLI tool that helps you keep track of your GitHub followers. It detects who unfollowed you since the last check and lets you manage your following list with ease.

![GitHate CLI Demo](https://placehold.co/600x400?text=GitHate+CLI+Demo)

## Features

- 🕵️ **Track Unfollowers**: Instantly see who stopped following you.
- 📈 **Track New Followers**: See who started following you.
- 👥 **Manage Relationships**: List followers, following, and follow/unfollow users.
- 🔐 **Secure**: Your Personal Access Token is stored locally on your machine.
- 💅 **Beautiful UI**: Built with `@clack/prompts` and `picocolors` for a great experience.

## Installation

You can install `githate` globally using npm:

```bash
npm install -g githate
```

_Note: You may need to use `sudo` on macOS/Linux if you have permission issues._

## Setup

1.  **Generate a GitHub Personal Access Token (PAT)**:
    - Go to [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens).
    - Click **Generate new token (classic)**.
    - Give it a note (e.g., "GitHate CLI").
    - Select the **`read:user`** and **`user:follow`** scopes.
    - Click **Generate token** and copy it.

2.  **Login**:
    Run the login command and paste your token when prompted:
    ```bash
    githate login
    ```

## Usage

### Check for Haters (Unfollowers)

This is the main feature. Run this command to compare your current followers with the last saved state.

```bash
githate check
```

_On the first run, it will just save your current followers._

### List Followers

```bash
githate followers
```

### List Following

```bash
githate following
```

### Follow a User

```bash
githate follow <username>
```

### Unfollow a User

```bash
githate unfollow <username>
```

## Automation (Daily Check)

You can set up a cron job or task scheduler to run `githate check` daily.

### macOS / Linux (Cron)

1.  Open your crontab:
    ```bash
    crontab -e
    ```
2.  Add the following line to run everyday at 9 AM:
    ```bash
    0 9 * * * /usr/local/bin/githate check >> /tmp/githate.log 2>&1
    ```
    _(Make sure to use the correct path to `githate`. You can find it with `which githate`)_

### Windows (Task Scheduler)

1.  Open **Task Scheduler**.
2.  Create a Basic Task.
3.  Set the trigger to **Daily**.
4.  Set the action to **Start a program**.
5.  Program/script: `githate` (or full path to `githate.cmd`).
6.  Add arguments: `check`.

## License

ISC
