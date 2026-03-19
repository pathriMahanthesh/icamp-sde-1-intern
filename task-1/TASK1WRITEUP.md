# WRITEUP – Task 1 (FeedWatch CLI)

## Overview

In Task 1, I built a command-line tool called FeedWatch that allows users to track updates from multiple RSS/Atom feeds. The tool enables users to add, list, remove, and read feeds, and most importantly, run a command that fetches updates from all feeds and displays only new articles. The system also stores previously seen items to avoid repetition and ensures a smooth user experience with proper error handling and testing.

---

## Architecture Decisions

One of the key architectural decisions was to design the application as a modular CLI tool. I separated responsibilities into different layers: command handlers (for CLI operations), core logic modules (fetcher, parser, state management), and storage (file-based JSON). This separation made the code more organized, easier to debug, and scalable for future improvements.

For data fetching, I used HTTP requests to retrieve RSS/Atom feeds, which return XML data. Instead of relying on heavy external libraries, I implemented a custom parser to extract relevant fields like title, link, publication date, and unique identifiers. This gave me better control over how data is processed.

For persistence, I chose file-based storage using JSON files instead of a database. Since the application is lightweight and runs locally, this approach keeps it simple while still maintaining state across runs. I also introduced an environment variable (`FEEDWATCH_STORE_DIR`) to allow flexible storage configuration, which improves portability and testability.

The core “run” command was designed to fetch all feeds, parse them, and compare them with previously stored state. By storing unique identifiers (GUIDs), I could efficiently determine whether an article is new or already seen.

---

## Challenge Faced

One challenge that was harder than expected was handling the test environment correctly, especially for the “run” command. Initially, the application was reading feeds from a fixed file path, which caused issues during testing because the tests used a temporary directory. This resulted in incorrect outputs and failing test cases.

To resolve this, I updated the logic to dynamically read from the directory specified by the `FEEDWATCH_STORE_DIR` environment variable. I also ensured that only valid feed files were processed by filtering out unrelated files like `state.json`. This change aligned the application with the test setup and resolved the failing integration test related to network errors.

---

## Improvements with More Time

With more time, I would improve the project in several ways. First, I would enhance the parser to handle more edge cases and support a wider variety of RSS/Atom formats more robustly. Second, I would introduce better logging and user-friendly error messages to improve the CLI experience.

I would also consider adding features like pagination, filtering by date, or keyword-based search to make the tool more powerful. Another improvement would be to replace file-based storage with a lightweight database for better scalability. Finally, I would optimize performance by introducing parallel fetching of feeds instead of processing them sequentially.

---
