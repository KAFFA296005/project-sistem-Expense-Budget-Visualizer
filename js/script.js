// Ambil elemen
const form = document.getElementById("expense-form");
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("transaction-list");
const totalEl = document.getElementById("total");
const ctx = document.getElementById("expense-chart").getContext("2d");

// Load data dari localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Function buat update list
function updateList() {
  list.innerHTML = "";
  transactions.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = `${t.name} - ${t.amount} - ${t.category}`;
    
    // Delete button
    const del = document.createElement("button");
    del.textContent = "x";
    del.onclick = () => {
      transactions = transactions.filter((_, idx) => idx !== i);
      saveAndUpdate();
    };
    li.appendChild(del);
    list.appendChild(li);
  });

  // Update total
  const total = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  totalEl.textContent = total;

  // Update chart
  updateChart();
}

// Function buat save data
function saveAndUpdate() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateList();
}

// Event submit form
form.addEventListener("submit", e => {
  e.preventDefault();
  const t = {
    name: nameInput.value,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value
  };
  transactions.push(t);
  saveAndUpdate();
  form.reset();
});

// Chart.js
let chart;
function updateChart() {
  const categories = ["Food", "Transport", "Fun"];
  const data = categories.map(cat => {
    return transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0);
  });

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [{
        data,
        backgroundColor: ["#ff6384","#36a2eb","#ffcd56"]
      }]
    }
  });
}

// Init
updateList();