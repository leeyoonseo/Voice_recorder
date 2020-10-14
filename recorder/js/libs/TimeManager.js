"use strict";
class TimeManager {
    constructor(options) {
        this.name = "TimeManager";
        this.version = "1.0.0";
        const self = this;
        this.timerOptions = Object.assign({
            startTime: 0,
            endTime: 0,
            intervalGap: 1000,
            displayFormat: 'hh:mm:ss.ms',
            onProgress: null,
            onComplete: null
        }, options);
        this.direction = null;
        this.timer = null;
        this.currentTime = 0;
        this.stop();
        const { startTime, endTime } = this.timerOptions;
        if (startTime < endTime) {
            this.direction = 'up';
        }
        else if (startTime > endTime) {
            this.direction = 'down';
        }
        else {
            return;
        }
        this.currentTime = startTime;
        this.timeFormat = {
            // 시
            hh: function (time) {
                return self.toDigitString.call(this, parseInt((time / 1000) % 18600 / 3600));
            },
            // 분
            mm: function (time) {
                return self.toDigitString.call(this, parseInt((time / 1000) % 3600 / 60));
            },
            // 초
            ss: function (time) {
                return self.toDigitString.call(this, (time / 1000) % 60);
            },
            // 1000분의 1초
            ms: function (time) {
                let ms = time % 1000 / 1000;
                if (ms == 0)
                    return '0';
                return (ms.toString()).substring(2);
            },
            // 1000분의 1초(두자리)
            m2s: function (time) {
                let ms = time % 1000 / 1000;
                if (ms == 0)
                    return '00';
                ms = ms.toFixed(2) * 100;
                return ms;
            },
            // 1000분의 1초(세자리)
            m3s: function (time) {
                var ms = time % 1000 / 1000;
                if (ms == 0)
                    return '000';
                ms = ms.toFixed(3) * 1000;
                return ms;
            },
            h: function (time) {
                return parseInt((time / 1000) % 18600 / 3600);
            },
            m: function (time) {
                return parseInt((time / 1000) % 3600 / 60);
            },
            s: function (time) {
                return parseInt(time / 1000) % 60;
            },
        };
        this.display();
        return this;
    }
    start() {
        var that = this;
        if (!this.direction) {
            return;
        }
        else if (this.direction == 'up' && this.currentTime >= this.timerOptions.endTime) {
            return;
        }
        else if (this.direction == 'down' && this.currentTime <= this.timerOptions.endTime) {
            return;
        }
        this.timer = setInterval(function () {
            that.setInterval();
        }, this.timerOptions.intervalGap);
        return this;
    }
    stop() {
        clearInterval(this.timer);
        this.currentTime = 0;
        this.timer = null;
        return this;
    }
    display() {
        if (this.timerOptions.onProgress != 'undefined') {
            this.timerOptions.onProgress(this.makeTimeString(this.currentTime, this.timerOptions.displayFormat), this.currentTime);
        }
        return this;
    }
    toDigitString(num) {
        num = parseInt(num);
        if (num < 10) {
            return '0' + num;
        }
        else {
            return num + '';
        }
    }
    setInterval() {
        if (this.direction == 'up') {
            this.currentTime += this.timerOptions.intervalGap;
            if (this.currentTime >= this.timerOptions.endTime) {
                this.stop();
                if (this.timerOptions.onComplete != 'undefined') {
                    this.timerOptions.onComplete();
                }
            }
        }
        else {
            this.currentTime -= this.timerOptions.intervalGap;
            if (this.currentTime <= this.timerOptions.endTime) {
                this.stop();
                if (this.timerOptions.onComplete != 'undefined') {
                    this.timerOptions.onComplete();
                }
            }
        }
        this.display();
        return this;
    }
    makeTimeString(time, format) {
        format = format || "mm:ss"; //"hh:mm:ss.ms";
        $.each(this.timeFormat, function (type, fn) {
            var reg = new RegExp(type, 'g');
            if (reg.test(format)) {
                var timeStr = fn(time);
                format = format.replace(reg, timeStr);
            }
        });
        return format;
    }
}
//# sourceMappingURL=index.js.map