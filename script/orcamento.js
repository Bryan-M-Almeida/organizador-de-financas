
const form = document.getElementById('budget-form');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const budgetItemsElem = document.getElementById('budget-items');
const totalAmountElem = document.getElementById('total-amount');

let budgetItems = [];

const storedItems = localStorage.getItem('budgetItems');

if (storedItems) {
    budgetItems = JSON.parse(storedItems);
}

function saveToLocalStorage() {
    localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
}
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function updateTotal() {
    const total = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    totalAmountElem.textContent = `Total: ${formatCurrency(total)}`;
}

function renderItems() {
    budgetItemsElem.innerHTML = '';
    budgetItems.forEach((item, index) => {
        const tr = document.createElement('tr');

        const tdCategory = document.createElement('td');
        tdCategory.textContent = item.category;

        const tdAmount = document.createElement('td');
        tdAmount.textContent = formatCurrency(item.amount);
        tdAmount.classList.add('amount');

        const tdActions = document.createElement('td');
        tdActions.classList.add('actions');

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Editar';
        editBtn.type = 'button';
        editBtn.onclick = () => editItem(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Excluir';
        deleteBtn.type = 'button';
        deleteBtn.onclick = () => deleteItem(index);

        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);

        tr.appendChild(tdCategory);
        tr.appendChild(tdAmount);
        tr.appendChild(tdActions);

        budgetItemsElem.appendChild(tr);
    });

    updateTotal();
}

function editItem(index) {
    const item = budgetItems[index];
    categoryInput.value = item.category;
    amountInput.value = item.amount.toFixed(2);
    form.dataset.editIndex = index;
    form.querySelector('button').textContent = 'Salvar';
}

function deleteItem(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        budgetItems.splice(index, 1);
        saveToLocalStorage();
        renderItems();
        clearForm();
    }
}

function clearForm() {
    categoryInput.value = '';
    amountInput.value = '';
    delete form.dataset.editIndex;
    form.querySelector('button').textContent = 'Adicionar';
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const category = categoryInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!category || isNaN(amount) || amount < 0) {
        alert('Por favor, preencha campos válidos.');
        return;
    }

    if (form.dataset.editIndex !== undefined) {
        // Edit mode
        budgetItems[form.dataset.editIndex] = { category, amount };
        clearForm();
    } else {
        // Add mode
        budgetItems.push({ category, amount });
    }
    saveToLocalStorage();
    renderItems();
});

// Initial render

renderItems();