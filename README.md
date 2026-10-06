# P3 - Restaurant Management System – Pandrup Pizza & Steak House

This project is a restaurant management system built for Pandrup Pizza & Steak House (PPSH). It helps the staff register table reservations, take orders at the table and send them straight to the kitchen.

<!-- TODO: add a screenshot of the app, e.g. ![app preview](./img/app_preview.png) -->

## Features

- **Reservations** – customers book by phone or in person, and the waiter registers the reservation in the system.
- **Menu** – the owner can view and edit dishes, prices and allergen information.
- **Orders** – the waiter picks a table, builds an order (with notes such as allergies or how the meat is cooked) and sends it to the kitchen.
- **Kitchen screen** – new orders show up on the kitchen screen. Archived orders can be looked up later.

## Installation & usage

### Dependencies
<!-- TODO: fill in when the tech stack is final -->
- Java (version: TODO)
- TODO: build tool (Maven / Gradle)
- TODO: database

### Installation
To install the project on a local machine, download the repository by clicking on the green **Code** button at the top of this repository page and choosing **Download ZIP**. Unzip the file wherever you want.

Alternatively, clone the GitHub repo in the desired location:

```sh
$ git clone https://github.com/P3-Project/P3.git
```

### Running the application
<!-- TODO: replace with the real build/run commands -->
```sh
$ TODO: build command
$ TODO: run command
```

Then open `http://localhost:TODO` in your browser.

## Contributing

### Rules on `main`
The `main` branch is protected. This means:

- **You cannot push directly to `main`.** All changes must go through a Pull Request (PR) from your own branch.
- **Every PR needs 2 approvals** from other group members before it can be merged.
- **New commits remove old approvals.** If you push more changes to your branch after someone approved it, the approvals are dismissed, and the PR must be approved again.
- **All review comments must be resolved** before the PR can be merged.
- **Status checks must pass, and your branch must be up to date with `main`** before merging (this applies once automated checks are added to the repo).
- **Force pushing and deleting `main` is not allowed.**

### 1. Sign out a task
Pick a task from the To Do column on the [project board](TODO-link-to-board). Move it to In Progress and assign yourself to it, so the rest of the group knows you are working on it.

### 2. Create a Git branch
Always start from the newest version of `main`:

```sh
$ git checkout main
$ git pull origin main
```

Then create and switch to a new branch with `git checkout -b`. Name the branch after the type of task:

- `feature/branch-name` – new functionality
- `bugfix/branch-name` – fixing something that is broken
- `rework/branch-name` – changing or cleaning up existing code

Example:

```sh
$ git checkout -b feature/kitchen-screen
```

### 3. Make your changes
Work as normal, writing and testing your code. Try to keep your changes within the scope of the task you signed up for. Small PRs are easier and faster to review.

### 4. Commit and push your changes
Run the following commands in order:

- `git status` – shows which files you have changed. Check it so you don't push anything you didn't mean to.
- `git add .` – stages all changed files so they are ready to be committed. To stage a single file instead, use `git add path/to/file`.
- `git commit -m "Describe your changes here"` – saves your changes as a commit with a short message describing what you did.
- `git push origin insert/branch-name` – uploads your branch to GitHub. Replace `insert/branch-name` with your branch name, e.g. `git push origin feature/kitchen-screen`.

### 5. Keep your branch up to date
If someone else merged into `main` while you were working, your branch is behind and must be updated before you can merge it. Bring the newest `main` into your branch:

```sh
$ git checkout main
$ git pull origin main
$ git checkout insert/branch-name
$ git merge main
```

If Git reports merge conflicts, open the conflicting files, decide which code to keep, then `git add` and `git commit` the result and push again. You can also click **Update branch** on the PR page on GitHub if there are no conflicts.

### 6. Create a Pull Request
When your task is finished, go to the repository [main page](TODO-link-to-repo) and switch from `main` to your branch. Click **Contribute → Open pull request** (or **Compare & pull request** if GitHub shows the yellow banner).

Write a short description of what you changed and how to test it, then click **Create pull request**. GitHub will tell you if there are any merge conflicts.

### 7. Review and merge
Let the rest of the group know that your PR is ready. **Two other members** must review it:

- Reviewers either **Approve** the PR or **Request changes** with comments.
- If changes are requested, fix them on the same branch, then commit and push again. Remember, this removes earlier approvals, so the PR needs to be approved again.
- Mark each comment as **Resolved** once it has been handled. Resolve all conversations before merging.

When the PR has 2 approvals, no open conversations and is up to date with `main`, click **Merge pull request**. Afterwards, delete your branch on GitHub and move the task to Done on the board.

## Authors

<!-- TODO: add the full names of all group members -->
- Ahmad Tasnim Zirman
- Ahmed Abdiqader Abdullahi
- Bilal Kayatuz
- Dunia Al-Hadi
- Enes Toplica
- Hamze Ali Alkhadir
- Mohamed Abdullah Salad Omar

Group CS-26-SW-3-06, Software Engineering, Aalborg University. Supervisor: Martin Zimmerman.
