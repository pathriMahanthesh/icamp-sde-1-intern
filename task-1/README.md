# FeedWatch 📰

FeedWatch is a simple CLI tool to track RSS/Atom feeds and display new updates directly in the terminal.

## 🚀 Features

- Add and manage RSS/Atom feeds
- Detect NEW vs SEEN articles
- JSON output support
- Handles network failures gracefully
- Persistent state tracking
- Fully tested (unit + integration)

---

## 📦 Installation

```bash
git clone <your-repo-link>
cd feedwatch
npm install

⚙️ Usage
➕ Add a feed
node feedwatch.js add <name> <url>
📋 List feeds
node feedwatch.js list
▶️ Run feed watcher
node feedwatch.js run
📖 Read a specific feed
node feedwatch.js read <name>
❌ Remove a feed
node feedwatch.js remove <name>
🧾 JSON output
node feedwatch.js run --json
🧪 Testing

Run all tests using:

bun test tests/feedwatch.test.js

✔ All tests passing (13/13)

🛠 Tech Stack

Node.js

Bun (for testing)

XML Parsing

File System (fs module)

📂 Project Structure
feedwatch/
├── commands/        # CLI command implementations
├── lib/             # Core logic (fetcher, parser, state)
├── tests/           # Unit & integration tests
├── .feedwatch/      # Local storage (feeds & state)
├── feedwatch.js     # Entry point
└── README.md
⚙️ Configuration

FeedWatch uses an environment variable for storage:

FEEDWATCH_STORE_DIR=./.feedwatch

If not set, it defaults to .feedwatch/.

💡 Notes

Handles invalid or unreachable feeds without crashing

Supports both RSS and Atom formats

Designed for reliability and clean CLI experience

👨‍💻 Author

Pathri Mahanthesh
