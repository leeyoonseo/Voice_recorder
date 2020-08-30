/**
 * String �좏떥
 * @author Lee Sang Mi(2019.07.10)
 * @version 1.0.0
 */
window.StringUtils = {

	/**
	 * �レ옄 :�몄옄由� 肄ㅻ쭏 �쒗쁽 
	 * @param num 
	 */
    numberWithCommas: function(num) {
        if (isNaN(num)) {
            throw new Error('留ㅺ컻蹂��섍� �щ컮瑜댁� �딆뒿�덈떎.');
            return false;
        }

        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * �섏튂瑜� �쒗쁽�� 臾몄옄�댁뿉�� �⑥쐞瑜� �섑��대뒗 臾몄옄�� �쇱뼱�닿퀬 �レ옄留� 由ы꽩
     */
    getNumericFromString : function(str){
		
		str = str || '0';
		var exp = /[a-zA-Z]/g;
		return parseInt(str.replace(exp, ''));
	},
    
    /**
     * 諛�由ъ꽭而⑤뱶瑜� �щ㎎�� 臾몄옄�대줈 諛섑솚
     * @param time : milliseconds
     * @param format : 諛섑솚�� 臾몄옄�� �뺤떇
     */
    makeTimeString: function(time, format) {

        format = format || "mm:ss"; //"hh:mm:ss.ms";

        $.each(StringUtils._timeFormat, function(type, fn) {

            var reg = new RegExp(type, 'g');
            
            if (reg.test(format)) {
                var timeStr = fn(time);
                format = format.replace(reg, timeStr);
            }
        });

        return format;
    },

    /**
     * �먯옄由ъ닔 �レ옄 �쒗쁽 
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
            return StringUtils._toDigitString.call(this, parseInt((time / 1000) % 18600 / 3600));
        },
        // 遺�
        mm: function(time) {
            return StringUtils._toDigitString.call(this, parseInt((time / 1000) % 3600 / 60));
        },
        // 珥�
        ss: function(time) {
            return StringUtils._toDigitString.call(this, (time / 1000) % 60);
        },
        // 1000遺꾩쓽 1珥�
        ms: function(time) {
            var ms = time % 1000 / 1000;
            if (ms == 0) return '0';
            return (ms.toString()).substring(2);
        },
        // 1000遺꾩쓽 1珥�(�먯옄由�)
        m2s: function(time) {
        	var ms = time % 1000 / 1000;
        	if (ms == 0) return '00';
        	
        	ms = ms.toFixed(2) * 100;
        	return ms;
        },
        // 1000遺꾩쓽 1珥�(�몄옄由�)
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

};//StringUtils