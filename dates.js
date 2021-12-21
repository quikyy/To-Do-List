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
    let properDate = `Edited: ${getDate} ${monthsList[getMonth + 1]} ${getYear}, ${getHour}:${getMin}`
    return properDate;
}
function compareDates(x) {
    const task = x
    let infoText = ""
    if (task.taskEndDate == 0) {
        return infoText;
    }
    let today_date = new Date().getTime();
    const end_date = new Date(task.taskEndDate)
    const time_to_end = end_date - today_date
    const oneDay = 24 * 60 * 60 * 1000
    const oneHour = 60 * 60 * 1000
    const oneMin = 60 * 1000

    let days = Math.floor(time_to_end / oneDay)
    let hours = Math.floor((time_to_end % oneDay) / oneHour);
    let mins = Math.floor((time_to_end % oneHour) / oneMin);
    let sec = Math.floor((time_to_end % oneMin) / 1000)
    return infoText = (`Time left: ${days} days ${hours} hours ${mins} minutes ${sec} secs`)
}

function seeEndTime(e) {
    // if (e.target.classList.contains("end-of-creation")) {
    //     let taskContainer = e.target.parentNode;
    //     let findTaskId = taskContainer.dataset.id;
    //     let timeLeft = taskContainer.querySelector(".time-to-end")
    //     let index;
    //     for (let i = 0; i < taskList.length; i++) {
    //         if (findTaskId == taskList[i].taskId) {
    //             index = taskList.indexOf(taskList[i])
    //             let myInterval = setInterval(function () {
    //                 compareDates(taskList[index]);
    //                 timeLeft.innerText = (compareDates(taskList[index]))
    //             }, 1000)
    //             setTimeout(function () {
    //                 clearInterval(myInterval);
    //                 console.log("xd")
    //             },2000)
    //         }
    //     }
    // } 
}