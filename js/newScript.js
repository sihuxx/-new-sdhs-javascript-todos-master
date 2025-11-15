const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

const createElement = (element, attrs = {}) => Object.assign(document.createElement(element), attrs);
const getStorage = (init = {}) => JSON.parse(localStorage.getItem("todos")) || init;
const setStorage = (state) => localStorage.setItem("todos", JSON.stringify(state));

let state = getStorage({ todos: [], inputValue: "" });

const $todoList = $(".todo-list");
const $todoInput = $(".new-todo");
const $footer = $(".footer");
const $allCheckLabel = $(".toggle-all-label");
const $allCheckBtn = $(".toggle-all");
const $todoCount = $(".todo-count");
const $clearCompleted = $(".clear-completed");
const $filters = $(".filters");

const services = {
  createTodo(name) {
    const todo = {
      id: crypto.randomUUID(),
      name,
      completed: false,
    };
    return todo;
  },
  removeByTodo(id) {
    const todos = state.todos.filter((todo) => todo.id !== id);
    setState({ todos });
  },
  checkByTodo(id, data) {
    const todos = state.todos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo));
    setState({ todos });
  },
  completedCheck() {
    const todos = state.todos.filter((e) => !e.completed);
    setState({ todos });
  },
  setAllCheckEvent() {
    const allChecked = state.todos.every((e) => e.completed);
    state.todos.forEach((e) => (e.completed = !allChecked));
    setState({ todos: state.todos });
  },
  get setCheck() {
    return state.todos.every((e) => e.completed);
  },
  get notCheckTodo() {
    return state.todos.filter((e) => !e.completed).length;
  },
  get yesCheckTodo() {
    return state.todos.filter((e) => e.completed).length;
  },
  get isVisible() {
    return state.todos.length > 0;
  },
  get getHash() {
    const hash = location.hash;

    if (hash === "#/active") {
      return "active";
    } else if (hash === "#/completed") {
      return "completed";
    } else {
      return "all";
    }
  },
  get filteredTodos() {
    const status = services.getHash;

    if (status === "active") {
      const todos = state.todos.filter((e) => !e.completed);
      return todos;
    } else if (status === "completed") {
      const todos = state.todos.filter((e) => e.completed);
      return todos;
    } else if (status === "all") {
      const todos = state.todos;
      return todos;
    }
  },
};

const setState = (newState) => {
  state = { ...state, ...newState };
  setStorage(state);
  render();
};

$todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && state.inputValue.trim()) {
    const todo = services.createTodo(state.inputValue);
    setState({ todos: [...state.todos, todo], inputValue: "" });
  }
});

$todoInput.addEventListener("input", (e) => {
  setState({ inputValue: e.target.value });
});

$allCheckBtn.addEventListener("change", () => {
  services.setAllCheckEvent();
});

function render() {
  $todoInput.value = state.inputValue;
  $todoList.innerHTML = ``;
  state.todos.forEach((todo) => {
    const $todoItem = createElement("li", {
      className: todo.completed ? "completed" : "",
      id: todo.id,
      innerHTML: `
            <div class="view">
            <input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""}/>
            <label>${todo.name}</label>
            <button class="destroy"></button>
            </div>
            `,
    });

    const $checkbox = $todoItem.querySelector("input");
    const $removeBtn = $todoItem.querySelector(".destroy");

    $checkbox.addEventListener("change", () => {
      services.checkByTodo(todo.id, { completed: $checkbox.checked });
    });

    $removeBtn.addEventListener("click", () => {
      services.removeByTodo(todo.id);
    });

    $todoList.appendChild($todoItem);
  });

  $footer.classList.toggle("hidden", !services.isVisible);
  $allCheckLabel.classList.toggle("hidden", !services.isVisible);

  $filters.addEventListener("click", (e) => {
    if (e.target.tagName !== "A") return;

    $filters.querySelectorAll("a").forEach((e) => e.classList.remove("selected"));
    e.target.classList.add("selected");
  });

  $todoCount.innerHTML = `<strong>${services.notCheckTodo}</strong> items left`;
  $clearCompleted.classList.toggle("hidden", services.yesCheckTodo === 0);

  $allCheckBtn.checked = services.setCheck;
}

window.addEventListener("hashchange", () => {
  $todoList.innerHTML = services.filteredTodos
    .map(
      (todo) => `
          <li>
              <div class="view">
                  <input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""} />
                  <label>${todo.name}</label>
                  <button class="destroy"></button>
              </div>
          </li>
      `
    )
    .join("");
});

let editingTodo = null; 

$todoList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  if (editingTodo && editingTodo !== li) {
    
  }

  if (li.querySelector("input.edit")) return;

  li.classList.add("editing");

  const label = li.querySelector("label");
  const todoText = label.textContent;

  const input = document.createElement("input");
  input.className = "edit";
  input.type = "text";
  input.value = todoText;

  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        label.textContent = input.value 
        input.remove()
        li.classList.remove('editing')
    }
  })

  li.appendChild(input);
  input.focus();
});


$clearCompleted.addEventListener("click", () => {
  services.completedCheck();
});

render();

// 모든 dom 요소 적용은 render에서
// getter 방식 함수는 () X
