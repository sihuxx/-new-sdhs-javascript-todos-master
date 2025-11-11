/* 
    1. 투두 생성
    2. 투두 삭제
    3. 투두 체크
    4. 체크된 투두만 삭제
    5. 투두 개수 반환
    6. 하단 바 토글
    7. 전체 체크
    8. 투두 수정
    9. 해시태그 투두 토글
    */

const $ = (e) => document.querySelector(e)
const $$ = (e) => document.querySelectorAll(e)

const todoList = $('.todo-list')
const newTodoInput = $('.new-todo')
const todoCount = $('.todo-count')
const footer = $('.footer')
const allCheckBtn = $('.toggle-all')
const allCheckLabel = $('.toggle-all-label')
const clearCompleted = $('.clear-completed')


const create = (element, attrs = {}) =>
    Object.assign(document.createElement(element), attrs)

// 01 투두 생성
function addTodo() {
    if (newTodoInput.value.trim() === "") {
        return
    }

    const todo = create('li', {
        innerHTML: `
            <div class="view">
                <input class="toggle" type="checkbox" />
                <label>${newTodoInput.value}</label>
                <button class="destroy"></button>
            </div>
        `
    })
    todoList.append(todo)

    allCheckBoll()
    delTodo()
    checkTodo()
    todoListLength()
    sideBarToggle()
    editTodo()

    newTodoInput.value = ''
}

document.addEventListener('click', (e) => {
    if (newTodoInput.contains(e.target) || newTodoInput.value.trim() === "") {
        return
    }
    addTodo()
})

newTodoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo()
        newTodoInput.focus()
    }
})

// 02 투두 삭제
function delTodo() {
    const delBtns = $$('.destroy')

    delBtns.forEach(btn => {
        const todo = btn.closest('li')
        btn.addEventListener('click', () => {
            todo.remove()

            allCheckBoll()
            todoListLength()
            sideBarToggle()
            clearTextVisible()
        })
    })
}


// 03 투두 체크
function checkTodo() {
    const checks = $$('.toggle')

    checks.forEach(c => {
        c.addEventListener('change', () => {
            if (c.checked) {
                c.closest('li').classList.add('completed')
            } else {
                allCheckBtn.checked = false
                c.closest('li').classList.remove('completed')
            }

            allCheckBoll()
            todoListLength()
            sideBarToggle()
            clearTextVisible()
        })
    })

}

every

// 04 체크된 투두만 삭제
clearCompleted.addEventListener('click', () => {
    const checks = $$('.toggle')
    const checkTodo = [...checks].filter(c => c.checked)

    checkTodo.forEach(c => {
        c.closest('li').remove()

        allCheckBoll()
        sideBarToggle()
        clearTextVisible()
    })
})

// clear-completed 토글
function clearTextVisible() {
    const checks = $$('.toggle')
    const clearCompleted = $('.clear-completed')
    const checkTodo = [...checks].filter(c => c.checked)

    clearCompleted.classList.toggle('hidden', checkTodo.length > 0)
}

// 05 투두 개수 반환
function todoListLength() {
    const checkTodos = todoList.querySelectorAll('li:not(.completed)')

    todoCount.innerHTML = `<strong>${checkTodos.length}</strong> items left`
}

// 06 하단 바 / 전체선택 토글 
function sideBarToggle() {
    const todos = todoList.querySelectorAll('li')

    if (todos.length > 0) {
        footer.classList.remove('hidden')
        allCheckLabel.classList.remove('hidden')
    } else {
        footer.classList.add('hidden')
        allCheckLabel.classList.add('hidden')
    }
}

// 07 전체 체크 
function todoAllCheck() {
    const checks = $$('.toggle')

    checks.forEach(c => {
        c.checked = allCheckBtn.checked
        const todo = c.closest('li')

        if (c.checked) {
            todo.classList.add('completed')
        } else {
            todo.classList.remove('completed')
        }
    })
    todoListLength()
    clearTextVisible()
}

// 
function allCheckBoll() {
    const checks = $$('.toggle')
    const isChecked = [...checks].length > 0 && [...checks].every(c => c.checked)
    allCheckBtn.checked = isChecked
}

allCheckBtn.addEventListener('change', () => {
    todoAllCheck()
})


// 08 투두 수정 
let editingtodo = null

function editTodo() {
    const todos = todoList.querySelectorAll('li')

    todos.forEach(t => {
        t.addEventListener('dblclick', () => {
            if (editingtodo) return
            editingtodo = t

            t.classList.add('editing')

            const todoLabel = t.querySelector('label')
            const todoText = todoLabel.textContent

 /*            const editInput = document.createElement('input')
            editInput.className = 'edit'
            editInput.type = 'text'
            editInput.value = todoText */

                               

            t.appendChild(editInput)
            editInput.focus()

            function newEditTodo() {
                const newTodo = editInput.value
                todoLabel.textContent = newTodo

                if (newTodo.trim() === "") {
                    t.remove()
                } else {
                    todoLabel.textContent = newTodo
                    t.classList.remove('editing')
                }

                editInput.remove()
                document.removeEventListener('click', clickOutside)
                editingtodo = null

            }

            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    newEditTodo()
                }
            })

            function clickOutside(e) {
                if (!t.contains(e.target)) newEditTodo()
            }

            document.addEventListener('click', clickOutside)

            todoListLength()
            sideBarToggle()
            checkTodo()
        })
    })
}

// 09 해시태그 투두 토글

window.addEventListener('hashchange', () => {
    const hash = this.location.hash
    const todos = todoList.querySelectorAll('li')
    const links = [...$$('footer .filters a')]

    todos.forEach(t => {
        t.classList.remove('hidden')

        if (hash === '#/active' && t.classList.contains('completed')) {
            t.classList.add('hidden')
        } else if (hash === '#/completed' && !t.classList.contains('completed')) {
            t.classList.add('hidden')
        }
    })

    links.forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('selected')
        } else {
            link.classList.remove('selected')
        }
    })
})