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
      editing: false
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
  editByTodo(id, data) {
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

  const todosRender = services.filteredTodos;

  todosRender.forEach((todo) => {
    const $todoItem = createElement("li", {
      className: `${todo.completed ? "completed" : ""} ${todo.editing ? "editing" : ""}`,
      id: todo.id,
      innerHTML: `
        <div class="view">
          <input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""}/>
          <label>${todo.name}</label>
          <button class="destroy"></button>
        </div>
      `,
    });
    
    if (todo.editing) {
      const input = createElement("input", {
        className: 'edit',
        type: 'text',
        value: todo.name,
      });
      
      input.addEventListener('blur', () => {
        services.editByTodo(todo.id, { name: input.value, editing: false })
      })
      input.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
          services.editByTodo(todo.id, { name: input.value, editing: false })
        }
      })
      $todoItem.appendChild(input)
    } 
    
    
    const $checkbox = $todoItem.querySelector("input.toggle");
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
  
  $todoCount.innerHTML = `<strong>${services.notCheckTodo}</strong> items left`;
  $clearCompleted.classList.toggle("hidden", services.yesCheckTodo === 0);
  
  $allCheckBtn.checked = services.setCheck;
}

window.addEventListener("hashchange", () => {
  render()
});

$todoList.addEventListener("dblclick", (e) => {
  const li = e.target.closest("li");
  if (!li) return

  const id = li.id 
  services.editByTodo(id, { editing: true })
});

$clearCompleted.addEventListener("click", () => {
  services.completedCheck();
});

render();

// 모든 dom 요소 적용은 render에서
// getter 방식 함수는 () X
