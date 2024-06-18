export class Timer{
    constructor(timeSeconds, onTimerUpdate, onTimerComplete){
        this.count = 0;
        this.timeSeconds = timeSeconds
        this.interval = null;
        this.interval = setInterval(()=>{
            this.count += 1
            onTimerUpdate(this)
            if(this.count >= this.timeSeconds){
                clearInterval(this.interval);
                onTimerComplete(this);
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.count = 0;
    }
}