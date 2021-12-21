// Main controler
const controler = document.querySelector(".controler")
const addTaskButton = document.querySelector(".add-btn")
// UserInput
let taskNameInput1 = document.querySelector(".userInput")
let taskEndInput1 = document.querySelector(".date_end")
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
let task_input_placeholders = ["Enter your daily task, for example: Go to the gym.", "Enter your daily task, for example: Go for a walk.", "Enter your daily task, for example: Schedule a work meeting.", "Enter your daily task, for example: Clean whole house."]
const monthsList = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]