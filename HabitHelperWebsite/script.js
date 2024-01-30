const setTimerCount = (timer, newCount) =>{
    timer.count = newCount
    const timerCounterElement = document.getElementById("timerCounter");
    timerCounterElement.textContent = timer.count
}

const timer = (timeSeconds, timerCompleteAction) => {
    const timer = {
        count: 0,
        interval: null,
    };

    timer.interval = setInterval(() => {
        setTimerCount(timer, timer.count + 1)
        if(timer.count >= timeSeconds){
            timerCompleteAction(timer)
        }
    }, 1000);
}

const initializeTimer = () => {
    const tasks = [
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
    //     {'name': 'Weight', 'time': 1},
    //     {'name': 'Brush & Floss', 'time': 0},
    //     {'name': 'Exercise', 'time': 0},
    //     {'name': 'Stretch 1', 'time': 0},
    //     {'name': 'Stretch 2', 'time': 0},
    //     {'name': 'Stretch 3', 'time': 0},
    //     {'name': 'Stretch 4', 'time': 0},
    //     {'name': 'Stretch 5', 'time': 0},
    //     {'name': 'Read', 'time': 0 * 2},
    //     {'name': 'Write', 'time': 0 * 1},
    //     {'name': 'Meditate', 'time': 0 * 5},
    //     {'name': 'Outside', 'time': 0},
    //     {'name': 'Clean', 'time': 0 * 0},
    //     {'name': 'Optimize', 'time': 0 * 10},
    //     {'name': 'Eat', 'time': 0 * 13},
    // ]

    const pastTime = {date: new Date()};
    const taskTimeData = {};

    const currentTask = {index: 0}
    const startButton = document.getElementById("startButton");
    const taskElement = document.getElementById("currentTask");
    taskElement.textContent = tasks[0]['name']

    // localStorage.setItem('timeData', [])
    let td = localStorage.getItem('timeData');
    let timeData;
    if(td){
        timeData = JSON.parse(td);
    }else{
        timeData = []
    }

    console.log(timeData);

    const timerCompleteAction = (timer) => {
        const audio = new Audio('beep.mp3')
        audio.play()
        setTimerCount(timer, 0);
        clearInterval(timer.interval);
        updateNextTask(currentTask, tasks);
    }

    const updateNextTask = (currentTask, tasks) => {
        if(currentTask.index + 1 >= tasks.length){
            timeData.push(taskTimeData);
            localStorage.setItem('timeData', JSON.stringify(timeData));
            return;
        }
        currentTask.index += 1
        const taskElement = document.getElementById("currentTask");
        taskElement.textContent = tasks[currentTask.index]['name']
        if(tasks[currentTask.index].time > 0){
            timer(tasks[currentTask.index].time, timerCompleteAction)
        }
    }

    const getMinutesElapsed = (pastTime) => {
        let minutes = ((new Date() - pastTime.date) / 1000) / 60;
        pastTime.date = new Date();
        return minutes.toFixed(2);
    }

    const onClickStartButton = () => {
        taskTimeData[tasks[currentTask.index].name] = getMinutesElapsed(pastTime);


        if(tasks[currentTask.index]['time'] === 0)
        {
            updateNextTask(currentTask, tasks);
        }
        else 
        {
            timer(tasks[currentTask.index]['time'], timerCompleteAction)
        }
    }

    // Event listener for the button click
    startButton.addEventListener("click", onClickStartButton);
};

document.addEventListener("DOMContentLoaded", initializeTimer);
