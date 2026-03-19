const STORAGE_KEY = 'kanban-state';

const DEFAULT_STATE = {
  columns: [
    { id: 'col-1', title: 'To Do', cards: [] },
    { id: 'col-2', title: 'In Progress', cards: [] },
    { id: 'col-3', title: 'Done', cards: [] },
  ]
};

let state = { columns: [] };

// Load state
export function loadState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      state = DEFAULT_STATE;
    } else {
      state = JSON.parse(data);
    }
  } catch (e) {
    state = DEFAULT_STATE;
  }
  return state;
}

// Save state
export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getState() {
  return state;
}

// Add column
export function addColumn(title) {
  if (!title) throw new Error('Column title cannot be empty');

  state.columns.push({
    id: 'col-' + Date.now(),
    title,
    cards: []
  });

  saveState();
}

// Remove column
export function removeColumn(id) {
  state.columns = state.columns.filter(col => col.id !== id);
  saveState();
}

// Rename column
export function renameColumn(id, newTitle) {
  if (!newTitle) throw new Error('Column title cannot be empty');

  const col = state.columns.find(c => c.id === id);
  if (col) {
    col.title = newTitle;
    saveState();
  }
}

// Add card
export function addCard(columnId, title, description = '') {
  if (!title) throw new Error('Card title cannot be empty');

  const col = state.columns.find(c => c.id === columnId);
  if (col) {
    col.cards.push({
      id: 'card-' + Date.now(),
      title,
      description
    });
    saveState();
  }
}

// Update card
export function updateCard(cardId, title, description) {
  if (!title) throw new Error('Card title cannot be empty');

  for (let col of state.columns) {
    const card = col.cards.find(c => c.id === cardId);
    if (card) {
      card.title = title;
      card.description = description;
      saveState();
      return;
    }
  }
}

// Remove card
export function removeCard(cardId) {
  for (let col of state.columns) {
    col.cards = col.cards.filter(c => c.id !== cardId);
  }
  saveState();
}

// Move card
export function moveCard(cardId, direction) {
  let currentColIndex = -1;
  let cardToMove = null;

  // Find card and column index
  state.columns.forEach((col, index) => {
    const found = col.cards.find(c => c.id === cardId);
    if (found) {
      currentColIndex = index;
      cardToMove = found;
      col.cards = col.cards.filter(c => c.id !== cardId);
    }
  });

  if (!cardToMove) return;

  let targetIndex =
    direction === 'left'
      ? currentColIndex - 1
      : currentColIndex + 1;

  // Boundary check
  if (targetIndex < 0 || targetIndex >= state.columns.length) {
    // put back in original column
    state.columns[currentColIndex].cards.push(cardToMove);
    return;
  }

  state.columns[targetIndex].cards.push(cardToMove);
  saveState();
}

