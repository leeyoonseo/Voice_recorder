/**
 * 녹음기 레이어 팝업 UI
 * @author Lee Yoon Seo (2019.11)
 * @update Lee Yoon seo (2020.09.04)
 * @version 1.1.0
 * @return {Object} open, close
 * @usage
 * <pre>
 *   // 기본형
 *   LayerMessageBox.open({ 
 *      type : 'alert'
 *   }, '메세지를 입력해주세요.\n안내창입니다.');
 *
 *   // 확장형
 *   LayerMessageBox.open({
 *       type : 'alert',
 *       custom : true,
 *       button : { 
 *           target : '.target',
 *           class : 'submit',
 *           label : '확인',
 *           event : function(){ 
 *              // ...
 *           }
 *       }
 *   }}, '메세지를 입력해주세요.\n안내창입니다.' );
 *
 *   // 콜백형
 *   LayerMessageBox.open({ 
 *      type : 'confirm' 
 *   }, '메세지를 입력해주세요.\n확인창입니다.', function(isState){
 *       if(isState){
 *           // 확인 버튼 클릭 시 이벤트 작성
 *           .....
 *       }else{
 *           // 취소 버튼 클릭 시 이벤트 작성
 *           .....
 *       }
 *   });
 * </pre>
 * @support Chrome | fireFox | Edge | Safari | Opera
 */
 window.LayerMessageBox = (function(){
    var TYPE_ALERT = 'ALERT';
    var TYPE_CONFIRM = 'CONFIRM';
    var $element = $('.layer_message_popup');
    var defaultOptions = {
        type : TYPE_ALERT,
        title : '알림',
        message : '기본 문구입니다.',
        custom : false,
        button : {
            target : '.layer_submit',
            class : '',
            label : '확인',
            event : {}
        }
    };
    var ui = {};
    var onComplete;

    /**
     * 팝업 열기 (옵션 재 정의)
     * @param  {Object || String || Function} options - object일 경우 팝업 ui 컨트롤 옵션 객체, string일 경우 메세지, function일 경우 콜백함수
     * @param  {String} options.type - ui 타입 (alert, confirm)
     * @param  {boolean} options.custom - 버튼 커스텀 여부
     * @param  {Object} options.button - 버튼 커스텀 옵션
     * @param  {String} options.button.target - 타겟 태그의 class 또는 id 값
     * @param  {String} options.button.class - 타겟에 새롭게 변경될 class
     * @param  {String} options.button.label - 타겟에 새롭게 변경될 텍스트
     * @param  {Function} options.button.event - 타겟 클릭시 발생할 이벤트 함수
     */
    var open = function(...options){
        var opt;
        for(var i = 0; i < options.length; i++){
            opt = options[i];

            if(typeof opt === 'function') onComplete = opt;
            if(typeof opt === 'string') ui.message = opt;
            if(typeof opt === 'object') ui = $.extend({}, defaultOptions, opt);
        }

        uiHide();
        uiShow();

        /** @throw uiShow, uiHide 보다 하단에 위치해야함 */
        ui.custom && setUI(ui.button);

        $element.show()
            .find('.layer_h2').empty().append(ui.title).end()
            .find('.message_text').empty().append(convertMessage(ui.message));
    };

    function convertMessage(message){
        if(!message || typeof message !== 'string') return false;
        return message.split('\n').join('<br>');
    }

    // 팝업 닫기
    var close = function(){
        uiHide();
    };

    var uiShow = function(){
        attachEvent();
        $element.show();

        ui.type = ui.type.toUpperCase();

        (ui.type === TYPE_ALERT) && $element.find('.layer_close, .layer_submit').show();
        (ui.type === TYPE_CONFIRM) && $element.find('.layer_close, .layer_submit, .layer_cancel').show();
    };

    var uiHide = function(){
        dettachEvent();
        $element.hide().find('.layer_submit, .layer_close, .layer_cancel').hide();
    };

   
    /**
     * ui 설정
     * @param  {String} options.type - ui 타입 (alert, confirm)
     * @param  {boolean} options.custom - 버튼 커스텀 여부
     * @param  {Object} options.button - 버튼 커스텀 옵션
     * @param  {String} options.button.target - 타겟 태그의 class 또는 id 값
     * @param  {String} options.button.class - 타겟에 새롭게 변경될 class
     * @param  {String} options.button.label - 타겟에 새롭게 변경될 텍스트
     * @param  {Function} options.button.event - 타겟 클릭시 발생할 이벤트 함수
     */
    var setUI = function(options){
        if(options.length > 1){
            options.forEach(function(obj){
                setButton(obj);
            });

        }else{
            setButton(options);
        }

        function setButton(obj){
            if(!obj) return false;
            var $target = $element.find(obj.target);

            (obj.class || $.trim(obj.class)) && $target.addClass(obj.class);
            (obj.label || $.trim(obj.label)) && $target.text(obj.label);

            if(typeof obj.event === 'function'){
                $target.off().on('click', function(){
                    obj.event();
                    uiHide();
                });
            }
        }
    };

    var attachEvent = function(){
        var target = $element.find('.layer_submit, .layer_close, .layer_cancel');

        if(!ui.custom){
            $('.layer_submit').text('확인');
            $('.layer_cancel').text('취소');
        }

        target.on('click', function(){
            var res = $(this).hasClass('layer_submit');
            onComplete && onComplete(res);

            uiHide();
        });
    };

    var dettachEvent = function(){
        $element.find('.layer_submit, .layer_close, .layer_cancel').off();
    };

    return {
        open,
        close,
    }
}());
