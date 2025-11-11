const createElement = (element, attrs = {}) => Object.assign(document.createElement(element), attrs); // js 내 요소 생성 함수
const getStorage = (init = {}) => JSON.parse(localStorage.getItem("todos")) || init; // 로컬스토리지에 저장되어있는 투두 가져오는 함수
const setStorage = (state) => localStorage.setItem("todos", JSON.stringify(state)); // 로컬스토리지에 투두 저장하는 함수

const $todoInput = document.querySelector(".todo-input"); 
const $todoList = document.querySelector(".todo-list");
let state = getStorage({ todos: [], inputValue: "" }); // 현재 상태 저장 변수 (setState 할 때마다 업데이트 됨)

const services = { // 함수 모음
  createTodo(name) { // name이라는 매개변수를 받는 투두 추가 함수
    const todo = { 
      id: crypto.randomUUID(), // 랜덤 아이디 생성 (투두 구별 목적)
      name, // 투두 내용
      completed: false, // 투두 체크 상태
    };
    return todo; // 위의 투두 객체에 넣은 정보를 함수에 반환시킴
  },

  removeById(id) { // id라는 매개변수를 받는 투두 삭제 함수
    const todos = state.todos.filter((todo) => todo.id !== id); 
    // 현재 투두에 filter() 메소드를 통해 투두들 중 현재 접근하고 있는 투두와 다른 아이디를 지닌 투두들만 따로 걸러서 todos 변수에 저장하고, 현재 접근하고 있는 투두와 아이디가 같은 투두는 삭제한다. 
    setState({ todos }); // 만든 todos를 현재 state로 바꿈
  },

  updateById(id, data) { // id, data라는 매개변수를 받는 투두 체크 함수
    const todos = state.todos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo));
    // 현재 투두에 map() 메소드를 통해 투두들 중 현재 투두와 아이디가 같은 투두면 data를 함께 저장한 새 객체를 생성하고 아니라면 그 투두 그대로 두고 그 결괏값을 todos에 저장한다.
    setState({ todos }); // 만든 todos를 현재 state로 바꿈
  },
};

const setState = (newState) => { // newState(현 state를 변경시키는 매개변수)를 받는 상태변경 함수  
  state = { ...state, ...newState }; // state는 getStorage({ todos: [], inputValue: "" })이며, todos: []의 배열 안에 현재 상태 전체를 저장하고, inputValue: ""에 바뀔 상태를 저장한다.
  // 같은 키가 있으면 뒤에 오는 객체의 값이 우선시, 위 state는 {todos: [], inputValue: "", inputValue= ""} 형태이기 때문에 뒤에 오는 newState의 키가 덮어 써진다
  setStorage(state); // 로컬스토리지에 setState()를 통해 바뀐 상태를 저장한다
  render(); // 그 후 렌더링
};

$todoInput.addEventListener("keydown", function (e) { // 입력창 키다운 (엔터) 시
  if (e.key === "Enter" && state.inputValue.trim()) {
    const todo = services.createTodo(state.inputValue); // todo 변수에 createTodo로 만든 투두에 현 상태의 입력창 내용을 name 키에 집어 넣는다. (다른 id, completed는 고정)
    setState({ todos: [...state.todos, todo], inputValue: "" }); // setState로 현재 투두 객체와 이미 존재했던 투두 객체를 한 배열로 합쳐 넣은 후, 인풋 입력창을 초기화한다.
  }
});
$todoInput.addEventListener("input", function (e) { // 입력창에 글자 입력할 때마다
  setState({ inputValue: this.value }); // 입력창 value에 현재 입력창의 value를 저장함
});

function render() { // 전부 불러오는 함수
  $todoInput.value = state.inputValue; // 입력창의 value는 현재 접근하고 있는 투두의 입력창 value
  $todoList.innerHTML = ``;
  state.todos.forEach((todo) => {
    const $todoItem = createElement("div", { // element 생성 함수 통해 투두 내용이 들어갈 박스 생성
      class: "todo-item",
      id: todo.id,
      innerHTML: `
        <input type="checkbox" ${todo.completed ? "checked" : ""} />
        <span>${todo.name}</span>
        <button class="todo-item-remove">Remove</button>
    `,
    });
    const $checkbox = $todoItem.querySelector("input"); 
    const $removeBtn = $todoItem.querySelector(".todo-item-remove");

    $checkbox.addEventListener("change", () => { // 투두 내 체크박스의 상태가 바뀔 때마다
      services.updateById(todo.id, { completed: $checkbox.checked }); // 현재 접근하고 있는 투두와 같은 투두는 data에 체크박스 체크 상태 성립 데이터를 추가함으로써 체크박스가 체크되게 함
    });
    $removeBtn.addEventListener("click", () => { // 삭제 버튼을 누를 때마다
      services.removeById(todo.id); // 현재 접근하고 있는 투두와 아이디가 다른 투두들을 필터로 걸러내서 그 투두만 띄운다
    });

    $todoList.appendChild($todoItem); // 전체 투두리스트 박스에 지금까지 추가한 기능들이 들어가있는 투두들을 추가한다
  });
}

render(); // 사이트가 실행 될 때마다 함수 실행