const form = document.querySelector('#form')
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

let tasks = [];

if(localStorage.getItem('tasks')){
	const taskOnLocalStor = JSON.parse(localStorage.getItem('tasks'))
	tasks = taskOnLocalStor
}
init()

function renderTask(task){
	// определяем завешена задачаи или нет и какой класс навесить на текст
	const cssClass = task.done ? 'task-title task-title--done': 'task-title'
		
	// HTML который будем втсавлять на страницу
	const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
		<span class="${cssClass}">${task.title}</span>
		<div class="task-item__buttons">
			<button type="button" data-action="done" class="btn-action">
				<img src="./img/tick.svg" alt="Done" width="18" height="18">
			</button>
			<button type="button" data-action="delete" class="btn-action">
				<img src="./img/cross.svg" alt="Done" width="18" height="18">
			</button>
		</div>
		</li>`

	// tasksList.innerHTML = taskHTML
	tasksList.insertAdjacentHTML('beforeend', taskHTML)
}
function init(){

	tasks.forEach((task) => {
		renderTask(task)
	})

	checkEmptyList()
}

function doneTask(){

	if(event.target.dataset.action === 'done'){

		// ищем элемент среди родителей
		const taskItem = event.target.closest('.list-group-item')
		const taskTitle = taskItem.querySelector('.task-title')

		// ищем задачу в массиве и меняем ее статус
		const idItem = taskItem.id
		const doneTask = tasks.find((task) => task.id == idItem)
		doneTask.done = !doneTask.done
		console.log(tasks)

		// toggle добавляет или удаляет класс в зависимости есть или нет
		taskTitle.classList.toggle('task-title--done')

	}

	saveStorage()
}

function deleteTask(){

	if(event.target.dataset.action === 'delete'){

		// ищем элемент среди родителей
		const taskItem = event.target.closest('.list-group-item')

		// удаляем элемент из массива
		const idItem = taskItem.id
		const idxItem = tasks.findIndex(task => task.id === idItem)
		tasks.splice(idxItem, 1)
		console.log('tasks', tasks)

		// удаляем со страницы
		taskItem.remove()

		// если спиок дел пуст показываем шильдик что список дел пуст
		checkEmptyList()

		saveStorage()
	}
}

function addTask(event){

	// отменяем отправку формы
	event.preventDefault()

	// забираем значение из поля ввода
	const taskText = taskInput.value

	//добавляем в массив задачу
	const newTask = {
		id: Date.now(),
		title: taskText,
		done: false

	};
	tasks.push(newTask)

	renderTask(newTask)

	// очищаем поле ввода и фокусируемся на нем
	taskInput.value = ""
	taskInput.focus()

	// если спиок дел пуст показываем шильдик что список дел пуст
	checkEmptyList()

	saveStorage()

}
function checkEmptyList() {
	if(tasks.length === 0){
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
			<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
			<div class="empty-list__title">Список дел пуст</div>
		</li>`

		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
	} 
	if(tasks.length > 0){
		const emptyListEl = document.querySelector('#emptyList')
		emptyListEl ? emptyListEl.remove() : null

	} 
}

function saveStorage(){
	localStorage.setItem('tasks', JSON.stringify(tasks))
}


