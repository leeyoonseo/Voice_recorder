/**
 * Loading indicator
 * @author Lee Yoon Seo (2019.11.20)
 * @version 1.0.0
 * @return {Object} show, hide, remove
 * @param {Object} options
 * @usage
 * <pre>
 *      // non-customized
 *      var loader = LoadingIndicator();
 *
 *      // customized
 *      var loader = LoadingIndicator({
 *          className : 'progress',
 *          message : '로딩중...',
 *          dim : false
 *      });
 *
 *      loader.show();
 *      loader.hide();
 *      loader.remove();
 * </pre>
 * @support IE11~ || edge || chrome || opera || firefox || safari
 */
'use strict';

window.LoadingIndicator = function(options){

    var options = $.extend(true, {
        className : 'loader',
        message : '파일 업로드 중입니다.',
        mainColor : '#1ba1f8',
        subColor : '#89d0ff',
        defaultColor : '#616161',
        dim : true
    }, options);

    options.defaultColor = (options.dim) ? options.defaultColor : 'rgba(0,0,0,0.2)';

    var wrapEl,
        loaderEl,
        messageEl,
        dimEl,
        className = options.className,
        wrapClass = className + '_wrap',
        messageClass = className + '_message',
        dimClass = className + '_dim',
        styleSheetId = options.className + 'Style';

    var keyframes = '@keyframes loaderSpinner{0%,100%{box-shadow:0 -2.823em 0 0 ' + options.mainColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.subColor+ '}8.3%{box-shadow:0 -2.823em 0 0 ' + options.subColor+ ',1.403em -2.435em 0 0 ' + options.mainColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}16.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.subColor+ ',2.435em -1.403em 0 0 ' + options.mainColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}25%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.subColor+ ',2.806em 0 0 0 ' + options.mainColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}33.3%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.subColor+ ',2.419em 1.403em 0 0 ' + options.mainColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}41.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.subColor+ ',1.387em 2.435em 0 0 ' + options.mainColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}50%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.subColor+ ',-.016em 2.806em 0 0 ' + options.mainColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}58.3%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.subColor+ ',-1.419em 2.419em 0 0 ' + options.mainColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}66.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.subColor+ ',-2.452em 1.387em 0 0 ' + options.mainColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}75%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.subColor+ ',-2.823em -.016em 0 0 ' + options.mainColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}83.3%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.subColor+ ',-2.435em -1.419em 0 0 ' + options.mainColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}91.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.subColor+ ',-1.403em -2.452em 0 0 ' + options.mainColor + '}}@-webkit-keyframes loaderSpinner{0%,100%{box-shadow:0 -2.823em 0 0 ' + options.mainColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.subColor+ '}8.3%{box-shadow:0 -2.823em 0 0 ' + options.subColor+ ',1.403em -2.435em 0 0 ' + options.mainColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}16.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.subColor+ ',2.435em -1.403em 0 0 ' + options.mainColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}25%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.subColor+ ',2.806em 0 0 0 ' + options.mainColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}33.3%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.subColor+ ',2.419em 1.403em 0 0 ' + options.mainColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}41.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.subColor+ ',1.387em 2.435em 0 0 ' + options.mainColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}50%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.subColor+ ',-.016em 2.806em 0 0 ' + options.mainColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}58.3%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.subColor+ ',-1.419em 2.419em 0 0 ' + options.mainColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}66.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.subColor+ ',-2.452em 1.387em 0 0 ' + options.mainColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}75%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.subColor+ ',-2.823em -.016em 0 0 ' + options.mainColor + ',-2.435em -1.419em 0 0 ' + options.defaultColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}83.3%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.subColor+ ',-2.435em -1.419em 0 0 ' + options.mainColor + ',-1.403em -2.452em 0 0 ' + options.defaultColor + '}91.6%{box-shadow:0 -2.823em 0 0 ' + options.defaultColor + ',1.403em -2.435em 0 0 ' + options.defaultColor + ',2.435em -1.403em 0 0 ' + options.defaultColor + ',2.806em 0 0 0 ' + options.defaultColor + ',2.419em 1.403em 0 0 ' + options.defaultColor + ',1.387em 2.435em 0 0 ' + options.defaultColor + ',-.016em 2.806em 0 0 ' + options.defaultColor + ',-1.419em 2.419em 0 0 ' + options.defaultColor + ',-2.452em 1.387em 0 0 ' + options.defaultColor + ',-2.823em -.016em 0 0 ' + options.defaultColor + ',-2.435em -1.419em 0 0 ' + options.subColor+ ',-1.403em -2.452em 0 0 ' + options.mainColor + '}}';

    function init(){
        // [D] 중복 시 먼저 생성한 것 삭제
        if($('body').find('.' + dimClass).length > 0){
            remove();
        }

        createElement();
        appendElement();
    }

    function createElement(){
        wrapEl = $('<div></div>', {
            class : wrapClass

        });

        loaderEl = $('<div></div>', {
            class : className

        }).css({
            'margin' : '38px auto 43px',
            'fontSize' : '10px',
            'width' : '.9em',
            'height' : '.9em',
            'borderRadius' : '50%',
            '-webkit-animation' :'loaderSpinner 1.1s infinite ease',
            'animation' : 'loaderSpinner 1.1s infinite ease',
            '-webkit-transform' : 'translateZ(0)',
            '-ms-transform' : 'translateZ(0)',
            'transform' : 'translateZ(0)'
        });

        if(options.message){
            messageEl = $('<p></p>', {
                class : messageClass

            }).css({
                'margin' : '0',
                'maxWidth' : '300px',
                'fontSize' : '14px',
                'color' : (options.dim) ? '#fff' : '#333',
                'textAlign' : 'center'

            }).text(options.message);
        }


        dimEl = $('<div></div>', {
            class : dimClass

        }).css({
            'zIndex' : '999',
            'display' : 'none',
            'position' : 'fixed',
            'left' : '0',
            'right' : '0',
            'top' : '0',
            'bottom' : '0',
            'justifyContent' : 'center',
            'alignItems' : 'center'
        });;

        if(options.dim){
            dimEl.css({
                'background' : 'rgba(0,0,0,0.75)'
            })

        }
    }

    function appendElement(){
        wrapEl.append(loaderEl);

        // 메세지
        if(options.message) wrapEl.append(messageEl);

        // 스타일
        if($(styleSheetId).length < 1) $('head').append(setStyleEl());

        // 배경
        dimEl.append(wrapEl);

        $('body').append(dimEl);
    }

    function setStyleEl(){
        return $('<style></style>', {
            id : styleSheetId

        }).html(keyframes);
    }

    function show(){
        if($('body').find('.' + dimClass).length < 1){
            init();
        }

        $(dimEl).css('display', 'flex');
    }

    function hide(){
        $(dimEl).hide();
    }

    function remove(){
        $('body').find('.' + dimClass).remove();
        $('#' + styleSheetId).remove();
    }

    init();

    return{
        show : show,
        hide : hide,
        remove : remove
    }
};
