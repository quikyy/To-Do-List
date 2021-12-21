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
    let x = Math.floor(Math.random() * task_input_placeholders.length);
    console.log(x)
    taskNameInput1.placeholder = task_input_placeholders[x]
    taskNameInput1.value = ""
    taskEndInput1.value = ""
    controler.classList.remove("controlerGrow")
}
