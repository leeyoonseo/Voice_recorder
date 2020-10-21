var TimeManager = function(){

	this.version = '2.0.0';
	this.name = 'TimeManager';

	this.direction = null;
	this.options = null;

	this.timer = null;
	this.currentTime = 0;
};

TimeManager.UTILS = {
	/**
     * �и������带 ���˵� ���ڿ��� ��ȯ
     * @param time : milliseconds
     * @param format : ��ȯ�� ���ڿ� ����
     */
    makeTimeString: function(time, format) {

        format = format || "mm:ss"; //"hh:mm:ss.ms";

        $.each(TimeManager.UTILS._timeFormat, function(type, fn) {

            var reg = new RegExp(type, 'g');

            if (reg.test(format)) {
                var timeStr = fn(time);
                format = format.replace(reg, timeStr);
            }
        });

        return format;
    },

    /**
     * ���ڸ��� ���� ǥ��
     */
    _toDigitString: function(num) {

        num = parseInt(num);
        if (num < 10) {
            return '0' + num;
        } else {
            return num + '';
        }
    },

    _timeFormat: {
    	// ��
        hh: function(time) {
            return TimeManager.UTILS._toDigitString.call(this, parseInt((time / 1000) % 18600 / 3600));
        },
        // ��
        mm: function(time) {
            return TimeManager.UTILS._toDigitString.call(this, parseInt((time / 1000) % 3600 / 60));
        },
        // ��
        ss: function(time) {
            return TimeManager.UTILS._toDigitString.call(this, (time / 1000) % 60);
        },
        // 1000���� 1��
        ms: function(time) {
            var ms = time % 1000 / 1000;
            if (ms == 0) return '0';
            return (ms.toString()).substring(2);
        },
        // 1000���� 1��(���ڸ�)
        m2s: function(time) {
        	var ms = time % 1000 / 1000;
        	if (ms == 0) return '00';

        	ms = ms.toFixed(2) * 100;
        	return ms;
        },
        // 1000���� 1��(���ڸ�)
        m3s: function(time) {
        	var ms = time % 1000 / 1000;
        	if (ms == 0) return '000';

        	ms = ms.toFixed(3) * 1000;
        	return ms;
        },

        h: function(time) {
            return parseInt((time / 1000) % 18600 / 3600);
        },
        m: function(time) {
            return parseInt((time / 1000) % 3600 / 60);
        },
        s: function(time) {
            return parseInt(time / 1000) % 60;
        }
    }
}

TimeManager.prototype = {

		constructor : TimeManager,

		setup : function(options){

			this.stop();

			this.direction = null;

			this.options = $.extend(true, {
		        startTime: 0, // ���۽ð� milisecond
		        endTime: 0, // ����ð� milisecond
		        intervalGap: 1000,
		        displayFormat: 'hh:mm:ss.ms',
		        onProgress: null,
		        onComplete: null

		    }, options);

		    if (this.options.startTime < this.options.endTime) {
		    	this.direction = 'up';
		    } else if (this.options.startTime > this.options.endTime) {
		    	this.direction = 'down';
		    } else {
		    	return;
		    }

		    this.currentTime = this.options.startTime;

		    this.display();
		},

		start : function() {

			var that = this;

			if(!this.direction) {
	    		return;

	    	} else if(this.direction == 'up' && this.currentTime >= this.options.endTime) {
	    		return;

	    	} else if(this.direction == 'down' && this.currentTime <= this.options.endTime) {
	    		return;
	    	}

            this.timer = setInterval(function() {
            	that._onInterval();

            }, this.options.intervalGap);
	    },

	    stop : function() {

	        clearInterval(this.timer);
	        this.timer = null;
	    },

	    display : function(){
	    	if (this.options.onProgress != 'undefined'){

	    		this.options.onProgress(TimeManager.UTILS.makeTimeString(this.currentTime, this.options.displayFormat), this.currentTime);
	    	}
	    },

	    _onInterval : function() {
	        if (this.direction == 'up') {

	        	this.currentTime += this.options.intervalGap;

	            if (this.currentTime >= this.options.endTime) {
	            	this.stop();

	            	if(this.options.onComplete != 'undefined'){
	            		this.options.onComplete();
	            	}
	            }

	        } else {

	        	this.currentTime -= this.options.intervalGap;

	            if (this.currentTime <= this.options.endTime) {
	                this.stop();

	                if(this.options.onComplete != 'undefined'){
	                	this.options.onComplete();
	                }
	            }
	        }

	    	this.display();
	    },

};
