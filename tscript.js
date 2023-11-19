document.addEventListener('DOMContentLoaded', function () {
    // Initialize data
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let balance = 0;
    let income = 0;
    let expense = 0;
  
    // Get form and list elements
    const transactionForm = document.getElementById('transactionForm');
    const transactionList = document.getElementById('transactionList');
    const balanceElement = document.getElementById('balance');
    const incomeElement = document.getElementById('income');
    const expenseElement = document.getElementById('expense');
    const statusElement = document.getElementById('status');
  
    // Handle form submission
    transactionForm.addEventListener('submit', addTransaction);
  
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
        return transaction.type === 'income' ? total + transaction.amount : total - transaction.amount;
      }, 0);
  
      income = transactions.reduce(function (total, transaction) {
        return transaction.type === 'income' ? total + transaction.amount : total;
      }, 0);
  
      expense = transactions.reduce(function (total, transaction) {
        return transaction.type === 'expense' ? total + transaction.amount : total;
      }, 0);
  
      // Update HTML elements
      balanceElement.textContent = `₱${balance.toFixed(2)}`;
      incomeElement.textContent = `₱${income.toFixed(2)}`;
      expenseElement.textContent = `₱${expense.toFixed(2)}`;
    }
  
    function updateTotal() {
      const incomeTotal = transactions
        .filter((trx) => trx.type === "income")
        .reduce((total, trx) => total + trx.amount, 0);
  
      const expenseTotal = transactions
        .filter((trx) => trx.type === "expense")
        .reduce((total, trx) => total + trx.amount, 0);
  
      const balanceTotal = incomeTotal - expenseTotal;
  
      balanceElement.textContent = `₱${balanceTotal.toFixed(2)}`;
      incomeElement.textContent = `₱${incomeTotal.toFixed(2)}`;
      expenseElement.textContent = `₱${expenseTotal.toFixed(2)}`;
    }
  
    function renderList() {
      transactionList.innerHTML = "";
  
      statusElement.textContent = "";
      if (transactions.length === 0) {
        statusElement.textContent = "No transactions.";
        return;
      }
  
      transactions.forEach(({ id, name, amount, date, type }) => {
        const sign = type === "income" ? 1 : -1;
  
        const li = document.createElement("li");
  
        li.innerHTML = `
          <div class="name">
            <h4>${name}</h4>
            <p>${new Date(date).toLocaleDateString()}</p>
          </div>
  
          <div class="amount ${type}">
            <span>₱${(amount * sign).toFixed(2)}</span>
          </div>
        
          <div class="action">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        `;
  
        transactionList.appendChild(li);
      });
    }
  
    function deleteTransaction(id) {
      const index = transactions.findIndex((trx) => trx.id === id);
      transactions.splice(index, 1);
  
      updateTotal();
      saveTransactions();
      renderList();
    }
  
    function addTransaction(event) {
        event.preventDefault();
      
        // Get form values
        const typeCheckbox = document.getElementById('type');
        const transactionType = typeCheckbox.checked ? 'income' : 'expense'; // Updated line
        const name = document.getElementsByName('name')[0].value;
        const amount = parseFloat(document.getElementById('amount').value);
        const date = document.getElementById('date').value;
      
        // Validate amount
        if (isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount.');
          return;
        }
      
        transactions.push({
          id: transactions.length + 1,
          type: transactionType, // Updated line
          name: name,
          amount: amount,
          date: date,
        });
      
        // Update transaction list
        updateTransactionList();
      
        // Update balance, income, and expense
        updateBalance();
      
        // Clear form fields
        transactionForm.reset();
      
        // Save transactions to the server
        saveTransactionToServer(transactionType, name, amount, date);
      
        // Render the updated list
      }
      
  
    function saveTransactions() {
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
    function saveTransactionToServer(type, name, amount, date) {
        // Create a FormData object
        const formData = new FormData();
        formData.append('type', type);
        formData.append('name', name);
        formData.append('amount', amount);
        formData.append('date', date);
      
        // Use fetch to send a POST request to the server
        fetch('/submit', {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Transaction submission failed.');
            }
            return response.text();
          })
          .then((message) => {
            console.log(message);
          })
          .catch((error) => {
            console.error(error);
          });
      }
      
    // Initial rendering
    renderList();
    updateTotal();
  });
  