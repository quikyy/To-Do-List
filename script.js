// Main controler
const controler = document.querySelector(".controler")
const addTaskButton = document.querySelector(".add-btn")
// UserInput
let taskNameInput1 = document.querySelector(".userInput")
let endinput = document.querySelector(".date-end");
// Ul
const ulList = document.querySelector("ul");
// Summary
const summaryDiv = document.querySelector(".summary")
const allViewBtn = [...document.querySelectorAll(".summary span")]
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
            taskTemplate(taskList[i].taskState, taskList[i].taskName, taskList[i].taskStartDate, taskList[i].taskEndDate, taskList[i].taskEditDate, taskList[i].taskId, compareDates(taskList[i]))
        }
    }
}

function createNewTask() {
    let taskNameInput = document.querySelector(".userInput").value;
    let taskEndInput = document.querySelector(".date_end").value
    if (taskNameInput == "") {
        return
    } else if (taskNameInput != "") {
        if (taskNameInput.charAt(0) == " ") {
            taskNameInput = taskNameInput.trimLeft();
        }
        if (taskEndInput == "") {
            taskEndInput = 0;
        }
        let newTask = {
            taskState: 0,
            taskName: taskNameInput,
            taskStartDate: new Date(),
            taskEndDate: taskEndInput,
            taskEditDate: 0,
            taskId: new Date().getTime(),
        }
        taskList.push(newTask)
        localStorage.setItem("taskList", JSON.stringify(taskList));
        let capitalizeChar = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
        taskTemplate(newTask.taskState, capitalizeChar, newTask.taskStartDate.toISOString(), newTask.taskEndDate, newTask.taskEditDate, newTask.taskId, compareDates(newTask))
        setDefualt()
    }
}

function taskTemplate(taskState, taskName, taskStartDate, taskEndDate, taskEditDate, taskId, taskCompare) {
    // Create an task container
    const taskContainer = document.createElement("div");

    // Taskstate = 1 - DONE | 0 = UN-DONE
    // taskState == 0 ? taskContainer.dataset.state = 1 : taskContainer.dataset.state = 0;
    taskContainer.dataset.id = taskId;
    taskContainer.classList.add("newDivContainer");
    ulList.appendChild(taskContainer);

    // Done/UnDone
    const mark = document.createElement("button")
    mark.classList.add("mark-button");
    taskState == 1 ? mark.innerHTML = `<i class="fas fa-check-circle"></i>` : mark.innerHTML = `<i class="far fa-check-circle"></i>`
    taskContainer.appendChild(mark);
    const allMarkBtn = [...document.querySelectorAll(".newDivContainer .mark-button")]
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
    taskStartDate = taskStartDate.toString();
    let year = taskStartDate.slice(0, 4)
    let month = taskStartDate.slice(5, 7)
    let day = taskStartDate.slice(8, 10)
    let hour = taskStartDate.slice(11, 13)
    let minutes = taskStartDate.slice(14, 16)
    let secs = taskStartDate.slice(17, 19)
    startDate.classList.add("date-of-creation");
    taskEditDate == 0 ? startDate.innerText = `Created: ${day}.${month}.${year}, ${hour}:${minutes}:${secs}` : startDate.innerText = `Edited: ${taskEditDate}`;
    taskContainer.appendChild(startDate);

    const endDate = document.createElement("span");
    endDate.classList.add("end-of-creation")
    if (taskEndDate != 0) {
        taskEndDate = taskEndDate.toString();
        year = taskEndDate.slice(0, 4)
        month = taskEndDate.slice(5, 7)
        day = taskEndDate.slice(8, 10)
        hour = taskEndDate.slice(11, 13)
        minutes = taskEndDate.slice(14, 16)
        secs = "00"
        endDate.innerText = `Deadline: ${day}.${month}.${year}, ${hour}:${minutes}:${secs}`
    } else {
        endDate.innerText = ""
    }
    taskContainer.appendChild(endDate)
    const timeToEnd = document.createElement("span")
    timeToEnd.classList.add("time-to-end");
    timeToEnd.innerText = taskCompare;
    taskContainer.appendChild(timeToEnd)
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

        taskContainer.style.background = "linear-gradient(to right, #373b44, #4286f4)"
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
        userInput.addEventListener("keyup", function (e) {
            if (e.keyCode == 13) {
                for (let i = 0; i < taskList.length; i++) {
                    if (taskList[i].taskId == findTaskId) {
                        if (userInput.value != "") {
                            if (userInput.value.charAt(0) == " ") {
                                userInput.value = userInput.value.trimLeft();
                            }
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
                            taskContainer.style.background = "transparent"
                            overlay.removeEventListener("click", exitOverlay)
                        }
                    }
                }
            } else if (e.keyCode == 27) {
                exitOverlay();
            }
        })
        confirmEditBtn.addEventListener("click", function () {

            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i].taskId == findTaskId) {
                    if (userInput.value != "") {
                        if (userInput.value.charAt(0) == " ") {
                            userInput.value = userInput.value.trimLeft();
                        }
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
                        taskContainer.style.background = "transparent"
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
            taskContainer.style.background = "transparent"
        }
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
    let findTaskId = taskContainer.dataset.id;
    let findState = taskContainer.dataset.state;
    let doneBtn = taskContainer.querySelector(".mark-button")
    if (findState == 0) {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].taskId == findTaskId) {
                taskList[taskList.indexOf(taskList[i])].taskState = 1;
                taskContainer.dataset.state = 1;
                doneBtn.innerHTML = `<i class="fas fa-check-circle"></i>`
                localStorage.setItem("taskList", JSON.stringify(taskList));
                taskContainer = null;

            }
        }
    } else if (findState == 1) {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].taskId == findTaskId) {
                taskList[taskList.indexOf(taskList[i])].taskState = 0;
                taskContainer.dataset.state = 0;
                doneBtn.innerHTML = `<i class="far fa-check-circle"></i>`
                localStorage.setItem("taskList", JSON.stringify(taskList));
            }
        }
    }
    updateSummary();
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
}

function compareDates(x) {
    const task = x
    let infoText = ""
    if (task.taskEndDate == 0) {
        return infoText;

    }
    const today_date = new Date().getTime();
    const end_date = new Date(task.taskEndDate)
    const time_to_end = end_date - today_date
    const oneDay = 24 * 60 * 60 * 1000
    const oneHour = 60 * 60 * 1000
    const oneMin = 60 * 1000

    let days = Math.floor(time_to_end / oneDay)
    let hours = Math.floor((time_to_end % oneDay) / oneHour);
    let mins = Math.floor((time_to_end % oneHour) / oneMin);
    let sec = Math.floor((time_to_end % oneMin) / 1000)

    if(sec <= 0){
        return infoText = `Time over!`
    }

    return infoText = (`Time left: ${days} days ${hours} hours ${mins} mins and ${sec} seconds`)

}

getLocalStorage();
clearListButton.addEventListener("click", clearTasks)
addTaskButton.addEventListener("click", createNewTask);
// taskNameInput1.addEventListener("keyup", function (e) {
//     if (e.keyCode == 13) {
//         let taskNameInput = document.querySelector(".userInput").value;
//         if (taskNameInput == "" || taskNameInput.charAt(0) == " ") {

//             return
//         } else if (taskNameInput != "") {

//             let newTask = {
//                 taskState: 0,
//                 taskName: taskNameInput,
//                 taskStartDate: generateDate(),
//                 taskEditDate: 0,
//                 taskId: new Date().getTime()
//             }

//             taskList.push(newTask);
//             localStorage.setItem("taskList", JSON.stringify(taskList));
//             let capitalizeChar = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
//             taskTemplate(newTask.taskState, capitalizeChar, newTask.taskStartDate, newTask.taskEditDate, newTask.taskId)
//             setDefualt()

//         }
// //     }
// })

controler.addEventListener("input", function () {
    taskNameInput1.value != "" ? controler.classList.add("controlerGrow") : controler.classList.remove("controlerGrow")

})