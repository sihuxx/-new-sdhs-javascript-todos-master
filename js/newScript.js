const $ = (e) => document.querySelector(e)
const $$ = (e) => document.querySelectorAll(e)

const createElement = (element, attrs = {}) => Object.assign(document.createElement(element), attrs)
const getStorage = (init = {}) => JSON.parse(localStorage.getItem("todos")) || init
const setStorage = (state) => localStorage.setItem("todos", JSON.stringify(state))

let state = getStorage({ todos: [], inputValue: "" })

const $todoList = $('.todo-list')
const $todoInput = $('.new-todo')
const $footer = $('.footer')
const $allCheckLabel = $('.toggle-all-label')
const $allCheckBtn = $('.toggle-all')
const $todoCount = $('.todo-count')
const $clearCompleted = $('.clear-completed')

const services = {
    createTodo(name) {
        const todo = {
            id: crypto.randomUUID(),
            name,
            completed: false,
        }
        return todo
    },

    removeByTodo(id) {
        const todos = state.todos.filter((todo) => todo.id !== id)
        setState({ todos })
    },

    checkByTodo(id, data) {
        const todos = state.todos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo))
        setState({ todos })
    }
}

const setState = (newState) => {
    state = { ...state, ...newState }
    setStorage(state)
    render()
}

$todoInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && state.inputValue.trim()) {
        const todo = services.createTodo(state.inputValue);
        setState({ todos: [...state.todos, todo], inputValue: "" });
    }
});

$todoInput.addEventListener('input', (e) => {
    setState({ inputValue: e.target.value })
})

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
            setCheck()
        });

        $removeBtn.addEventListener("click", () => {
            services.removeByTodo(todo.id);
            setCheck()
        });

        setCheck()

        $todoList.appendChild($todoItem);
    })

    const notCheckTodos = state.todos.filter(e => !e.completed).length
    const yesCheckTodos = state.todos.filter(e => e.completed).length
    $todoCount.innerHTML = `<strong>${notCheckTodos}</strong> items left`

    $clearCompleted.classList.toggle('hidden', yesCheckTodos === 0)
    $clearCompleted.addEventListener('click', () => {
        const todos = state.todos.filter((e) => !e.completed)
        setState({ todos })
    })

    const isVisible = state.todos.length > 0

    $footer.classList.toggle('hidden', !isVisible)
    $allCheckLabel.classList.toggle('hidden', !isVisible)
}

function setCheck() {
    const isAllChecked = state.todos.every(e => e.completed);
    $allCheckBtn.checked = isAllChecked;
}

function setAllCheckEvent() {
    $allCheckBtn.addEventListener('change', () => {
        const allChecked = state.todos.every(e => e.completed);
        state.todos.forEach(e => e.completed = !allChecked)
        setState({ todos: state.todos })
    });
}

setAllCheckEvent()
render()

