let incomes = [
  { id: 1, name: "Salary", amount: 3000 },
  { id: 2, name: "Sales on Allegro", amount: 500 },
  { id: 3, name: "Freelance", amount: 2000 },
];

let expenses = [
  { id: 1, name: "Bills", amount: 2000 },
  { id: 2, name: "Leasing", amount: 2000 },
  { id: 3, name: "Other", amount: 513 },
];

const renderList = (list, containerId, type) => {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  list.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
        ${item.name} - ${item.amount} PLN
        <button onclick="editItem(${item.id}, '${type}')">Edit</button>
        <button onclick="deleteItem(${item.id}, '${type}')">Delete</button>
      `;
    container.appendChild(div);
  });
};

const calculateTotal = (list) => {
  return list.reduce((sum, item) => sum + item.amount, 0);
};

const updateTotals = () => {
  const totalIncome = calculateTotal(incomes);
  const totalExpense = calculateTotal(expenses);
  const remaining = totalIncome - totalExpense;

  document.getElementById("totalIncome").innerText = totalIncome;
  document.getElementById("totalExpense").innerText = totalExpense;

  const balanceMessage = document.getElementById("balanceMessage");
  if (remaining > 0) {
    balanceMessage.innerText = `You can still spend PLN ${remaining}`;
  } else if (remaining === 0) {
    balanceMessage.innerText = "Balance is zero.";
  } else {
    balanceMessage.innerText = `The balance is negative. You are down PLN ${Math.abs(
      remaining
    )}.`;
  }

  document.getElementById("remaining").innerText = remaining;
};

const addIncome = () => {
  const name = document.getElementById("incomeName").value;
  const amount = parseInt(document.getElementById("incomeAmount").value);
  if (name && amount) {
    incomes.push({ id: Date.now(), name, amount });
    renderList(incomes, "incomeList", "income");
    updateTotals();
  }
};

const addExpense = () => {
  const name = document.getElementById("expenseName").value;
  const amount = parseInt(document.getElementById("expenseAmount").value);
  if (name && amount) {
    expenses.push({ id: Date.now(), name, amount });
    renderList(expenses, "expenseList", "expense");
    updateTotals();
  }
};

const deleteItem = (id, type) => {
  if (type === "income") {
    incomes = incomes.filter((item) => item.id !== id);
    renderList(incomes, "incomeList", "income");
  } else if (type === "expense") {
    expenses = expenses.filter((item) => item.id !== id);
    renderList(expenses, "expenseList", "expense");
  }
  updateTotals();
};

const editItem = (id, type) => {
  const name = prompt("Enter new name:");
  const amount = prompt("Enter new amount:");

  if (name && amount) {
    if (type === "income") {
      incomes = incomes.map((item) =>
        item.id === id ? { ...item, name, amount: parseInt(amount) } : item
      );
      renderList(incomes, "incomeList", "income");
    } else if (type === "expense") {
      expenses = expenses.map((item) =>
        item.id === id ? { ...item, name, amount: parseInt(amount) } : item
      );
      renderList(expenses, "expenseList", "expense");
    }
    updateTotals();
  }
};

// Initial render
renderList(incomes, "incomeList", "income");
renderList(expenses, "expenseList", "expense");
updateTotals();
