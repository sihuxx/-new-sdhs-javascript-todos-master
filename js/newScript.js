const $ = (e) => document.querySelector(e)
const $$ = (e) => document.querySelectorAll(e)

const createElement = (element, attrs = {}) => Object.assign(document.createElement(element), attrs)
const getStorage = (init = {}) => JSON.parse(localStorage.setItem("todos")) || init
const setStorage = (state) => localStorage.setItem("todos". JSON.stringfy(state))

let state = getStorage({todos: [], inpuValue: ""})

const todoList = $('.todo-list')
const newTodoInput = $('.new-todo')
                                                         
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

    updateByTodo() {
        const todos = state.todos.map((todo) => (todo.id === id ? {...todo, ...data} : todo))
        setState({ todos })
    }
}

const setState = (newState) => {
    state = { ...state, ...newState }
    setStorage(state)
}