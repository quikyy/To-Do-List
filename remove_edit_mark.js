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

function markDone(e) {
    let taskContainer = e.target.parentNode.parentNode;
    let findTaskId = taskContainer.dataset.id;
    let findStatus = taskContainer.dataset.status;
    let doneBtn = taskContainer.querySelector(".mark-button")
    let input = taskContainer.querySelector("input")
    if (findStatus == 0) {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].taskId == findTaskId) {
                taskList[taskList.indexOf(taskList[i])].taskStatus = 1;
                taskContainer.dataset.status = 1;
                input.style.textDecoration = "line-through"
                doneBtn.innerHTML = `<i class="fas fa-check-circle"></i>`
                localStorage.setItem("taskList", JSON.stringify(taskList));
                taskContainer = null;
            }
        }
    } else if (findStatus == 1) {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].taskId == findTaskId) {
                taskList[taskList.indexOf(taskList[i])].taskStatus = 0;
                taskContainer.dataset.status = 0;
                input.style.textDecoration = "";
                doneBtn.innerHTML = `<i class="far fa-check-circle"></i>`
                localStorage.setItem("taskList", JSON.stringify(taskList));
            }
        }
    }
    updateSummary();
}

