// --- DOM references ---
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompleted");
const darkToggle = document.getElementById("darkToggle");

// --- Load tasks from localStorage ---
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => addTaskToDOM(task.text, task.completed));
  // Restore dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
};

// --- Add button click ---
addBtn.addEventListener("click", addTask);

// --- Enter key adds task ---
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// --- Add a task ---
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTaskToDOM(taskText, false);
    saveTask(taskText, false);
    taskInput.value = "";
  }
}

// --- Create task in DOM ---
function addTaskToDOM(text, completed) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = text;
  span.classList.add("task-text");

  // Buttons container
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");

  // Complete button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔";
  completeBtn.classList.add("complete-btn");
  completeBtn.addEventListener("click", () => {
    li.classList.toggle("completed");
    updateTaskInStorage(text, li.classList.contains("completed"));
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.classList.add("delete-btn");
  delBtn.addEventListener("click", () => {
    li.remove();
    deleteTaskFromStorage(text);
  });

  btnGroup.appendChild(completeBtn);
  btnGroup.appendChild(delBtn);

  li.appendChild(span);
  li.appendChild(btnGroup);
  taskList.appendChild(li);
}

// --- Save task to storage ---
function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Update task status ---
function updateTaskInStorage(text, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.map((task) =>
    task.text === text ? { ...task, completed } : task
  );
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

// --- Delete task ---
function deleteTaskFromStorage(text) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filtered = tasks.filter((task) => task.text !== text);
  localStorage.setItem("tasks", JSON.stringify(filtered));
}

// --- Clear all completed tasks ---
clearCompletedBtn.addEventListener("click", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const activeTasks = tasks.filter((task) => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(activeTasks));
  // Refresh UI
  taskList.innerHTML = "";
  activeTasks.forEach((task) => addTaskToDOM(task.text, task.completed));
});

// --- Dark mode toggle ---
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Save dark mode state
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);

  // Update toggle button text
  darkToggle.textContent = isDark ? "☀ Light Mode" : "🌙 Dark Mode";
});

// --- Run once on load to set correct button text ---
if (localStorage.getItem("darkMode") === "true") {
  darkToggle.textContent = "☀ Light Mode";
} else {
  darkToggle.textContent = "🌙 Dark Mode";
}
