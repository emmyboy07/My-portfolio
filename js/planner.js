(function () {
  var STORAGE_KEY = "academicPlannerTasks";

  var form = document.getElementById("task-form");
  var titleInput = document.getElementById("task-title");
  var dueInput = document.getElementById("task-due");
  var listEl = document.getElementById("task-list");
  var emptyState = document.getElementById("empty-state");
  var totalCountEl = document.getElementById("total-count");
  var completedCountEl = document.getElementById("completed-count");
  var pendingCountEl = document.getElementById("pending-count");

  if (!form || !listEl) {
    return;
  }

  var tasks = loadTasks();

  function loadTasks() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function addTask(title, due) {
    tasks.push({
      id: createId(),
      title: title,
      due: due || "",
      completed: false,
    });
    saveTasks();
    render();
  }

  function toggleComplete(id) {
    tasks = tasks.map(function (task) {
      if (task.id === id) {
        return Object.assign({}, task, { completed: !task.completed });
      }
      return task;
    });
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    render();
  }

  function buildTaskItem(task) {
    var li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    var title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;
    li.appendChild(title);

    if (task.due) {
      var due = document.createElement("span");
      due.className = "task-due";
      due.textContent = "Due: " + task.due;
      li.appendChild(due);
    }

    var completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className = "task-complete-btn";
    completeBtn.title = task.completed ? "Mark as pending" : "Mark as completed";
    completeBtn.textContent = task.completed ? "↺" : "✓";
    completeBtn.addEventListener("click", function () {
      toggleComplete(task.id);
    });
    li.appendChild(completeBtn);

    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "task-delete-btn";
    deleteBtn.title = "Delete task";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });
    li.appendChild(deleteBtn);

    return li;
  }

  function render() {
    listEl.innerHTML = "";

    if (tasks.length === 0) {
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      tasks.forEach(function (task) {
        listEl.appendChild(buildTaskItem(task));
      });
    }

    var completed = tasks.filter(function (t) {
      return t.completed;
    }).length;

    totalCountEl.textContent = tasks.length;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = tasks.length - completed;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      return;
    }
    addTask(title, dueInput.value);
    form.reset();
    titleInput.focus();
  });

  render();
})();
