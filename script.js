const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const darkModeToggle = document.getElementById("darkModeToggle");


function updateFilterVisibility() {
  const filterSection = document.getElementById("filters");
  const tasks = document.querySelectorAll("#taskList li");
  filterSection.style.display = tasks.length > 0 ? "flex" : "none";
}


window.onload = () => {
  loadTasks();
  applyDarkMode();
  updateFilterVisibility();
};


addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }
  createTask(taskText, false);
  saveTasks();
  updateFilterVisibility();
  taskInput.value = "";
});


function createTask(text, completed = false) {
  const li = document.createElement("li");
  li.textContent = text;

  if (completed) li.classList.add("completed");

 
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const newText = prompt("Edit task:", li.firstChild.textContent);
    if (newText !== null && newText.trim() !== "") {
      li.firstChild.textContent = newText.trim();
      saveTasks();
    }
  });


  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
    updateFilterVisibility();
  });

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
  updateFilterVisibility();
}


function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.childNodes[0].textContent,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach((task) => createTask(task.text, task.completed));
  updateFilterVisibility();
}


filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    document.querySelectorAll("#taskList li").forEach((li) => {
      switch (filter) {
        case "all":
          li.style.display = "flex";
          break;
        case "active":
          li.style.display = li.classList.contains("completed") ? "none" : "flex";
          break;
        case "completed":
          li.style.display = li.classList.contains("completed") ? "flex" : "none";
          break;
      }
    });
  });
});


darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

function applyDarkMode() {
  const dark = localStorage.getItem("darkMode") === "true";
  if (dark) {
    document.body.classList.add("dark");
  }
}
