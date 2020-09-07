/**
 * browser check
 * @author Lee Sang-Mi(2019.04.26)
 * @update Lee Yoon-Seo(2019.09.06)
 * @version 2.0.2
 */
window.CheckBrowser = (function(){

	var _agent;

	function _onInit(){

		_agent = {
            platform : _getPlatform().platform,
            version : _getPlatform().version,

			isAndroid: /Android/.test(navigator.userAgent),
			isIOS: /(iPhone|iPad|iPod)/.test(navigator.platform),
			isNaver: /NAVER\(inapp/.test(navigator.userAgent),

			isCordova: !!window.cordova,

			isFirefox: /Firefox/.test(navigator.userAgent),
			isChrome: /Google Inc/.test(navigator.vendor),
			isChromeIOS: /CriOS/.test(navigator.userAgent),
			isChromiumBased: !!window.chrome && !/Edge/.test(navigator.userAgent),
			isWhale: /Whale/.test(navigator.userAgent),
			isEdge: /Edge/.test(navigator.userAgent),
			isIE: /Trident/.test(navigator.userAgent),
			isOpera: /OPR\//.test(navigator.userAgent),
			isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),

			isTouchScreen: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
			isWebComponentsSupported: 'registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template')
        };

        var _element = document.getElementsByTagName( 'html' )[0];
		var _browser = _getBrowser();
		var _className = _element.className;

		_element.className += _className == '' ? _browser : " " + _browser;
		_element.className += _agent.platform !== "" ? " " + _agent.platform : "";
        _element.className += _agent.isNaver ? ' naver-inapp' : '';

       // data-version 삽입
       if(_agent.version !== '') _element.dataset.version = _agent.version;
	};

	function _getBrowser(){

		var _browser;

		if(_agent.isWhale) {
	    	_browser = 'whale';

	    } else if(_agent.isOpera){
	    	_browser = 'opera';

	    } else if(_agent.isFirefox){
	    	_browser = 'firefox';

	    } else if(_agent.isChrome || _agent.isChromeIOS){
	    	_browser = 'chrome';

	    } else if(_agent.isSafari){
	    	_browser = 'safari';

	    } else if(_agent.isIE){

	    	var ua = /msie ([0-9]{1,}[\.0-9]{0,})/.exec( navigator.userAgent.toLowerCase() );
	    	var version = ua ? parseInt( ua[ 1 ] ) : 11;

	    	_browser = 'is-ie';
			_browser += ' ie' + version;

			for( var i = version + 1; i <= 11; i++ ) {
                _browser +=  ' lt-ie' + i;
			}

	    } else if(_agent.isEdge){
	    	_browser = 'edge';

	    } else {
	    	_browser = 'unknown';
	    }

		if(_agent.isChromiumBased){
			_browser += ' chrome-based'
		}

	    return _browser;
	};

	/**
	* 플래폼 정보
	* @return {String} platform : 모바일 OS 정보
	* @return {String} version : OS 버전 정보
	*/
	function _getPlatform(){
		var ua = navigator.userAgent.toLowerCase();
        var platform = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec( ua ) || [];
        var version;

        if(platform[1]) {
            platform = platform[1].replace(/\s/g, "_");

            // AOS
            if(platform === 'android'){
                version =  /(android)\s.*(;|[0-9]_[0-9])/.exec( ua ) || [];
                version = version[0] ? version[0].replace(';','').split(' ') : '';

            // iOS
            }else if(platform === 'iphone' || platform === 'ipad'){
                version = /(?=version).+?(?=\s)/.exec( ua ) || [];
                version = version[0] ? version[0].split('/') : '';

            }

            version = (version !== '') ? version[version.length - 1] : '';
        }

		return {
           platform : platform || '',
           version : version || ''
        }
	};

	_onInit();

	return _agent;

})();//CheckBrowser
