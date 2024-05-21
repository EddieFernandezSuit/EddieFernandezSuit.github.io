import { Timer } from './timer.js';
// import { KEY as process.env.GIST_KEY } from './secret.js';


// import {parse } from './csv-parse'
// const { parse } = require(['csv-parse']);
// const parse = csvParse.parse;
// const { parse } = csvParse;

// python -m http.server

const GIST_ID = '75701f3ca46165618b6c1689214c8e75';
const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

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

const ObjectToCSV = (data) => {
    if (!data.length) return '';

    const header = Object.keys(data[0]);
    return `${header.join(',')}\n${data.map(obj => header.map(key => obj[key] || '').join(',')).join('\n')}`;
};

function csvToObject(csvString) {
    const [header, ...rows] = csvString.trim().split('\n');
    const headers = header.split(',');
    return rows.map(row => {
        const values = row.split(',');
        return Object.fromEntries(headers.map((key, index) => [key, values[index]]));
    });
}

const saveToGist = (data, fileName) => {
    const csvContent = ObjectToCSV(data);

    fetch(GIST_API_URL, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + process.env.GIST_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            files: {
                [fileName]: {
                    content: csvContent,
                },
            },
        }),
    });
};

// const getGist = async (gistFileName) => {
//     let data = [];
//     try {
//         const response = await fetch(GIST_API_URL).then(response => response.response.json());
//         data = csvToObject(gistData.files[gistFileName].content);
//     } catch (error) {
//         console.error('Error loading data from Gist:', error);
//     }
//     return data;
// };

const getGist = async (gistFileName) => {
    let data = [];
    try {
        const response = await fetch(GIST_API_URL);
        const gistData = await response.json();
        data = csvToObject(gistData.files[gistFileName].content);
    } catch (error) {
        console.error('Error loading data from Gist:', error);
    }
    return data;
};

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

        let allTasksComplete = currentTaskIndex >= tasks.length;
        if(allTasksComplete){
            const totalSum = Math.round(Object.entries(newData).filter(([key, value]) => key !== 'Date' && key != 'Name' && key != 'Page').reduce((sum, [key, value]) => sum + Number(value), 0));
            newData.Total = totalSum;
            combinedData.push(newData)
            saveToGist(combinedData, 'combinedData.csv')
            displayDictionary(newData);
            return;
        }

        currentTask = tasks[currentTaskIndex];
        speak(currentTask.name)
        taskElement.textContent = currentTask['name']
        const isCurrentTaskTimer = currentTask.time > 0
        if(isCurrentTaskTimer){
            new Timer(tasks[currentTaskIndex].time, (timer) => {getElement("timerCounter").textContent = timer.count;}, nextTask);
        }
    }

    let formDisplay = false;

    const SECONDS_TO_MINUTES = 1

    const tasks = [
        {'name': 'Brush & Floss', 'time': 0},
        {'name': 'Exercise', 'time': SECONDS_TO_MINUTES * 5},
        {'name': 'Stretch 1', 'time': SECONDS_TO_MINUTES},
        {'name': 'Stretch 2', 'time': SECONDS_TO_MINUTES},
        {'name': 'Stretch 3', 'time': SECONDS_TO_MINUTES},
        {'name': 'Stretch 4', 'time': SECONDS_TO_MINUTES},
        {'name': 'Stretch 5', 'time': SECONDS_TO_MINUTES},
        {'name': 'Read', 'time': SECONDS_TO_MINUTES * 5},
        // {'name': 'Meditate', 'time': 60 * 4},
        // {'name': 'Optimize', 'time': 60 * 10},
        // {'name': 'Eat', 'time': 60 * 13},
    ]

    const [startButton, taskElement, bookNameAndPageNumber] = getElements("startButton", "currentTask", "bookNameAndPageNumber");
    const pastTime = {date: new Date()};
    let newData = {Date: getCurrentDate()};

    let currentTaskIndex = 0;
    let currentTask = tasks[currentTaskIndex];
    let combinedData = await getGist('combinedData.csv')

    taskElement.textContent = currentTask['name'];
    let lastReadInfo = combinedData[combinedData.length - 1];
    console.log(lastReadInfo)
    bookNameAndPageNumber.textContent = "Reading: " + lastReadInfo["Name"] + ", On Page: " + lastReadInfo["Page"];

    startButton.addEventListener("click", () => nextTask());
};

document.addEventListener("DOMContentLoaded", start);
