window.StringUtils = {

	/**
	 * ���� :���ڸ� �޸� ǥ��
	 * @param num
	 */
    numberWithCommas: function(num) {
        if (isNaN(num)) {
            throw new Error('�Ű������� �ùٸ��� �ʽ��ϴ�.');
            return false;
        }

        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * ��ġ�� ǥ���� ���ڿ����� ������ ��Ÿ���� ���ڴ� ����� ���ڸ� ����
     */
    getNumericFromString : function(str){

		str = str || '0';
		var exp = /[a-zA-Z]/g;
		return parseInt(str.replace(exp, ''));
	},

    /**
     * �и������带 ���˵� ���ڿ��� ��ȯ
     * @param time : milliseconds
     * @param format : ��ȯ�� ���ڿ� ����
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
            return StringUtils._toDigitString.call(this, parseInt((time / 1000) % 18600 / 3600));
        },
        // ��
        mm: function(time) {
            return StringUtils._toDigitString.call(this, parseInt((time / 1000) % 3600 / 60));
        },
        // ��
        ss: function(time) {
            return StringUtils._toDigitString.call(this, (time / 1000) % 60);
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

};//StringUtils
