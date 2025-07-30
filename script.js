const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const dueDateInput = document.getElementById("dueDateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-buttons button");

let currentFilter = "all";


// Load tasks from localStorage
window.onload = function () {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToDOM);
};

// Search filter
searchInput.addEventListener("input", applyFilters);

// Filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-buttons .active")?.classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilters();
  });
});


// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed"),
      category: li.getAttribute("data-category"),
      dueDate: li.getAttribute("data-due")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task to DOM
function addTaskToDOM(taskObj) {
  const li = document.createElement("li");
  if (taskObj.completed) li.classList.add("completed");
  li.setAttribute("data-category", taskObj.category);
  li.setAttribute("data-due", taskObj.dueDate || "");

  const isOverdue =
    taskObj.dueDate &&
    new Date(taskObj.dueDate) < new Date().setHours(0, 0, 0, 0);
  if (isOverdue && !taskObj.completed) {
    li.classList.add("overdue");
  }

  const taskText = document.createElement("span");
  taskText.textContent = taskObj.text;

  const categorySpan = document.createElement("span");
  categorySpan.textContent = taskObj.category;
  categorySpan.classList.add("category-badge", `category-${taskObj.category}`);

  const actionsDiv = document.createElement("div");
  actionsDiv.classList.add("task-actions");

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✓";
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
    li.classList.remove("overdue");
    saveTasks();
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = taskText.textContent;
    input.classList.add("edit-input");
    li.replaceChild(input, taskText);
    input.focus();

    input.addEventListener("blur", () => finishEditing(input));
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") finishEditing(input);
    });

    function finishEditing(inputEl) {
      const newText = inputEl.value.trim();
      if (newText) {
        taskText.textContent = newText;
        li.replaceChild(taskText, inputEl);
        saveTasks();
      } else {
        inputEl.focus(); // prevent empty input
      }
    }
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = () => {
  li.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  li.style.opacity = "0";
  li.style.transform = "translateX(100px)";
  setTimeout(() => {
    li.remove();
    saveTasks();
  }, 300);
};


  actionsDiv.appendChild(completeBtn);
  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  li.appendChild(taskText);
  li.appendChild(categorySpan);

  if (taskObj.dueDate) {
    const dueDateSpan = document.createElement("span");
    dueDateSpan.textContent = `Due: ${taskObj.dueDate}`;
    dueDateSpan.classList.add("due-date");
    li.appendChild(dueDateSpan);
  }

  li.appendChild(actionsDiv);
  li.classList.add("task-item"); // use this for filtering later

  taskList.appendChild(li);
}

// Add new task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const category = categoryInput.value;
  const dueDate = dueDateInput.value;

  if (taskText !== "") {
    const newTask = {
      text: taskText,
      completed: false,
      category: category,
      dueDate: dueDate
    };
    addTaskToDOM(newTask);
    saveTasks();
    taskInput.value = "";
    dueDateInput.value = "";
  }
});

function applyFilters() {
  const allTasks = document.querySelectorAll(".task-item");
  const searchTerm = searchInput.value.toLowerCase();

  allTasks.forEach((li) => {
    const text = li.querySelector("span").textContent.toLowerCase();
    const isCompleted = li.classList.contains("completed");

    const matchesSearch = text.includes(searchTerm);
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "completed" && isCompleted) ||
      (currentFilter === "pending" && !isCompleted);

    if (matchesSearch && matchesFilter) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  });
}

const themeSwitcher = document.getElementById("themeSwitcher");

// Load theme from localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeSwitcher.checked = true;
  }
}

loadTheme();

// Toggle theme on checkbox click
themeSwitcher.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});
