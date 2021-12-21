function getLocalStorage() {
    setDefualt();
    let getLocalTaskList = JSON.parse(localStorage.getItem("taskList"))
    if (getLocalTaskList != null) {
        taskList = getLocalTaskList;
        for (let i = 0; i < taskList.length; i++) {
            taskTemplate(taskList[i].taskStatus, taskList[i].taskName, taskList[i].taskStartDate, taskList[i].taskEndDate, taskList[i].taskEditDate, taskList[i].taskId, compareDates(taskList[i]))
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
            taskStatus: 0,
            taskName: taskNameInput,
            taskStartDate: new Date(),
            taskEndDate: taskEndInput,
            taskEditDate: 0,
            taskId: new Date().getTime(),
        }
        taskList.push(newTask)
        localStorage.setItem("taskList", JSON.stringify(taskList));
        let capitalizeChar = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
        taskTemplate(newTask.taskStatus, capitalizeChar, newTask.taskStartDate.toISOString(), newTask.taskEndDate, newTask.taskEditDate, newTask.taskId, compareDates(newTask))
        setDefualt()
    }
}

function taskTemplate(taskStatus, taskName, taskStartDate, taskEndDate, taskEditDate, taskId, taskCompare) {
    // Create an task container
    const taskContainer = document.createElement("div");

    // Taskstatus = 1 - DONE | 0 = UN-DONE
    if (taskStatus == 0) {
        taskContainer.dataset.status = 0;
    } else {
        taskContainer.dataset.status = 1;
    }
    taskContainer.dataset.id = taskId;
    taskContainer.classList.add("newDivContainer");
    ulList.appendChild(taskContainer);

    const allDivs = document.querySelectorAll(".newDivContainer")
    allDivs.forEach(div => div.addEventListener("mouseover", seeEndTime))



    // Done/UnDone
    const mark = document.createElement("button")
    mark.classList.add("mark-button");
    taskStatus == 1 ? mark.innerHTML = `<i class="fas fa-check-circle"></i>` : mark.innerHTML = `<i class="far fa-check-circle"></i>`
    taskContainer.appendChild(mark);
    const allMarkBtn = [...document.querySelectorAll(".newDivContainer .mark-button")]
    allMarkBtn.forEach(btn => btn.addEventListener("click", markDone))

    //Task value
    const task = document.createElement("input");
    task.setAttribute("readonly", "readonly")
    taskContainer.appendChild(task);
    let capitalizeChar = taskName.charAt(0).toUpperCase() + taskName.slice(1)
    task.value = `${capitalizeChar}`
    if (taskStatus == 1) {
        task.style.textDecoration = "line-through"
    }


    // Delate task button
    const delate = document.createElement("button");
    delate.innerHTML = `<i class="fas fa-times"></i>`
    delate.classList.add("remove-button")
    taskContainer.appendChild(delate)
    const allRemoveBtn = document.querySelectorAll(".newDivContainer .remove-button i")
    allRemoveBtn.forEach(btn => btn.addEventListener("click", removeTask))

    //Edit task button
    if (taskStatus == 0) {
        const edit = document.createElement("button");
        edit.innerHTML = `<i class="fas fa-pencil-alt"></i>`
        edit.classList.add("edit-button")
        taskContainer.appendChild(edit);
        const allEditBtn = document.querySelectorAll(".newDivContainer .edit-button i")
        allEditBtn.forEach(btn => btn.addEventListener("click", editTask))
    } else {

    }
    // Dates
    const startDate = document.createElement("span");
    if (taskEditDate == 0) {
        startDate.innerText = `Created: ${tasksDate(taskStartDate)}`;
    } else {
        startDate.innerText = `${generateDate(taskStartDate)}`
    }
    startDate.classList.add("date-of-creation");
    taskContainer.appendChild(startDate);

    const endDate = document.createElement("span");
    endDate.classList.add("end-of-creation")
    if (taskEndDate == 0) {
        endDate.innerText = ""
    } else {
        endDate.innerText = `Expiry date: ${tasksDate(taskEndDate)}`
    }

    taskContainer.appendChild(endDate)



    const timeToEnd = document.createElement("span")
    timeToEnd.classList.add("time-to-end");
    timeToEnd.innerText = taskCompare;
    taskContainer.appendChild(timeToEnd)
    updateSummary();
}





getLocalStorage();
clearListButton.addEventListener("click", clearTasks)
addTaskButton.addEventListener("click", createNewTask);
taskNameInput1.addEventListener("keyup", function (e) {
    let taskNameInput = document.querySelector(".userInput").value;
    let taskEndInput = document.querySelector(".date_end").value
    if (e.keyCode == 13) {
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
                taskStatus: 0,
                taskName: taskNameInput,
                taskStartDate: new Date(),
                taskEndDate: taskEndInput,
                taskEditDate: 0,
                taskId: new Date().getTime(),
            }
            taskList.push(newTask)
            localStorage.setItem("taskList", JSON.stringify(taskList));
            let capitalizeChar = taskNameInput.charAt(0).toUpperCase() + taskNameInput.slice(1);
            taskTemplate(newTask.taskStatus, capitalizeChar, newTask.taskStartDate.toISOString(), newTask.taskEndDate, newTask.taskEditDate, newTask.taskId, compareDates(newTask))
            setDefualt()
        }
    }
})
controler.addEventListener("input", function () {
    taskNameInput1.value != "" ? controler.classList.add("controlerGrow") : controler.classList.remove("controlerGrow")
})
allViewBtn.forEach(btn => btn.addEventListener("click", function () {
    for (let i = 0; i < allViewBtn.length; i++) {
        allViewBtn[i].classList.remove("activeView")
    }
    const allDivs = document.querySelectorAll(".newDivContainer");
    if (btn.dataset.view == "all") {
        btn.classList.add("activeView")
        allDivs.forEach(div => {
            div.classList.remove("hideElement")

        })
    } else if (btn.dataset.view == "done") {
        btn.classList.add("activeView")
        allDivs.forEach(div => {
            div.classList.remove("hideElement")
            if (div.dataset.status == 0) {
                div.classList.add("hideElement")
                updateSummary()
            }
        })
    } else if (btn.dataset.view == "pending") {
        btn.classList.add("activeView")
        allDivs.forEach(div => {
            div.classList.remove("hideElement")
            if (div.dataset.status == 1) {
                div.classList.add("hideElement")
                updateSummary()
            }
        })
    }
}))