/**
 * �쒗븳�쒓컙 愿�由�
 * @author Lee Sang Mi (2019.07.10)
 * @version 1.0.0
 * @see utils.StringUtil.js
 */
TimeManager = function(){
	
	this.version = '1.0.0';
	this.name = 'TimeManager';
	
	this.direction = null;
	this.options = null;
	
	this.timer = null;
	this.currentTime = 0;
};

TimeManager.prototype = {
		
		constructor : TimeManager,
		
		setup : function(options){
			
			//console.log('time control setup');
			
			this.stop();
			
			this.direction = null;
			
			this.options = $.extend(true, {
		        startTime: 0, // �쒖옉�쒓컙 milisecond
		        endTime: 0, // 醫낅즺�쒓컙 milisecond
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
	    	
	    	//console.log('stop----');
	    	
	        clearInterval(this.timer);
	        this.timer = null;
	    },
	    
	    display : function(){
	    	if (this.options.onProgress != 'undefined'){

	    		this.options.onProgress(StringUtils.makeTimeString(this.currentTime, this.options.displayFormat), this.currentTime);
	    	}
	    },
	    
	    _onInterval : function() {
	        //console.log(this.currentTime);

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