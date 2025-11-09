const form = document.getElementById('entry-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const resetBtn = document.getElementById('reset-btn');
const entriesList = document.getElementById('entries');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const netBalanceEl = document.getElementById('net-balance');
const filterRadios = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editId = null;

function updateLocalStorage() {
  localStorage.setItem('entries', JSON.stringify(entries));
}

function renderEntries() {
  const filter = document.querySelector('input[name="filter"]:checked').value;
  entriesList.innerHTML = '';

  const filtered = entries.filter(e => filter === 'all' || e.type === filter);

  filtered.forEach(entry => {
    const li = document.createElement('li');
    li.className = `entry ${entry.type}`;
    li.innerHTML = `
      <span>${entry.description} - ₹${entry.amount}</span>
      <span>
        <button onclick="editEntry(${entry.id})">✏️</button>
        <button onclick="deleteEntry(${entry.id})">🗑️</button>
      </span>
    `;
    entriesList.appendChild(li);
  });

  calculateTotals();
}

function calculateTotals() {
  const income = entries
    .filter(e => e.type === 'income')
    .reduce((acc, e) => acc + e.amount, 0);
  const expense = entries
    .filter(e => e.type === 'expense')
    .reduce((acc, e) => acc + e.amount, 0);

  totalIncomeEl.textContent = `₹${income}`;
  totalExpenseEl.textContent = `₹${expense}`;
  netBalanceEl.textContent = `₹${income - expense}`;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  if (!description || !amount || amount <= 0) return alert('Enter valid details');

  if (editId !== null) {
    const entry = entries.find(e => e.id === editId);
    entry.description = description;
    entry.amount = amount;
    entry.type = type;
    editId = null;
  } else {
    entries.push({ id: Date.now(), description, amount, type });
  }

  updateLocalStorage();
  renderEntries();
  form.reset();
});

resetBtn.addEventListener('click', () => form.reset());

function editEntry(id) {
  const entry = entries.find(e => e.id === id);
  descInput.value = entry.description;
  amountInput.value = entry.amount;
  typeInput.value = entry.type;
  editId = id;
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  updateLocalStorage();
  renderEntries();
}

filterRadios.forEach(radio => radio.addEventListener('change', renderEntries));

renderEntries();
