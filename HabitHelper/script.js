import { Timer } from './timer.js';
import { Gist } from './gist.js'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { getDatabase, ref, onValue, set, get} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBflwlpD1pOMz-3k3CuTpa61L_VN7z4Qwc",
  authDomain: "habit-helper-c652e.firebaseapp.com",
  databaseURL: "https://habit-helper-c652e-default-rtdb.firebaseio.com",
  projectId: "habit-helper-c652e",
  storageBucket: "habit-helper-c652e.firebasestorage.app",
  messagingSenderId: "623644274775",
  appId: "1:623644274775:web:d3b6d39a01634dc3c3f312",
  measurementId: "G-5P2V9K229Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

const habitHelperRef = ref(db, "habit helper");

// python -m http.server

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

function getExerciseCategory() {
    const exerciseCategories = ['Core', 'Biceps', 'Triceps', 'Chest', 'Shoulders', 'Back', 'Legs', 'Cardio', 'Chest'];
    const today = new Date();
    const day = today.getDate();
    const categoryIndex = (day - 1) % exerciseCategories.length;
    return exerciseCategories[categoryIndex];
}

const start = async () => {
    let allTimes = 10
    get(habitHelperRef).then((snapshot)=>{
        if(snapshot.exists()){
            allTimes = snapshot.val;
        }
            
            
    set(habitHelperRef, allTimes + 2)
    
    const nextTask = () => {
        if (currentTask === 'Read' && !formDisplay) {
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

        newData[currentTask] = calculateMinutesElapsed(pastTime);
        currentTaskIndex += 1;

        let allTasksComplete = currentTaskIndex >= Object.keys(tasks).length;
        if(allTasksComplete){
            const totalSum = Math.round(Object.entries(newData).filter(([key, value]) => key !== 'Date' && key != 'Name' && key != 'Page').reduce((sum, [key, value]) => sum + Number(value), 0));
            newData.Total = totalSum;
            combinedData.push(newData)
            // gist.save(combinedData, GIST_FILE_NAME)
            displayDictionary(newData);
            return;
        }

        currentTask = Object.keys(tasks)[currentTaskIndex];
        speak(currentTask)
        taskElement.textContent = currentTask
        const isCurrentTaskTimer = tasks[currentTask] > 0

        
        if(currentTimer){
            currentTimer.stop()
        }
        
        if(isCurrentTaskTimer){
            currentTimer = new Timer(tasks[currentTask], (timer) => {getElement("timerCounter").textContent = timer.count;}, nextTask);
        }
    }

    let formDisplay = false;
    let currentTimer = null;

    const SECONDS_TO_MINUTES = 60;
    const STRETCH_TIME = 30
    const ALL_TIMES = allTimes;
    const MANUAL = 0;

    const tasks = {
        'Weight': MANUAL,
        'Teeth': MANUAL,
        'Read': MANUAL,
        'Stretch 1': STRETCH_TIME,
        'Stretch 2': STRETCH_TIME,
        'Stretch 3': STRETCH_TIME,
        'Stretch 4': STRETCH_TIME,
        'Stretch 5': STRETCH_TIME,
        'Stretch 6': STRETCH_TIME,
        'Stretch 7': STRETCH_TIME,
        'workout': ALL_TIMES,
        'walk': ALL_TIMES,
        'clean': ALL_TIMES,
        'meditate': ALL_TIMES,
        'fernandez cards': ALL_TIMES,
        'apply': MANUAL,
        'take creatine': MANUAL,
        'schedule': ALL_TIMES,
    }
    // const gist =  new Gist()

    const TASK_FILENAME = 'tasks.json';
    // gist.save(tasks, TASK_FILENAME);

    const [startButton, taskElement, bookNameAndPageNumber] = getElements("startButton", "currentTask", "bookNameAndPageNumber");
    const pastTime = {date: new Date()};
    let newData = {Date: getCurrentDate()};

    let currentTaskIndex = 0;
    let currentTask = Object.keys(tasks)[currentTaskIndex];

    // let combinedData = await gist.get(GIST_FILE_NAME)
    // console.log(combinedData)

    const exerciseCategory = getExerciseCategory(combinedData);
    newData['Exercise Category'] = exerciseCategory;
    const exerciseCategoryElement = getElement('exerciseCategory');
    exerciseCategoryElement.textContent = "Exercise Category: " + exerciseCategory;

    taskElement.textContent = currentTask['name'];
    let lastReadInfo = combinedData[combinedData.length - 1];
    console.log(lastReadInfo)
    bookNameAndPageNumber.textContent = "Reading: " + lastReadInfo["Name"] + ", On Page: " + lastReadInfo["Page"];

    startButton.addEventListener("click", () => nextTask());
};

document.addEventListener("DOMContentLoaded", start);
