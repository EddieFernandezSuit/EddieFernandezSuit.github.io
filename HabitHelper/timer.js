export class Timer{
    constructor(timeSeconds, onTimerUpdate, onTimerComplete){
        this.count = 0;
        this.interval = null;
        this.interval = setInterval(()=>{
            onTimerUpdate(this);
            this.count += 1;
            if(this.count >= timeSeconds){
                onTimerComplete(this);
                clearInterval(this.interval);
            }
        }, 1000);
    }
}