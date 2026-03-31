# WRITEUP.md (Task 2 - Kanban Board)

## Architecture Decisions

The application is designed using a clear separation of concerns across three main modules: state management (`state.js`), rendering (`board.js`), and event handling (`events.js`). This structure ensures maintainability and scalability while keeping responsibilities well-defined.

The `state.js` module acts as a single source of truth. All state mutations are encapsulated within dedicated functions, ensuring that no other part of the application directly modifies the state. This approach simplifies debugging and guarantees consistency. Additionally, state persistence is handled centrally by automatically syncing with `localStorage` after every mutation.

The rendering layer (`board.js`) follows a full re-render strategy. Instead of updating parts of the DOM incrementally, the entire board is rebuilt on every state change. While this may not be the most optimized approach for large-scale applications, it significantly reduces complexity and avoids UI inconsistencies, which is ideal for this scope.

Event handling is implemented using event delegation in `events.js`, attaching a single listener to the board container. This avoids multiple event bindings, improves performance, and ensures compatibility with dynamically created elements. Inline forms are used for adding and editing cards, keeping user interaction smooth and contextual.

## Challenge Faced

One of the more challenging aspects was implementing inline forms for adding and editing cards while ensuring that only one form is active at a time. Managing this required careful handling of DOM replacement and restoration without breaking the event flow.

The issue was resolved by introducing a `closeOpenForms()` helper function that re-renders the board whenever a new form is opened. This guarantees a clean UI state and prevents multiple forms from conflicting with each other.

Another subtle challenge was ensuring that filtering works correctly without modifying the underlying state. This was addressed by applying filtering directly on the DOM and reapplying it after every render, maintaining a clear separation between UI behavior and data integrity.

## Improvements with More Time

With more time, several enhancements could be implemented. First, the UI could be significantly improved with better styling and responsive design to enhance user experience. Drag-and-drop functionality for moving cards would also provide a more intuitive interaction compared to button-based movement.

From a performance perspective, the rendering logic could be optimized to use partial updates instead of full re-renders. Additionally, implementing unique ID generation using a more robust approach (such as UUIDs) would improve reliability.

Finally, features like persistence of the search filter, column reordering, and keyboard accessibility could further enhance usability and make the application more production-ready.