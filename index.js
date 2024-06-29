document.addEventListener("DOMContentLoaded", () => {
  const incomes = [];
  const expenses = [];

  const renderList = (list, containerId, type) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    list.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
              ${item.name} - ${item.amount.toFixed(2)} PLN
              <button class="edit" data-id="${
                item.id
              }" data-type="${type}">Edit</button>
              <button class="delete" data-id="${
                item.id
              }" data-type="${type}">Delete</button>
            `;
      container.appendChild(div);
    });

    container.querySelectorAll(".edit").forEach((button) => {
      button.addEventListener("click", () => {
        editItem(
          button.getAttribute("data-id"),
          button.getAttribute("data-type")
        );
      });
    });

    container.querySelectorAll(".delete").forEach((button) => {
      button.addEventListener("click", () => {
        deleteItem(
          button.getAttribute("data-id"),
          button.getAttribute("data-type")
        );
      });
    });
  };

  const calculateTotal = (list) =>
    list.reduce((sum, item) => sum + item.amount, 0);

  const updateTotals = () => {
    const totalIncome = calculateTotal(incomes);
    const totalExpense = calculateTotal(expenses);
    const remaining = totalIncome - totalExpense;

    const totalIncomeElement = document.getElementById("totalIncome");
    const totalExpenseElement = document.getElementById("totalExpense");
    const balanceMessageElement = document.getElementById("balanceMessage");
    const remainingElement = document.getElementById("remaining");

    if (
      !totalIncomeElement ||
      !totalExpenseElement ||
      !balanceMessageElement ||
      !remainingElement
    ) {
      console.error("One or more required elements are missing.");
      return;
    }

    totalIncomeElement.textContent = `${totalIncome.toFixed(2)} PLN`;
    totalExpenseElement.textContent = `${totalExpense.toFixed(2)} PLN`;

    if (remaining > 0) {
      balanceMessageElement.innerHTML = `You can still spend <span id="remaining">${remaining.toFixed(
        2
      )}</span> PLN`;
    } else if (remaining === 0) {
      balanceMessageElement.innerHTML = `Balance is zero. <span id="remaining">${remaining.toFixed(
        2
      )}</span>`;
    } else {
      balanceMessageElement.innerHTML = `The balance is negative. You are down <span id="remaining">${Math.abs(
        remaining
      ).toFixed(2)}</span> PLN`;
    }
  };

  const addIncome = (event) => {
    event.preventDefault();
    const name = event.target.incomeName.value;
    const amount = parseFloat(event.target.incomeAmount.value);
    if (name && !isNaN(amount)) {
      const newIncome = { id: Date.now(), name, amount };
      incomes.push(newIncome);
      renderList(incomes, "incomeList", "income");
      updateTotals();
      event.target.reset();
    } else {
      console.error("Invalid income input");
    }
  };

  const addExpense = (event) => {
    event.preventDefault();
    const name = event.target.expenseName.value;
    const amount = parseFloat(event.target.expenseAmount.value);
    if (name && !isNaN(amount)) {
      const newExpense = { id: Date.now(), name, amount };
      expenses.push(newExpense);
      renderList(expenses, "expenseList", "expense");
      updateTotals();
      event.target.reset();
    } else {
      console.error("Invalid expense input");
    }
  };

  const deleteItem = (id, type) => {
    if (type === "income") {
      const index = incomes.findIndex((item) => item.id == id);
      if (index !== -1) {
        incomes.splice(index, 1);
        renderList(incomes, "incomeList", "income");
        updateTotals();
      }
    } else if (type === "expense") {
      const index = expenses.findIndex((item) => item.id == id);
      if (index !== -1) {
        expenses.splice(index, 1);
        renderList(expenses, "expenseList", "expense");
        updateTotals();
      }
    }
  };

  const editItem = (id, type) => {
    const item = (type === "income" ? incomes : expenses).find(
      (item) => item.id == id
    );
    if (item) {
      const newName = prompt("Enter new name:", item.name);
      const newAmount = parseFloat(prompt("Enter new amount:", item.amount));
      if (newName && !isNaN(newAmount)) {
        item.name = newName;
        item.amount = newAmount;
        renderList(
          type === "income" ? incomes : expenses,
          type === "income" ? "incomeList" : "expenseList"
        );
        updateTotals();
      } else {
        console.error("Invalid input in modal");
      }
    }
  };

  document.getElementById("incomeForm").addEventListener("submit", addIncome);
  document.getElementById("expenseForm").addEventListener("submit", addExpense);

  renderList(incomes, "incomeList", "income");
  renderList(expenses, "expenseList", "expense");
  updateTotals();
});
