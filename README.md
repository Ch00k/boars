# WoW Boar Quest Tracker

A simple web service to track your "Kill 100 Boars" quest progress in World of Warcraft.

## Features

- Simple password authentication (hardcoded: `boarhunter123`)
- Progress tracking stored in a text file
- Visual progress bar and counter
- Increment/decrement buttons for kill count
- WoW-themed styling

## How to Run

1. Make sure you have Node.js installed
2. Run the server:
   ```bash
   node server.js
   ```
3. Open your browser and go to: `http://localhost:3000`
4. Login with password: `boarhunter123`
5. Track your boar kills!

## Files

- `index.html` - The web interface
- `server.js` - Node.js server handling API requests
- `progress.txt` - Stores your current kill count (created automatically)

## API Endpoints

- `GET /api/progress` - Get current kill count
- `POST /api/progress` - Update kill count (requires JSON body with `count` field)

Your progress is automatically saved when you click the +/- buttons.
