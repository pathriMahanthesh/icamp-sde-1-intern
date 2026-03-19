# Kanban Board (Task 2)

## 📌 Overview

This project is a fully client-side Kanban board built using **vanilla JavaScript**, **ES Modules**, and **DOM APIs**. It allows users to manage tasks across multiple columns with full CRUD functionality and persistent state using `localStorage`.

---

## ✨ Features

### Columns
- Add new columns  
- Rename existing columns  
- Delete columns (with confirmation if cards exist)

### Cards
- Add cards with title and description  
- Edit card details inline  
- Delete cards (with confirmation)  
- Move cards between columns (left/right)

### Persistence
- All data is stored in `localStorage`  
- State persists across page reloads  

### Filtering
- Real-time search by card title  
- Case-insensitive filtering  
- Columns dim when no visible cards match  
- Filtering does not modify the underlying state  

---

## 📂 Project Structure
```
task-2/
├── index.html        # Entry HTML file
├── style.css         # Styles for the UI
├── main.js           # Application entry point
├── state.js          # State management and localStorage persistence
├── board.js          # DOM rendering logic
├── events.js         # Event handling and UI interactions
├── .env.example      # Environment variables template (empty)
├── task2README.md         # Project documentation
└── WRITEUP.md        # Detailed explanation of approach and design
```
---

## ⚙️ Installation & Running

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd icamp-sde-1-intern/task-2
```

---

### 2. Run the Application

#### ✅Using Live Server (Recommended)

- Open the project in **VS Code**
- Right-click on `index.html`
- Click **"Open with Live Server"**

---

## 🔧 Environment Variables

This project does not require any environment variables.

But a `.env.example` file is included for compliance.

---

## 🧠 How It Works

### State Management (`state.js`)

- Maintains a single source of truth for the application  
- All updates go through defined state mutation functions  
- Automatically persists data to `localStorage` after every change  
- Loads existing state on startup or initializes default state  

---

### Rendering (`board.js`)

- `renderBoard()` rebuilds the entire UI from the current state  
- Ensures UI consistency after every update  
- No partial DOM updates or caching are used  

---

### Event Handling (`events.js`)

- Uses **event delegation** with a single listener on the board container  
- Handles:
  - Column actions (add, rename, delete)  
  - Card actions (add, edit, delete, move)  
- Supports inline forms for improved user experience  

---

### Filtering

- Implemented without modifying the underlying state  
- Operates directly on the DOM  
- Automatically re-applied after each render  

---

## ⚠️ Edge Cases Handled

- Prevent adding columns/cards with empty titles  
- Inline validation with user feedback  
- Cancel actions restore previous UI state  
- Only one inline form is allowed at a time  
- Safe deletion with confirmation dialogs  
- Card movement restricted within valid column boundaries  
- Filtering works dynamically with re-renders  

---

## 🧪 Notes

- No external libraries are used  
- Built entirely using ES Modules and native DOM APIs  
- Fully client-side application  
- No backend required
- Commit history includes iterative development with ticket-based commits and feature-level updates.

---

## 🚀 Conclusion

This project demonstrates:

- Clean separation of concerns (state, rendering, events)  
- Efficient DOM manipulation  
- Proper use of event delegation  
- Persistent client-side state management  
