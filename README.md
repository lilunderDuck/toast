## About This
Another minimal half-baked personal journal app for my daily writing, basically.

This is just my personal project to waste some time though.

## Getting Started
If you still want to try messing around with this app code, even after you read the above lines, here's how you can do it.

### Prerequisites
Make sure you have [Go](https://go.dev/dl/), [GCC](https://gcc.gnu.org/) to use `make` command, and [Deno](https://deno.com/) (or `npm` if you like, but requires modification) installed in your machine.

For easier management, this project uses [scoop](https://scoop.sh/) to install other packages. However, this is not required.

If one of those above isn't installed, you can try installing it:
- `Go`: Go to https://go.dev/dl/ and select the latest version (v1.23 or above)
- `make`: Run `scoop install make`
- `Deno`: Run `irm https://deno.land/install.ps1 | iex` or go to their download page: https://deno.com/

### Installation
1. Clone the repo
   ```powershell
   git clone https://github.com/lilunderDuck/this-journal-app.git
   ```
2. Navigate to your cloned repo and delete `.git` folder, if you want to make your own version.
3. Install [`wails`](https://wails.io/docs/gettingstarted/installation#installing-wails) command. Other platform specific dependencies that `wails` depends can be found [here](https://wails.io/docs/gettingstarted/installation#platform-specific-dependencies)
   ```
   go install github.com/wailsapp/wails/v2/cmd/wails@latest
   ```
4. Run the app in dev mode
   ```
   make dev
   ```
   The command will install necessary frontend & backend dependencies for you.

To build an executable, you can run this command
```
make build
```

### Notes
If you want to use `npm` instead of `deno`, open `wails.json` and modify these following lines:
```diff
{
   ... other settings ...
-  "frontend:install": "deno install",
-  "frontend:build": "deno task build",
-  "frontend:dev:watcher": "deno task dev",
+  "frontend:install": "npm install",
+  "frontend:build": "npm run build",
+  "frontend:dev:watcher": "npm run dev",
   ... other settings ...
}
```

Other `wails.json` settings can be found here, if you want to poke around: https://wails.io/docs/reference/project-config