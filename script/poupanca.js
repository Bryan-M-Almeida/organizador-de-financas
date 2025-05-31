
const budgetForm = document.getElementById('budget-form');
const goalNameInput = document.getElementById('goal-name');
const goalTargetInput = document.getElementById('goal-target');
const budgetItemsElem = document.getElementById('budget-items');

let budgetGoals = []; 

const savedGoals = localStorage.getItem('budgetGoals');

if (savedGoals) {
    budgetGoals = JSON.parse(savedGoals);
}

function saveGoalsToLocalStorage() {
    localStorage.setItem('budgetGoals', JSON.stringify(budgetGoals));
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderbudget() {
    budgetItemsElem.innerHTML = '';

    budgetGoals.forEach((goal, index) => {
        const tr = document.createElement('tr');

        // Goal name
        const tdName = document.createElement('td');
        tdName.textContent = goal.name;

        // Saved amount
        const tdSaved = document.createElement('td');
        tdSaved.textContent = formatCurrency(goal.saved);
        tdSaved.classList.add('amount');

        // Progress bar cell
        const tdProgress = document.createElement('td');
        // calculate percent progress but cap at 100%
        let progressPercent = 0;
        if (goal.target > 0) {
            progressPercent = Math.min((goal.saved / goal.target) * 100, 100);
        }
        // create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = progressPercent + '%';
        progressBar.appendChild(progressFill);
        tdProgress.appendChild(progressBar);
        // progress text
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        const remaining = Math.max(goal.target - goal.saved, 0);
        progressText.textContent = `Faltam ${formatCurrency(remaining)} (${progressPercent.toFixed(1)}%)`;
        tdProgress.appendChild(progressText);

        // Add increment input and button
        const tdAddValue = document.createElement('td');
        const inputIncrement = document.createElement('input');
        inputIncrement.type = 'number';
        inputIncrement.min = '0.01';
        inputIncrement.step = '0.01';
        inputIncrement.placeholder = 'R$';
        inputIncrement.className = 'increment-input';
        inputIncrement.title = 'Valor para adicionar';
        tdAddValue.appendChild(inputIncrement);

        const btnIncrement = document.createElement('button');
        btnIncrement.textContent = '+';
        btnIncrement.className = 'increment-btn';
        btnIncrement.title = 'Adicionar valor';
        btnIncrement.type = 'button';
        btnIncrement.onclick = () => {
            const val = parseFloat(inputIncrement.value);
            if (!isNaN(val) && val > 0) {
                goal.saved += val;
                inputIncrement.value = '';
                saveGoalsToLocalStorage();
                renderbudget();
            } else {
                alert('Por favor, insira um valor válido para adicionar.');
            }
        };
        tdAddValue.appendChild(btnIncrement);

        // Actions (Edit, Delete)
        const tdActions = document.createElement('td');
        tdActions.classList.add('actions');

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Editar';
        editBtn.type = 'button';
        editBtn.onclick = () => editGoal(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Excluir';
        deleteBtn.type = 'button';
        deleteBtn.onclick = () => deleteGoal(index);

        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);

        tr.appendChild(tdName);
        tr.appendChild(tdSaved);
        tr.appendChild(tdProgress);
        tr.appendChild(tdAddValue);
        tr.appendChild(tdActions);

        budgetItemsElem.appendChild(tr);
    });
}

function clearForm() {
    goalNameInput.value = '';
    goalTargetInput.value = '';
    delete budgetForm.dataset.editIndex;
    budgetForm.querySelector('button').textContent = 'Adicionar';
}

function editGoal(index) {
    const goal = budgetGoals[index];
    goalNameInput.value = goal.name;
    goalTargetInput.value = goal.target.toFixed(2);
    budgetForm.dataset.editIndex = index;
    budgetForm.querySelector('button').textContent = 'Salvar';
}

function deleteGoal(index) {
    if (confirm('Tem certeza que deseja excluir esta poupança?')) {
        budgetGoals.splice(index, 1);
        saveGoalsToLocalStorage();
        renderbudget();
        clearForm();
    }
}

budgetForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = goalNameInput.value.trim();
    const target = parseFloat(goalTargetInput.value);

    if (!name || isNaN(target) || target <= 0) {
        alert('Por favor, preencha os campos corretamente!');
        return;
    }

    if (budgetForm.dataset.editIndex !== undefined) {
        // Edit mode
        const idx = parseInt(budgetForm.dataset.editIndex);
        budgetGoals[idx].name = name;
        budgetGoals[idx].target = target;
    } else {
        // Add new goal
        budgetGoals.push({ name, target, saved: 0 });
    }
    clearForm();
    saveGoalsToLocalStorage();
    renderbudget();
});

// Initial render
renderbudget();