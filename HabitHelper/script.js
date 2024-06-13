import { Timer } from './timer.js';
import { Gist } from './gist.js'

// python -m http.server

const GIST_ID = '75701f3ca46165618b6c1689214c8e75';
const GIST_FILE_NAME = 'combinedData.csv'

function getElement(id){
    return document.getElementById(id);
}

function getElements(...ids) {
    return ids.map(getElement).filter(element => element)
}

function displayDictionary(dictionary) {
    const [container] = getElements('dictionaryContainer')
    const list = document.createElement('ul');

    for (const key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${key}: ${dictionary[key]}`;
        list.appendChild(listItem);
      }
    }

    container.appendChild(list);
}

function calculateMinutesElapsed(pastTime){
    let minutes = Math.round(((new Date() - pastTime.date) / 1000) / 60).toString();
    pastTime.date = new Date();
    return minutes
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function speak(text) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

const start = async () => {
    const nextTask = () => {
        if (currentTask.name === 'Read' && !formDisplay) {
            speak('Read Complete')
            const [bookInfoElement, submitBookInfoButton, bookNameElement, currentPageElement] = getElements('bookInfo', 'submitBookInfo', 'bookName', 'currentPage');
            bookInfoElement.style.display = 'block';
            submitBookInfoButton.addEventListener('click', () => {
                [newData.Name, newData.Page] = [bookNameElement, currentPageElement].map(e => e.value);
                bookInfoElement.style.display = 'none';
                formDisplay = true;
                nextTask();
            });
            return;
        }

        newData[currentTask.name] = calculateMinutesElapsed(pastTime);
        currentTaskIndex += 1;

        let allTasksComplete = currentTaskIndex >= Object.keys(tasks).length;
        if(allTasksComplete){
            const totalSum = Math.round(Object.entries(newData).filter(([key, value]) => key !== 'Date' && key != 'Name' && key != 'Page').reduce((sum, [key, value]) => sum + Number(value), 0));
            newData.Total = totalSum;
            combinedData.push(newData)
            gist.save(combinedData, GIST_FILE_NAME)
            displayDictionary(newData);
            return;
        }

        currentTask = Object.keys(tasks)[currentTaskIndex];
        speak(currentTask)
        taskElement.textContent = currentTask
        const isCurrentTaskTimer = tasks[currentTask] > 0
        if(isCurrentTaskTimer){
            new Timer(tasks[currentTask], (timer) => {getElement("timerCounter").textContent = timer.count;}, nextTask);
        }
    }

    let formDisplay = false;

    const SECONDS_TO_MINUTES = 60

    const tasks = {
        'Teeth & Weight': 0,
        'Exercise 1': 0,
        'Stretch 1': SECONDS_TO_MINUTES,
        'Exercise 2': 0,
        'Stretch 2': SECONDS_TO_MINUTES,
        'Stretch 3': SECONDS_TO_MINUTES,
        'Exercise 3': 0,
        'Stretch 4': SECONDS_TO_MINUTES,
        'Stretch 5': SECONDS_TO_MINUTES,
        'Read': SECONDS_TO_MINUTES * 2,
    }

    const [startButton, taskElement, bookNameAndPageNumber] = getElements("startButton", "currentTask", "bookNameAndPageNumber");
    const pastTime = {date: new Date()};
    let newData = {Date: getCurrentDate()};

    let currentTaskIndex = 0;
    let currentTask = Object.keys(tasks)[currentTaskIndex];
    const gist =  new Gist(GIST_ID)
    let combinedData = await gist.get(GIST_FILE_NAME)

    taskElement.textContent = currentTask['name'];
    let lastReadInfo = combinedData[combinedData.length - 1];
    console.log(lastReadInfo)
    bookNameAndPageNumber.textContent = "Reading: " + lastReadInfo["Name"] + ", On Page: " + lastReadInfo["Page"];

    startButton.addEventListener("click", () => nextTask());
};

document.addEventListener("DOMContentLoaded", start);
