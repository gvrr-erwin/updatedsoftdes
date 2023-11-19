// script.js

document.addEventListener('DOMContentLoaded', function () {
  // Initialize data
  let transactions = [];
  let balance = 0;
  let income = 0;
  let expense = 0;

  // Get form and list elements
  const transactionForm = document.getElementById('transactionForm');
  const transactionList = document.getElementById('transactionList');
  const balanceElement = document.getElementById('balance');
  const incomeElement = document.getElementById('income');
  const expenseElement = document.getElementById('expense');

  // Handle form submission
  transactionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const typeCheckbox = document.getElementById('type');
    const transactionType = typeCheckbox.checked ? 'Income' : 'Expense';
    const name = document.getElementsByName('name')[0].value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    // Create transaction object
    const transaction = {
      type: transactionType,
      name: name,
      amount: amount,
      date: date,
    };

    // Update transactions array
    transactions.push(transaction);

    // Update transaction list
    updateTransactionList();

    // Update balance, income, and expense
    updateBalance();

    // Clear form fields
    transactionForm.reset();
  });

  // Function to update the transaction list
  function updateTransactionList() {
    const listItems = transactions.map(function (transaction) {
      return `<li>${transaction.type} - ${transaction.name} - ₱${transaction.amount.toFixed(2)} - ${transaction.date}</li>`;
    });

    transactionList.innerHTML = listItems.join('');
  }

  // Function to update balance, income, and expense
  function updateBalance() {
    balance = transactions.reduce(function (total, transaction) {
      return transaction.type === 'Income' ? total + transaction.amount : total - transaction.amount;
    }, 0);

    income = transactions.reduce(function (total, transaction) {
      return transaction.type === 'Income' ? total + transaction.amount : total;
    }, 0);

    expense = transactions.reduce(function (total, transaction) {
      return transaction.type === 'Expense' ? total + transaction.amount : total;
    }, 0);

    // Update HTML elements
    balanceElement.textContent = `₱${balance.toFixed(2)}`;
    incomeElement.textContent = `₱${income.toFixed(2)}`;
    expenseElement.textContent = `₱${expense.toFixed(2)}`;
  }
});
