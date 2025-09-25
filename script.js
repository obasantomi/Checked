const overview = document.getElementById("overview");
const unchecked = document.getElementById("unchecked");
const checked = document.getElementById("checked");
const addTaskBtn = document.getElementById("add-task-btn");
const descriptionInput = document.getElementById("description-input");
const taskItemsContainer = document.querySelector(".task-items");
const tasksDoneSpan = document.getElementById("tasks-done");
const totalTasksSpan = document.getElementById("total-tasks");

const tasksLeftContainer = document.getElementById("tasks-left-container");

const todos = [];
if (overview.classList.contains("active")) {
  updateOverviewTaskCount();
}

descriptionInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(descriptionInput.value);
  }
});

addTaskBtn.addEventListener("click", () => {
  addTask(descriptionInput.value);
});

function addTask(text) {
  if (text.trim() === "") {
    return alert("Please enter task description");
  }

  const todo = {
    text: text,
    id: Date.now(),
    done: false,
  };

  todos.push(todo);

  storeTodos();
  updateTodos(todo);
  descriptionInput.value = "";
}

function storeTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
  if (overview.classList.contains("active")) updateOverviewTaskCount();
  if (checked.classList.contains("active")) updateTaskCount();
  if (unchecked.classList.contains("active")) updateUncheckedTaskCount();
}

window.addEventListener("load", () => {
  overview.classList.toggle("active");

  const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(...storedTodos);
  todos.forEach((element) => {
    updateTodos(element);
  });
  updateOverviewTaskCount();
});

function updateTaskCount() {
  const totalTasks = todos.length;
  totalTasksSpan.textContent = totalTasks;
  const taskDone = todos.filter((todo) => todo.done);
  tasksDoneSpan.textContent = taskDone.length;

  totalTasks === 1
    ? (tasksLeftContainer.textContent = `${taskDone.length} / ${totalTasks} Task checked`)
    : (tasksLeftContainer.textContent = `${taskDone.length} / ${totalTasks} Tasks checked`);
}

function updateTodos(todo) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");
  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");
  taskItem.appendChild(taskInfo);
  const checkbox = document.createElement("span");
  checkbox.classList.add("checkbox");

  if (unchecked.classList.contains("active")) {
    checkbox.addEventListener("click", () => {
      checkbox.classList.toggle("checked");
      todo.done = checkbox.classList.contains("checked");
      updateUncheckedTaskCount();
    });
  }
  if (overview.classList.contains("active")) {
    checkbox.addEventListener("click", () => {
      checkbox.classList.toggle("checked");
      todo.done = checkbox.classList.contains("checked");
      updateOverviewTaskCount();
    });
  }
  if (checked.classList.contains("active")) {
    checkbox.addEventListener("click", () => {
      checkbox.classList.toggle("checked");
      todo.done = checkbox.classList.contains("checked");
      updateTaskCount();
    });
  }

  if (todo.done) {
    checkbox.classList.add("checked");
  }

  taskInfo.appendChild(checkbox);
  const taskDescription = document.createElement("span");
  taskDescription.textContent = todo.text;
  taskInfo.appendChild(taskDescription);

  const deleteBtn = document.createElement("span");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.innerHTML = ` <i class="fas fa-trash-alt"></i> `;

  deleteBtn.addEventListener("click", () => {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos.splice(index, 1);
      taskItem.remove();
      storeTodos();
    }
  });

  taskItem.appendChild(deleteBtn);

  taskItemsContainer.appendChild(taskItem);
}

overview.addEventListener("click", () => {
  overview.classList.add("active");
  unchecked.classList.remove("active");
  checked.classList.remove("active");

  taskItemsContainer.innerHTML = "";
  const overviewTodos = todos;
  overviewTodos.forEach((element) => {
    updateTodos(element);
  });
  updateOverviewTaskCount();
});
checked.addEventListener("click", () => {
  overview.classList.remove("active");
  unchecked.classList.remove("active");
  checked.classList.add("active");

  taskItemsContainer.innerHTML = "";
  const checkedTodos = todos.filter((todo) => todo.done);
  checkedTodos.forEach((element) => {
    updateTodos(element);
  });
  updateTaskCount();
});
unchecked.addEventListener("click", () => {
  checked.classList.remove("active");
  overview.classList.remove("active");
  unchecked.classList.add("active");

  taskItemsContainer.innerHTML = "";
  const uncheckedTodos = todos.filter((todo) => !todo.done);
  uncheckedTodos.forEach((element) => {
    updateTodos(element);
  });

  updateUncheckedTaskCount();
});

function updateUncheckedTaskCount() {
  const totalTasks = todos.length;
  totalTasksSpan.textContent = totalTasks;
  const taskUndone = todos.filter((todo) => !todo.done);
  tasksDoneSpan.textContent = taskUndone.length;

  totalTasks === 1
    ? (tasksLeftContainer.textContent = `${taskUndone.length} / ${totalTasks} Task Unchecked`)
    : (tasksLeftContainer.textContent = `${taskUndone.length} / ${totalTasks} Tasks Unchecked`);
}

function updateOverviewTaskCount() {
  const totalTasks = todos.length;
  totalTasksSpan.textContent = totalTasks;

  totalTasks === 1
    ? (tasksLeftContainer.textContent = `${totalTasks} Task added`)
    : (tasksLeftContainer.textContent = `${totalTasks} Tasks added `);
}
