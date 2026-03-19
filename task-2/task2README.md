# Kanban Board (Task 2)

## Overview

This project is a fully client-side Kanban board built using **vanilla JavaScript**, **ES Modules**, and **DOM APIs**. It allows users to manage tasks across multiple columns with full CRUD functionality and persistent state using `localStorage`.

---

## Features

### Columns

* Add new columns
* Rename existing columns
* Delete columns (with confirmation if cards exist)

### Cards

* Add cards with title and description
* Edit card details inline
* Delete cards (with confirmation)
* Move cards between columns (left/right)

### Persistence

* All data is stored in `localStorage`
* State persists across page reloads

### Filtering

* Real-time search by card title
* Case-insensitive filtering
* Columns dim when no visible cards match
* Filtering does not modify state

---

## Project Structure

```
task-2/
  index.html       # Entry HTML file
  style.css        # Styles (basic or optional)
  main.js          # App entry point
  state.js         # State management and localStorage persistence
  board.js         # DOM rendering logic
  events.js        # Event handling and UI interactions
```

---

## Installation & Running

1. Clone the repository:

   ```bash
   git clone <your-forked-repo-url>
   cd icamp-sde-1-intern/task-2
   ```

2. Open in browser:

   * Using VS Code Live Server (recommended)
   * Open `index.html` directly in browser

---

## How It Works

### State Management (`state.js`)

* Maintains a single source of truth
* All mutations go through defined functions
* Automatically saves to `localStorage` after every update
* Loads from `localStorage` on startup or uses default seed

### Rendering (`board.js`)

* `renderBoard()` rebuilds the entire UI from state
* No DOM caching or partial updates
* Ensures consistent UI after every state change

### Events (`events.js`)

* Uses **event delegation** with a single event listener on `#board`
* Handles all interactions:

  * Column actions (add, rename, delete)
  * Card actions (add, edit, delete, move)
* Inline forms used for adding/editing cards

### Filtering

* Implemented without modifying state
* Operates directly on DOM
* Re-applied after every render

---

## Edge Cases Handled

* Prevent adding columns/cards with empty titles
* Inline validation with error messages
* Cancel actions restore previous UI state
* Only one inline form allowed at a time
* Safe deletion with confirmation dialogs
* Card movement constrained within column boundaries
* Filtering works with dynamic updates and re-renders

---

## Commands / Notes

* No external libraries used
* Only ES Modules and native DOM APIs
* No `.env` variables required (included `.env.example` for compliance)

---

## Conclusion

This project demonstrates:

* Clean separation of concerns (state, rendering, events)
* Proper use of event delegation
* Dynamic DOM manipulation
* Persistent client-side state management

---

