function updateSummary() {
    let completed = 0;
    let pending = 0;
    if (taskList.length > 0) {
        function calculateSummary() {
            let getLocalTaskList = JSON.parse(localStorage.getItem("taskList"))
            taskList = getLocalTaskList;
            howManyTotal.innerText = `Total: ${taskList.length}`
            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i].taskStatus == 0) {
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

function clearTasks() {
    taskList = [];
    localStorage.removeItem("taskList")
    ulList.innerText = ""
    updateSummary();
}

function setDefualt() {
    taskNameInput1.value = ""
    taskEndInput1.value = ""
    controler.classList.remove("controlerGrow")
}
