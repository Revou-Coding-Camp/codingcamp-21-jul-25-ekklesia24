const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const statusInput = document.getElementById("status-input");
const notesInput = document.getElementById("notes-input");
const todoList = document.getElementById("todo-list");

const filterDate = document.getElementById("filter-date");
const filterStatus = document.getElementById("filter-status");
const applyFilterBtn = document.getElementById("apply-filter");
const resetFilterBtn = document.getElementById("reset-filter");

const deleteSelectedBtn = document.getElementById("delete-selected-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");

let todos = [];

window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
    renderTodos(todos);
  }
});

todoForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const todo = {
    id: Date.now(),
    task: todoInput.value.trim(),
    date: dateInput.value,
    status: statusInput.value,
    note: notesInput.value.trim()
  };

  if (!todo.task || !todo.date || !todo.status) {
    alert("Please complete the required fields.");
    return;
  }

  todos.push(todo);
  updateLocalStorage();
  renderTodos(todos);
  todoForm.reset();
});

function renderTodos(data) {
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  todoList.innerHTML = "";

  if (sorted.length === 0) {
    todoList.innerHTML = `<tr><td colspan="5">No task found</td></tr>`;
    return;
  }

  sorted.forEach(todo => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" data-id="${todo.id}" class="check-task"/></td>
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>
        <select class="status-select" data-id="${todo.id}">
          <option value="Not Done Yet" ${todo.status === "Not Done Yet" ? "selected" : ""}>Not Done Yet</option>
          <option value="In Progress" ${todo.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Done" ${todo.status === "Done" ? "selected" : ""}>Done</option>
        </select>
      </td>
      <td><input type="text" class="note-edit" value="${todo.note}" data-id="${todo.id}"/></td>
    `;
    todoList.appendChild(row);
  });

  document.querySelectorAll(".status-select").forEach(select => {
    select.addEventListener("change", function () {
      const todo = todos.find(t => t.id == this.dataset.id);
      if (todo) {
        todo.status = this.value;
        updateLocalStorage();
      }
    });
  });

  document.querySelectorAll(".note-edit").forEach(input => {
    input.addEventListener("input", function () {
      const todo = todos.find(t => t.id == this.dataset.id);
      if (todo) {
        todo.note = this.value;
        updateLocalStorage();
      }
    });
  });
}

applyFilterBtn.addEventListener("click", () => {
  let filtered = [...todos];

  if (filterDate.value) {
    filtered = filtered.filter(todo => todo.date === filterDate.value);
  }

  if (filterStatus.value) {
    filtered = filtered.filter(todo => todo.status === filterStatus.value);
  }

  renderTodos(filtered);
});

resetFilterBtn.addEventListener("click", () => {
  filterDate.value = "";
  filterStatus.value = "";
  renderTodos(todos);
});

deleteSelectedBtn.addEventListener("click", () => {
  const selected = document.querySelectorAll(".check-task:checked");
  const ids = Array.from(selected).map(cb => parseInt(cb.dataset.id));
  todos = todos.filter(todo => !ids.includes(todo.id));
  updateLocalStorage();
  renderTodos(todos);
});

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos.length = 0;
    updateLocalStorage();
    renderTodos(todos);
  }
});

function updateLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
