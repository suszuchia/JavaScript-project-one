document.addEventListener("DOMContentLoaded", () => {
  const incomes = [];
  const expenses = [];

  const renderList = (list, containerId, type) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    list.forEach((item) => {
      const div = document.createElement("div");
      div.className = "item";

      const text = document.createTextNode(
        `${item.name} - ${item.amount.toFixed(2)} PLN`
      );
      div.appendChild(text);

      const editButton = document.createElement("button");
      editButton.className = "edit";
      editButton.dataset.id = item.id;
      editButton.dataset.type = type;
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        openEditModal(item.id, type);
      });
      div.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.dataset.id = item.id;
      deleteButton.dataset.type = type;
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteItem(item.id, type);
      });
      div.appendChild(deleteButton);

      container.appendChild(div);
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

    if (!totalIncomeElement || !totalExpenseElement || !balanceMessageElement) {
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

  const showError = (message) => {
    const errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent = message;
    errorContainer.style.display = "block";
    setTimeout(() => {
      errorContainer.style.display = "none";
    }, 3000);
  };

  const validateAmount = (amount) => {
    const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
    return regex.test(amount) && parseFloat(amount) > 0.01;
  };

  const addIncome = (event) => {
    event.preventDefault();
    const name = event.target.incomeName.value;
    const amount = event.target.incomeAmount.value;
    if (!name || !amount) {
      showError("Please fill out both fields.");
      return;
    }
    if (!validateAmount(amount)) {
      showError(
        "Please enter a valid amount greater than 0.01 with up to two decimal places."
      );
      return;
    }
    const newIncome = { id: Date.now(), name, amount: parseFloat(amount) };
    incomes.push(newIncome);
    renderList(incomes, "incomeList", "income");
    updateTotals();
    event.target.reset();
  };

  const addExpense = (event) => {
    event.preventDefault();
    const name = event.target.expenseName.value;
    const amount = event.target.expenseAmount.value;
    if (!name || !amount) {
      showError("Please fill out both fields.");
      return;
    }
    if (!validateAmount(amount)) {
      showError(
        "Please enter a valid amount greater than 0.01 with up to two decimal places."
      );
      return;
    }
    const newExpense = { id: Date.now(), name, amount: parseFloat(amount) };
    expenses.push(newExpense);
    renderList(expenses, "expenseList", "expense");
    updateTotals();
    event.target.reset();
  };

  const deleteItem = (id, type) => {
    if (type === "income") {
      const index = incomes.findIndex((item) => item.id === id);
      if (index !== -1) {
        incomes.splice(index, 1);
        renderList(incomes, "incomeList", "income");
        updateTotals();
      }
    } else if (type === "expense") {
      const index = expenses.findIndex((item) => item.id === id);
      if (index !== -1) {
        expenses.splice(index, 1);
        renderList(expenses, "expenseList", "expense");
        updateTotals();
      }
    }
  };

  const openEditModal = (id, type) => {
    const item = (type === "income" ? incomes : expenses).find(
      (item) => item.id === id
    );
    if (item) {
      const modal = document.getElementById("editModal");
      const editForm = document.getElementById("editForm");
      editForm.editName.value = item.name;
      editForm.editAmount.value = item.amount;
      editForm.dataset.id = id;
      editForm.dataset.type = type;
      modal.style.display = "block";
    }
  };

  const closeEditModal = () => {
    const modal = document.getElementById("editModal");
    modal.style.display = "none";
  };

  document
    .getElementById("editModalClose")
    .addEventListener("click", closeEditModal);

  window.addEventListener("click", (event) => {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  const saveEdit = (event) => {
    event.preventDefault();
    const id = Number(event.target.dataset.id);
    const type = event.target.dataset.type;
    const newName = event.target.editName.value;
    const newAmount = parseFloat(event.target.editAmount.value);
    if (newName && !isNaN(newAmount)) {
      if (!validateAmount(newAmount)) {
        showError(
          "Please enter a valid amount greater than 0.01 with up to two decimal places."
        );
        return;
      }
      const item = (type === "income" ? incomes : expenses).find(
        (item) => item.id === id
      );
      if (item) {
        item.name = newName;
        item.amount = newAmount;
        renderList(
          type === "income" ? incomes : expenses,
          type === "income" ? "incomeList" : "expenseList",
          type
        );
        updateTotals();
        closeEditModal();
      }
    } else {
      showError("Invalid input. Please enter valid values.");
    }
  };

  document.getElementById("editForm").addEventListener("submit", saveEdit);

  document.getElementById("incomeForm").addEventListener("submit", addIncome);
  document.getElementById("expenseForm").addEventListener("submit", addExpense);

  renderList(incomes, "incomeList", "income");
  renderList(expenses, "expenseList", "expense");
  updateTotals();
});
