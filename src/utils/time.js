export const getTimeString = (miliseconds) => {
    let seconds = miliseconds / 1000;
    var hour = 0, min = 0, sec = 0;
    if (sec >= 3600) {
        hour = Math.floor(seconds/3600);
        seconds = seconds % 3600;
    }

    min = Math.floor(seconds/60);
    seconds = seconds % 60;
    sec = Math.floor(seconds);

    let timeStr = '';
    if (hour) {
        timeStr = timeStr + (hour >= 10 ? `${hour}` : `0${hour}`) + ":";
    }

    timeStr = timeStr + (min >= 10 ? `${min}` : `0${min}`) + ":";
    timeStr = timeStr + (sec >= 10 ? `${sec}` : `0${sec}`);
    return timeStr;
}

export const today = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return `${y}-${m}-${d}`;
}

export const currentTimeStamp = (divider) => {
    const now = new Date();
    return  `${now.getMonth() + 1}${divider}${now.getDate()}${divider}${now.getFullYear()}${divider}${now.getHours()}${divider}${now.getMinutes()}${divider}${now.getSeconds()}`
}