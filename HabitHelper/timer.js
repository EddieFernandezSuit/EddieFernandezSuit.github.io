export class Timer{
    constructor(timeSeconds, onTimerUpdate, onTimerComplete){
        this.count = 0;
        this.interval = null;
        this.interval = setInterval(()=>{
            this.count += 1
            onTimerUpdate()
            if(this.count >= timeSeconds){
                clearInterval(this.interval);
                onTimerComplete(this);
            }
        }, 1000);
    }
}