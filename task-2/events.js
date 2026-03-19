import {
  addColumn,
  removeColumn,   
  renameColumn,
  addCard,
  updateCard,
  removeCard,
  moveCard,
  getState        
} from './state.js';
import { renderBoard } from './board.js';


function getColumnId(el) {
  return el.closest('.column')?.dataset.id;
}

function closeOpenForms() {
  const existingForm = document.querySelector('.inline-form');
  if (existingForm) {
    renderBoard(); 
  }
}

function openAddCardForm(columnEl) {
  closeOpenForms();

  const footer = columnEl.querySelector('.column-footer');

  const form = document.createElement('div');
  form.className = 'inline-form';

  const titleInput = document.createElement('input');
  titleInput.placeholder = 'Card title';

  const descInput = document.createElement('textarea');
  descInput.placeholder = 'Description';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';

  const error = document.createElement('div');
  error.style.color = 'red';

  form.append(titleInput, descInput, saveBtn, cancelBtn, error);

  footer.innerHTML = '';
  footer.appendChild(form);

  // Save logic
  saveBtn.onclick = () => {
    const title = titleInput.value.trim();
    const desc = descInput.value;

    if (!title) {
      error.textContent = 'Title cannot be empty';
      return;
    }

    const columnId = columnEl.dataset.id;

    addCard(columnId, title, desc);
    renderBoard();
  };

  // Cancel logic
  cancelBtn.onclick = () => {
    renderBoard();
  };
}

function openEditCardForm(cardEl) {
  closeOpenForms();

  const titleEl = cardEl.querySelector('.card-title');
  const descEl = cardEl.querySelector('.card-desc');

  const currentTitle = titleEl.textContent;
  const currentDesc = descEl.textContent;

  const form = document.createElement('div');
  form.className = 'inline-form';

  const titleInput = document.createElement('input');
  titleInput.value = currentTitle;

  const descInput = document.createElement('textarea');
  descInput.value = currentDesc;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';

  const error = document.createElement('div');
  error.style.color = 'red';

  form.append(titleInput, descInput, saveBtn, cancelBtn, error);

  cardEl.innerHTML = '';
  cardEl.appendChild(form);

  const cardId = cardEl.dataset.id;

  // Save
  saveBtn.onclick = () => {
    const title = titleInput.value.trim();
    const desc = descInput.value;

    if (!title) {
      error.textContent = 'Title cannot be empty';
      return;
    }

    updateCard(cardId, title, desc);
    renderBoard();
  };

  // Cancel
  cancelBtn.onclick = () => {
    renderBoard();
  };
}

export function applyFilter() {
  const query = document.getElementById('search').value.toLowerCase();
  const columns = document.querySelectorAll('.column');

  columns.forEach(col => {
    const cards = col.querySelectorAll('.card');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();

      if (title.includes(query)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    if (visibleCount === 0 && cards.length > 0) {
      col.style.opacity = '0.4';
    } else {
      col.style.opacity = '1';
    }
  });
}

export function initEvents() {
  const board = document.getElementById('board');

 board.addEventListener('click', (e) => {
  if (e.target.id === 'add-column-btn') {
    const title = prompt('Enter column title');

    if (!title) return;

    try {
      addColumn(title);
      renderBoard();
    } catch (err) {
      alert(err.message);
    }
  }

 if (e.target.classList.contains('rename-btn')) {
  const columnId = getColumnId(e.target);

  const newTitle = prompt('Enter new column title');

  if (newTitle === null) return; // user clicked cancel

  try {
    renameColumn(columnId, newTitle);
    renderBoard();
  } catch (err) {
    alert(err.message);
  }
}

if (e.target.classList.contains('delete-col-btn')) {
  const columnId = getColumnId(e.target);

  const { columns } = getState();
  const column = columns.find(col => col.id === columnId);

  if (!column) return;

  if (column.cards.length > 0) {
    const confirmed = confirm('This column has cards. Delete anyway?');
    if (!confirmed) return;
  }

  removeColumn(columnId);
  renderBoard();
}

if (e.target.classList.contains('delete-btn')) {
  const cardEl = e.target.closest('.card');
  const cardId = cardEl.dataset.id;

  const confirmed = confirm('Delete this card?');
  if (!confirmed) return;

  removeCard(cardId);
  renderBoard();
}

if (e.target.classList.contains('add-card-btn')) {
  const columnEl = e.target.closest('.column');
  openAddCardForm(columnEl);
}

if (e.target.classList.contains('edit-btn')) {
  const cardEl = e.target.closest('.card');
  openEditCardForm(cardEl);
}

if (e.target.classList.contains('move-left')) {
  const cardEl = e.target.closest('.card');
  const cardId = cardEl.dataset.id;

  moveCard(cardId, 'left');
  renderBoard();
}

if (e.target.classList.contains('move-right')) {
  const cardEl = e.target.closest('.card');
  const cardId = cardEl.dataset.id;

  moveCard(cardId, 'right');
  renderBoard();
}

});

document.getElementById('search')
  .addEventListener('input', applyFilter);
}
