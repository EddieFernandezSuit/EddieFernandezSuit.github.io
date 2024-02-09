

import { Timer } from './timer.js';
// import dotenv from 'dotenv';
// dotenv.config();


function displayDictionary(dictionary) {
    const container = document.getElementById('dictionaryContainer');
    const list = document.createElement('ul');

    // Iterate over the dictionary and create list items
    for (const key in dictionary) {
      if (dictionary.hasOwnProperty(key)) {
        const listItem = document.createElement('li');
        listItem.textContent = `${key}: ${dictionary[key]}`;
        list.appendChild(listItem);
      }
    }

    // Append the list to the container
    container.appendChild(list);
}

function calculateMinutesElapsed(pastTime){
    let minutes = ((new Date() - pastTime.date) / 1000) / 60;
    pastTime.date = new Date();
    return Math.round(minutes).toString();
}

const GIST_ID = '75701f3ca46165618b6c1689214c8e75'; // Replace with your Gist ID
const GIST_API_URL = `https://api.github.com/gists/${GIST_ID}`;

const convertToCSV = (data) => {
    const header = Object.keys(data[0]);
    const rows = data.map(obj => {
        const values = header.map(key => obj[key] || ''); // Use empty string if property is not present
        return values.join(',');
    });

    return `${header.join(',')}\n${rows.join('\n')}`;
};

const saveToGist = (data, fileName) => {
    const csvContent = convertToCSV(data);
    const KEY = "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";

    fetch(GIST_API_URL, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + KEY
            , // Replace with your GitHub token
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

const loadFromGist = async (gistFileName) => {
    try {
        const response = await fetch(GIST_API_URL);
        const gistData = await response.json();
        const csvContent = gistData.files[gistFileName].content;
        
        // Convert CSV to array of objects
        const rows = csvContent.trim().split('\n');
        const header = rows[0].split(',');
        const data = rows.slice(1).map(row => {
            const values = row.split(',');
            return header.reduce((obj, key, index) => {
                obj[key] = values[index];
                return obj;
            }, {});
        });

        return data;
    } catch (error) {
        console.error('Error loading data from Gist:', error);
        return [];
    }
};

function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

function playSound(){
    const soundFile = 'nice.mp3'
    const audio = new Audio('nice.mp3');
    audio.play();
}

function updateTimeElement(timer){
    const timerCounterElement = document.getElementById("timerCounter");
    timerCounterElement.textContent = timer.count;
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}


const initializeTimer = async () => {
    const nextTask = () => {
        taskTime[tasks[currentTask.index].name] = calculateMinutesElapsed(pastTime);
        currentTask.index += 1;
        let allTasksComplete = currentTask.index >= tasks.length;
        if(allTasksComplete){
            const totalSum = Math.round(Object.entries(taskTime)
                .filter(([key, value]) => key !== 'Date')
                .reduce((sum, [key, value]) => sum + Number(value), 0));

            taskTime['Total'] = totalSum;
            taskData.push(taskTime);
            saveToGist(taskData, 'taskTime.csv')
            displayDictionary(taskTime);
            return;
        }
        speak(tasks[currentTask.index].name)
        const taskElement = document.getElementById("currentTask");
        taskElement.textContent = tasks[currentTask.index]['name']
        if(tasks[currentTask.index].time > 0){
            new Timer(tasks[currentTask.index].time, updateTimeElement, startNextTask)
        }
    }


    const startNextTask = () => {
        updateTimeElement({count: 0})
        if (tasks[currentTask.index].name === 'Read') {
            speak('Read Complete')
            // Display input boxes for book information
            const bookInfoElement = document.getElementById('bookInfo');
            bookInfoElement.style.display = 'block';
            const submitBookInfoButton = document.getElementById('submitBookInfo');
            submitBookInfoButton.addEventListener('click', () => {
                const bookName = document.getElementById('bookName').value;
                const currentPage = document.getElementById('currentPage').value;
                bookData.push({
                    Date: getCurrentDate(),
                    Name: bookName,
                    Page: currentPage,
                });
                saveToGist(bookData, 'bookData.csv');

                bookInfoElement.style.display = 'none';
                nextTask();
            });
            return;
        }
        nextTask();
    }


    const tasks = [
        {'name': 'Wake Up', 'time': 0},
        {'name': 'Weight', 'time': 0},
        {'name': 'Brush & Floss', 'time': 0},
        {'name': 'Exercise', 'time': 0},
        {'name': 'Stretch 1', 'time': 60},
        {'name': 'Stretch 2', 'time': 60},
        {'name': 'Stretch 3', 'time': 60},
        {'name': 'Stretch 4', 'time': 60},
        {'name': 'Stretch 5', 'time': 60},
        {'name': 'Read', 'time': 60 * 2},
        {'name': 'Write', 'time': 60 * 1},
        {'name': 'Meditate', 'time': 60 * 5},
        {'name': 'Outside', 'time': 0},
        {'name': 'Clean', 'time': 60 * 0},
        {'name': 'Optimize', 'time': 60 * 10},
        {'name': 'Eat', 'time': 60 * 13},
    ]

    // const tasks = [
    //     {'name': 'Wake Up', 'time': 0},
    //     {'name': 'Weight', 'time': 0},
    //     {'name': 'Brush & Floss', 'time': 0},
    //     {'name': 'Exercise', 'time': 0},
    //     {'name': 'Stretch 1', 'time': 0},
    //     {'name': 'Stretch 2', 'time': 0},
    //     {'name': 'Stretch 3', 'time': 0},
    //     {'name': 'Stretch 4', 'time': 0},
    //     {'name': 'Stretch 5', 'time': 10},
    //     {'name': 'Read', 'time': 1 * 3},
    //     {'name': 'Write', 'time': 10 * 1},
    //     {'name': 'Meditate', 'time': 0 * 5},
    //     {'name': 'Outside', 'time': 0},
    //     {'name': 'Clean', 'time': 0 * 0},
    //     {'name': 'Optimize', 'time': 0 * 10},
    //     {'name': 'Eat', 'time': 0 * 13},
    // ]

    const pastTime = {date: new Date()};
    const taskTime = {Date: getCurrentDate()};
    const currentTask = {index: 0}
    const startButton = document.getElementById("startButton");
    const taskElement = document.getElementById("currentTask");
    taskElement.textContent = tasks[0]['name'];
    let taskData = await loadFromGist('taskTime.csv');
    let bookData = await loadFromGist('bookData.csv');

    startButton.addEventListener("click", () => startNextTask());
};

document.addEventListener("DOMContentLoaded", initializeTimer);
