import { applyFilter } from './events.js';
import { getState } from './state.js';


function createColumn(column, isFirst, isLast) {
  const colDiv = document.createElement('div');
  colDiv.className = 'column';
  colDiv.dataset.id = column.id;

  // Header
  const header = document.createElement('div');
  header.className = 'column-header';

  const title = document.createElement('h2');
  title.textContent = column.title;

  const renameBtn = document.createElement('button');
  renameBtn.className = 'rename-btn';
  renameBtn.textContent = 'Rename Column ✏';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-col-btn';
  deleteBtn.textContent = 'Delete Column ✕';

  header.append(title, renameBtn, deleteBtn);

  // Card list
  const cardList = document.createElement('div');
  cardList.className = 'card-list';

  // Cards
  if (column.cards.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-placeholder';
    empty.textContent = 'No cards yet';
    cardList.appendChild(empty);
  } else {
    column.cards.forEach(card => {
      const cardEl = createCard(card, isFirst, isLast);
      cardList.appendChild(cardEl);
    });
  }

  // Footer
  const footer = document.createElement('div');
  footer.className = 'column-footer';

  const addCardBtn = document.createElement('button');
  addCardBtn.className = 'add-card-btn';
  addCardBtn.textContent = 'Add card';

  footer.appendChild(addCardBtn);

  colDiv.append(header, cardList, footer);

  return colDiv;
}

function createCard(card, isFirst, isLast) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  cardDiv.dataset.id = card.id;

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = card.title;

  const desc = document.createElement('div');
  desc.className = 'card-desc';
  desc.textContent = card.description;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit card';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete card';

  const leftBtn = document.createElement('button');
  leftBtn.className = 'move-left';
  leftBtn.textContent = 'move left ←';
  if (isFirst) leftBtn.disabled = true;

  const rightBtn = document.createElement('button');
  rightBtn.className = 'move-right';
  rightBtn.textContent = 'move right →';
  if (isLast) rightBtn.disabled = true;

  actions.append(editBtn, deleteBtn, leftBtn, rightBtn);

  cardDiv.append(title, desc, actions);

  return cardDiv;
}

export function renderBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  const { columns } = getState();

  columns.forEach((col, index) => {
  const columnEl = createColumn(
    col,
    index === 0,
    index === columns.length - 1
  );

  board.appendChild(columnEl);
  applyFilter();
});

const addColBtn = document.createElement('button');
addColBtn.id = 'add-column-btn';
addColBtn.textContent = 'Add column';

board.appendChild(addColBtn);
}