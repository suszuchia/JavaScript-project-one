document.addEventListener("DOMContentLoaded", () => {
  let incomes = [];
  let expenses = [];

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
    console.log("Updating totals...");
    const totalIncome = calculateTotal(incomes);
    const totalExpense = calculateTotal(expenses);
    const remaining = totalIncome - totalExpense;

    console.log("Total Income:", totalIncome);
    console.log("Total Expense:", totalExpense);

    const totalIncomeElement = document.getElementById("totalIncome");
    const totalExpenseElement = document.getElementById("totalExpense");
    const balanceMessageElement = document.getElementById("balanceMessage");
    const remainingElement = document.getElementById("remaining");

    console.log("totalIncomeElement:", totalIncomeElement);
    console.log("totalExpenseElement:", totalExpenseElement);
    console.log("balanceMessageElement:", balanceMessageElement);
    console.log("remainingElement:", remainingElement);

    if (
      !totalIncomeElement ||
      !totalExpenseElement ||
      !balanceMessageElement ||
      !remainingElement
    ) {
      console.error("One or more required elements are missing.");
      return;
    }

    totalIncomeElement.innerText = totalIncome;
    totalExpenseElement.innerText = totalExpense;

    if (remaining > 0) {
      balanceMessageElement.innerHTML = `You can still spend <span id="remaining">${remaining}</span> PLN`;
    } else if (remaining === 0) {
      balanceMessageElement.innerHTML =
        'Balance is zero. <span id="remaining">${remaining}</span>';
    } else {
      balanceMessageElement.innerHTML = `The balance is negative. You are down <span id="remaining">${Math.abs(
        remaining
      )}</span> PLN`;
    }
  };

  const addIncome = (event) => {
    event.preventDefault(); // Prevent the form from submitting
    const name = document.getElementById("incomeName").value;
    const amount = parseInt(document.getElementById("incomeAmount").value);
    console.log(`Adding Income: ${name}, Amount: ${amount}`);
    if (name && !isNaN(amount)) {
      const newIncome = { id: Date.now(), name, amount };
      incomes.push(newIncome);
      console.log("New income added:", newIncome);
      console.log("Incomes array after adding:", incomes);
      renderList(incomes, "incomeList", "income");
      updateTotals();
      document.getElementById("incomeName").value = "";
      document.getElementById("incomeAmount").value = "";
    } else {
      console.error("Invalid income input");
    }
  };

  const addExpense = (event) => {
    event.preventDefault(); // Prevent the form from submitting
    const name = document.getElementById("expenseName").value;
    const amount = parseInt(document.getElementById("expenseAmount").value);
    console.log(`Adding Expense: ${name}, Amount: ${amount}`);
    if (name && !isNaN(amount)) {
      const newExpense = { id: Date.now(), name, amount };
      expenses.push(newExpense);
      console.log("New expense added:", newExpense);
      console.log("Expenses array after adding:", expenses);
      renderList(expenses, "expenseList", "expense");
      updateTotals();
      document.getElementById("expenseName").value = "";
      document.getElementById("expenseAmount").value = "";
    } else {
      console.error("Invalid expense input");
    }
  };

  window.deleteItem = (id, type) => {
    if (type === "income") {
      incomes = incomes.filter((item) => item.id !== id);
      renderList(incomes, "incomeList", "income");
    } else if (type === "expense") {
      expenses = expenses.filter((item) => item.id !== id);
      renderList(expenses, "expenseList", "expense");
    }
    updateTotals();
  };

  window.editItem = (id, type) => {
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

  document.getElementById("incomeForm").addEventListener("submit", addIncome);
  document.getElementById("expenseForm").addEventListener("submit", addExpense);

  renderList(incomes, "incomeList", "income");
  renderList(expenses, "expenseList", "expense");
  updateTotals();
});
