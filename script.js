// Main controler
const controler = document.querySelector(".controler")
const addTaskButton = document.querySelector(".add-btn")
// UserInput
let taskNameInput1 = document.querySelector(".userInput")
let taskPrioInput1 = document.querySelector(".prioInput")
let taskEndInput1 = document.querySelector(".endInput")
// Ul
const ulList = document.querySelector("ul");
// Summary
const summaryDiv = document.querySelector(".summary")
const clearListButton = document.getElementById("clear")
const howManyTotal = document.querySelector(".how-many-items")
const howManyUnDone = document.querySelector(".how-many-undone")
const howManyDone = document.querySelector(".how-many-done")

// Overlay nakładany przy edycji zadań
const overlay = document.querySelector(".overlay")

// Variables
let taskList = []
let editFlag = false;


function getLocalStorage() {
    let getLocalTaskList = JSON.parse(localStorage.getItem("taskList"))
    if (getLocalTaskList != null) {
        taskList = getLocalTaskList;
        for (let i = 0; i < taskList.length; i++) {
            taskTemplate(taskList[i].taskState, taskList[i].taskName, taskList[i].taskPrio, taskList[i].taskStartDate, taskList[i].taskEditDate, taskList[i].taskId)
        }
    }
}

function createNewTask() {
    let taskNameInput = document.querySelector(".userInput").value;
    let taskPrioInput = document.querySelector(".prioInput").value;
    if (taskNameInput == "" || taskNameInput.charAt(0) == " ") {
        return
    } else if (taskNameInput != "") {
        let newTask = {
            taskState: 0,
            taskName: taskNameInput,
            taskPrio: taskPrioInput,
            taskStartDate: generateDate(),
            taskEditDate: 0,
            taskEndDate: generateEndDate(),
            taskId: new Date().getTime()
        }

        taskList.push(newTask);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        let capitalizeChar = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
        taskTemplate(newTask.taskState, capitalizeChar, taskPrioInput, newTask.taskStartDate, newTask.taskEditDate, newTask.taskId)
        setDefualt()
    }
}

function taskTemplate(taskState, taskName, taskPrio, taskStartDate, taskEditDate, taskId) {
    // Create an task container
    const taskContainer = document.createElement("div");
    taskContainer.dataset.prio = taskPrio;

    // Taskstate = 1 - DONE | 0 = UN-DONE
    if (taskState == 1) {
        taskContainer.dataset.state = 1;
    } else {
        taskContainer.dataset.state = 0
    }
    taskContainer.dataset.id = taskId;
    taskContainer.classList.add("newDivContainer");
    ulList.appendChild(taskContainer);

    // Done/UnDone
    const mark = document.createElement("button")
    mark.classList.add("mark-button");
    if (taskState == 1) {
        mark.innerHTML = `<i class="fas fa-check-circle"></i>`
    } else {
        mark.innerHTML = `<i class="far fa-check-circle"></i>`
    }
    taskContainer.appendChild(mark);
    const allMarkBtn = document.querySelectorAll(".newDivContainer .mark-button i")
    allMarkBtn.forEach(btn => btn.addEventListener("click", markDone))

    //Task value
    const task = document.createElement("input");
    task.setAttribute("readonly", "readonly")
    taskContainer.appendChild(task);
    let capitalizeChar = taskName.charAt(0).toUpperCase() + taskName.slice(1)
    task.value = `${capitalizeChar}`

    // Delate task button
    const delate = document.createElement("button");
    delate.innerHTML = `<i class="fas fa-times"></i>`
    delate.classList.add("remove-button")
    taskContainer.appendChild(delate)
    const allRemoveBtn = document.querySelectorAll(".newDivContainer .remove-button i")
    allRemoveBtn.forEach(btn => btn.addEventListener("click", removeTask))

    //Edit task button
    const edit = document.createElement("button");
    edit.innerHTML = `<i class="fas fa-pencil-alt"></i>`
    edit.classList.add("edit-button")
    taskContainer.appendChild(edit);
    const allEditBtn = document.querySelectorAll(".newDivContainer .edit-button i")
    allEditBtn.forEach(btn => btn.addEventListener("click", editTask))

    // Date of creation
    const startDate = document.createElement("span");
    startDate.classList.add("date-of-creation")
    if (taskEditDate != 0) {
        startDate.innerText = `Edited: ${taskEditDate}`;
    } else if (taskEditDate == 0) {
        startDate.innerText = `Created: ${taskStartDate}`;
    }
    taskContainer.appendChild(startDate);

    updateSummary();
}

function editTask(e) {
    editFlag = true;
    let taskContainer = e.target.parentNode.parentNode;
    const removeBtn = taskContainer.querySelector(".remove-button");
    const editBtn = taskContainer.querySelector(".edit-button")
    const markBtns = document.querySelectorAll(".newDivContainer .mark-button")
    const removeBtns = document.querySelectorAll(".newDivContainer .remove-button")
    const editBtns = document.querySelectorAll(".newDivContainer .edit-button")
    let findTaskId = taskContainer.dataset.id;
    let previousInput = taskContainer.querySelector("input").value;
    let userInput = taskContainer.querySelector("input");
    let date_edited = taskContainer.querySelector(".date-of-creation")
    let objectInList = null;

    if (editFlag == true) {
        overlay.classList.add("overlayOn")

        userInput.removeAttribute("readonly");
        userInput.focus();

        taskContainer.style.backgroundColor = "white"
        clearListButton.style.pointerEvents = "none"

        removeBtn.classList.add("hideElement")
        editBtn.classList.add("hideElement")
        markBtns.forEach(btn => btn.style.pointerEvents = "none")
        editBtns.forEach(btn => btn.style.pointerEvents = "none")
        removeBtns.forEach(btn => btn.style.pointerEvents = "none")
        const confirmEditBtn = document.createElement("button")
        confirmEditBtn.innerHTML = `<i class="fas fa-check"></i>`
        confirmEditBtn.classList.add("confirm-edit-button")

        taskContainer.appendChild(confirmEditBtn)

        confirmEditBtn.addEventListener("click", function () {
            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i].taskId == findTaskId) {
                    if (userInput.value != "") {
                        editFlag = false;
                        objectInList = taskList.indexOf(taskList[i])
                        taskList[objectInList].taskName = userInput.value.charAt(0).toUpperCase() + userInput.value.slice(1);
                        taskList[objectInList].taskEditDate = generateDate();
                        localStorage.setItem("taskList", JSON.stringify(taskList));

                        userInput.value = userInput.value.charAt(0).toUpperCase() + userInput.value.slice(1);

                        removeBtn.classList.remove("hideElement")
                        editBtn.classList.remove("hideElement")
                        markBtns.forEach(btn => btn.style.pointerEvents = "")
                        editBtns.forEach(btn => btn.style.pointerEvents = "")
                        removeBtns.forEach(btn => btn.style.pointerEvents = "")
                        userInput.setAttribute("readonly", "readonly");
                        overlay.classList.remove("overlayOn")
                        confirmEditBtn.remove();

                        date_edited.innerText = `Edited: ${taskList[objectInList].taskEditDate}`;
                        clearListButton.style.pointerEvents = ""
                        taskContainer.style.backgroundColor = ""
                        overlay.removeEventListener("click", exitOverlay)
                    }
                }
            }
        })
        overlay.addEventListener("click", exitOverlay)

        function exitOverlay() {
            editFlag = false;
            overlay.classList.remove("overlayOn")

            userInput.setAttribute("readonly", "readonly");
            userInput.value = previousInput;

            removeBtn.classList.remove("hideElement")
            editBtn.classList.remove("hideElement")
            confirmEditBtn.remove();

            clearListButton.style.pointerEvents = ""
            markBtns.forEach(btn => btn.style.pointerEvents = "")
            editBtns.forEach(btn => btn.style.pointerEvents = "")
            removeBtns.forEach(btn => btn.style.pointerEvents = "")
            taskContainer.style.backgroundColor = ""
        }
    }
}

function removeTask(e) {
    let taskContainer = e.target.parentNode.parentNode;
    let findTaskId = taskContainer.dataset.id;
    let objectInList = null;
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].taskId == findTaskId) {
            objectInList = taskList.indexOf(taskList[i])
            taskList.splice(objectInList, 1);
        }
    }
    taskContainer.remove();
    localStorage.setItem("taskList", JSON.stringify(taskList));
    updateSummary();
}

function markDone(e) {
    let taskContainer = e.target.parentNode.parentNode;
    let doneBtn = taskContainer.querySelector(".mark-button")
    let findTaskId = taskContainer.dataset.id;
    let objectInList = null;

    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].taskId == findTaskId) {
            objectInList = taskList.indexOf(taskList[i])
            taskList[objectInList].taskState = 1;
            taskContainer.dataset.state = 1;
            doneBtn.innerHTML = `<i class="fas fa-check-circle"></i>`
        }
        localStorage.setItem("taskList", JSON.stringify(taskList));
        updateSummary();
    }
}

function generateDate() {
    let currentTime = new Date();

    let getHour = currentTime.getHours()
    if (getHour < 10) {
        getHour = `0${getHour}`
    }
    let getMin = currentTime.getMinutes();
    if (getMin < 10) {
        getMin = `0${getMin}`
    }
    let getSec = currentTime.getSeconds();
    if (getSec < 10) {
        getSec = `0${getSec}`
    }

    let getMonth = currentTime.getMonth();
    if (getMonth < 10) {
        getMonth = `0${getMonth}`
    }

    let getDate = currentTime.getDate();
    if (getDate < 10) {
        getDate = `0${getDate}`
    }
    let getYear = currentTime.getFullYear()
    let properDate = `${getDate}.${getMonth+1}.${getYear}, ${getHour}:${getMin}:${getSec}`
    return properDate;
}

function generateEndDate() {
    let endInput = document.querySelector(".endInput").value
    let dateVal = new Date(endInput)
    let date = dateVal.getDate()
    let month = (dateVal.getMonth() + 1)
    let year = dateVal.getFullYear()
    let hour = dateVal.getHours();
    let minute = dateVal.getMinutes();
    let properDate = `${date}.${month}.${year}, ${hour}:${minute}`
    return properDate;

}

function clearTasks() {
    taskList = [];
    localStorage.removeItem("taskList")
    ulList.innerText = ""
    updateSummary();
}

function updateSummary() {
    let completed = 0;
    let pending = 0;
    if (taskList.length > 0) {
        function calculateSummary() {
            let getLocalTaskList = JSON.parse(localStorage.getItem("taskList"))
            taskList = getLocalTaskList;
            howManyTotal.innerText = `Total: ${taskList.length}`
            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i].taskState == 0) {
                    completed++;
                } else {
                    pending++;
                }
            }
            howManyUnDone.innerText = `Pending: ${completed}`
            howManyDone.innerText = `Completed: ${pending}`

        }
        calculateSummary();
        summaryDiv.classList.add("summaryOn")
    } else {
        summaryDiv.classList.remove("summaryOn")
        controler.classList.remove("controlerGrow")
    }
}

function setDefualt() {
    taskNameInput1.value = ""
    taskPrioInput1.value = 0;
}

getLocalStorage();
clearListButton.addEventListener("click", clearTasks)
addTaskButton.addEventListener("click", createNewTask);
taskNameInput1.addEventListener("keyup", function (e) {
    if (e.keyCode == 13) {
        let taskNameInput = document.querySelector(".userInput").value;
        let taskPrioInput = document.querySelector(".prioInput").value;
        if (taskNameInput == "" || taskNameInput.charAt(0) == " ") {
            return
        } else if (taskNameInput != "") {
            let newTask = {
                taskState: 0,
                taskName: taskNameInput,
                taskPrio: taskPrioInput,
                taskStartDate: generateDate(),
                taskEditDate: 0,
                taskEndDate: generateEndDate(),
                taskId: new Date().getTime()
            }

            taskList.push(newTask);
            localStorage.setItem("taskList", JSON.stringify(taskList));
            let capitalizeChar = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
            taskTemplate(newTask.taskState, capitalizeChar, taskPrioInput, newTask.taskStartDate, newTask.taskEditDate, newTask.taskId)
            setDefualt()
        }
    }
})