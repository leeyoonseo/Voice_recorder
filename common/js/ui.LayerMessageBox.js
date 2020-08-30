/**
 * 녹음기 레이어 팝업 UI
 * @author Lee Yoon Seo (2019.11)
 * @version 1.1.0
 * @return {Object} open
 * @usage 
 * <pre>
 *   // 커스텀 없는 경우
 *   LayerMessageBox.open({type : 0}, '메세지를 입력해주세요.\n안내창입니다.'); 
 *   
 *   // 커스텀 있는 경우
 *   LayerMessageBox.open({type : 1, custom : true, button : { target : '타겟class, id', label : '버튼명', event : function(){ 타겟 클릭 시 이벤트 }}}, '메세지를 입력해주세요.\n안내창입니다.');  
 * 
 *   // 콜백으로 확인, 취소 값을 넘겨 받아 작업할 때
 *   LayerMessageBox.open({type : 2}, '메세지를 입력해주세요.\n확인창입니다.', function(isState){
 *       if(isState){ 
 *           // 확인 버튼 클릭 시
 *           ..... 
 *       }else{
 *           // 취소 버튼 클릭 시
 *           .....
 *       }
 *   });
 * </pre>
 * @support Chrome | fireFox | Edge | Safari | Opera
 */
window.LayerMessageBox = (function($){

    var layerBox = $('.rec_layer_wrap');
    var callbackFunc;
    var ui = {};
    
    /**
     * 외부에서 호출하여 레이어팝업 셋팅
     * @param {Object} uioptions - ui 옵션 (required)
     * @param {Object || String} data - 레이어팝업에 추가할 콘텐츠나 메세지 (required)
     * @param {Object} callback - 콜백함수
     */
    function open(uiOptions, data, callback){

        ui = $.extend({
            type : 0,                           // {Number} (required) 0 - 버튼 없음 / 1 - 확인 버튼만 / 2 - 모든 버튼 노출
            custom : false,                     // {Boolean} 버튼 수정이 필요할 시, default = false
            button : {                          // {Array || Object} 버튼에 대한 수정 옵션 값 (복수일 경우 Array로 작성)
                        target : '.submit',     // {String} 커스텀 할 버튼의 class or id (custom : true시에 필수 값)
                        class : '',             // {String} 커스텀 할 버튼에 추가 class (복수일 경우 ,로 구분)
                        label : '확인',         // {String} 버튼의 label
                        event : {}              // {Function} 버튼 클릭 시 이벤트 (event는 해당 버튼만 실행되고 callback은 확인, 취소버튼 모두 실행 됨.)
                     }
        }, uiOptions);

        if(callback) callbackFunc = callback;

        _uiHide();        
        _uiShow();
        if(ui.custom) _setUI(ui.button);

        _setContent(data);
    }

    // 외부에서 type:0 을 닫기 위해 호출
    function close(){
        _uiHide();
    }

    function _uiHide(){
        layerBox.hide()
            .find('.submit, .btn_layer_close, .close').hide();

        _dettachEvent();
    }

    function _uiShow(){
        _attachEvent();

        layerBox.show();

        switch(ui.type){
            case 0 : break;

            case 1 : layerBox.find('.btn_layer_close, .submit').show(); 
                     break;

            case 2 : layerBox.find('.btn_layer_close, .submit, .close').show();
                     break;

            // no defailt;
        }
    }

    function _setUI(options){

        // 옵션이 여러개일 때
        if($.isArray(options)){
            options.forEach(function(v){
                // class
                addClass(v);

                // label
                changeLabel(v);
                
                // event
                changeEvent(v);
            });

        }else{
            addClass(options);
            changeLabel(options);
            changeEvent(options);
            
        }

        function addClass(options){
            if(typeof options.class === 'string' && $.trim(options.class)){
                var classNames = options.class.split(',');
                var target = layerBox.find(options.target);

                // 클래스가 여러개
                if(classNames.length > 1){
                    classNames.forEach(function(v){
                        add(v);
                    });

                }else{
                    add(options.class);
                }
                
                function add(className){
                    target.addClass(className);
                }
            } 
        }

        function changeLabel(options){
            if(typeof options.label === 'string' && $.trim(options.label) !== ''){
                layerBox.find(options.target).text(options.label);
            }
        }

        function changeEvent(options){
            if($.isFunction(options.event)){
                _dettachEvent(options.target);

                layerBox.find(options.target).on('click', function(){

                    options.event();
                    _uiHide();
                });
            }
        }

    }

    /**
     * 데이터 삽입
     * @param {String} data 삽입될 데이터
     */
    function _setContent(data){
        var output = data;

        if(typeof output === 'string'){
            output = _replaceAll(data, '\n', '<br>');
        }

        layerBox.show()
        .find('.rec_layer_message').empty().append(output);
    }

    /**
     * 메세지 줄 바꿈 (브라우저 \n을 대체하기 위함)
     * @param {String} message 수정할 메세지
     * @param {String} org 수정되어야 할 문자열 (\n)
     * @param {String} dest 수정되는 문자열 (<br>)
     */
    function _replaceAll(message, org, dest){
        return message.split(org).join(dest);
    }
    
    function _attachEvent(){
        var target = layerBox.find('.submit, .btn_layer_close, .close');
        
        target.on('click', function(){
            var result = ($(this).hasClass('submit')) ? true: false;

            if(callbackFunc) callbackFunc(result);
            _uiHide();
        });
    }

    function _dettachEvent(className){
        var target = className ? className : '.submit, .btn_layer_close, .close';
        layerBox.find(target).off();
    }
    
    _attachEvent();

    return { 
        open : open,
        close : close
    }

}(jQuery)); // RecordLayerPopup