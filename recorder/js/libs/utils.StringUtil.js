/**
 * String 유틸
 * @author Lee Sang Mi(2019.07.10)
 * @version 1.0.0
 */
window.StringUtils = {

	/**
	 * 숫자 :세자리 콤마 표현
	 * @param num
	 */
    numberWithCommas: function(num) {
        if (isNaN(num)) {
            throw new Error('매개변수가 올바르지 않습니다.');
            return false;
        }

        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * 수치를 표현한 문자열에서 단위를 나타내는 문자는 떼어내고 숫자만 리턴
     */
    getNumericFromString : function(str){

		str = str || '0';
		var exp = /[a-zA-Z]/g;
		return parseInt(str.replace(exp, ''));
	},

    /**
     * 밀리세컨드를 포맷된 문자열로 반환
     * @param time : milliseconds
     * @param format : 반환할 문자열 형식
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
     * 두자리수 숫자 표현
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
    	// 시
        hh: function(time) {
            return StringUtils._toDigitString.call(this, parseInt((time / 1000) % 18600 / 3600));
        },
        // 분
        mm: function(time) {
            return StringUtils._toDigitString.call(this, parseInt((time / 1000) % 3600 / 60));
        },
        // 초
        ss: function(time) {
            return StringUtils._toDigitString.call(this, (time / 1000) % 60);
        },
        // 1000분의 1초
        ms: function(time) {
            var ms = time % 1000 / 1000;
            if (ms == 0) return '0';
            return (ms.toString()).substring(2);
        },
        // 1000분의 1초(두자리)
        m2s: function(time) {
        	var ms = time % 1000 / 1000;
        	if (ms == 0) return '00';

        	ms = ms.toFixed(2) * 100;
        	return ms;
        },
        // 1000분의 1초(세자리)
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
