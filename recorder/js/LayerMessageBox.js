/**
 * ������ ���̾� �˾� UI
 * @author Lee Yoon Seo (2019.11)
 * @update Lee Yoon seo (2020.09.04)
 * @version 1.1.0
 * @return {Object} open, close
 * @usage
 * <pre>
 *   // �⺻��
 *   LayerMessageBox.open({ 
 *      type : 'alert'
 *   }, '�޼����� �Է����ּ���.\n�ȳ�â�Դϴ�.');
 *
 *   // Ȯ����
 *   LayerMessageBox.open({
 *       type : 'alert',
 *       custom : true,
 *       button : { 
 *           target : '.target',
 *           class : 'submit',
 *           label : 'Ȯ��',
 *           event : function(){ 
 *              // ...
 *           }
 *       }
 *   }}, '�޼����� �Է����ּ���.\n�ȳ�â�Դϴ�.' );
 *
 *   // �ݹ���
 *   LayerMessageBox.open({ 
 *      type : 'confirm' 
 *   }, '�޼����� �Է����ּ���.\nȮ��â�Դϴ�.', function(isState){
 *       if(isState){
 *           // Ȯ�� ��ư Ŭ�� �� �̺�Ʈ �ۼ�
 *           .....
 *       }else{
 *           // ��� ��ư Ŭ�� �� �̺�Ʈ �ۼ�
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
        title : '�˸�',
        message : '�⺻ �����Դϴ�.',
        custom : false,
        button : {
            target : '.layer_submit',
            class : '',
            label : 'Ȯ��',
            event : {}
        }
    };
    var ui = {};
    var onComplete;

    /**
     * �˾� ���� (�ɼ� �� ����)
     * @param  {Object || String || Function} options - object�� ��� �˾� ui ��Ʈ�� �ɼ� ��ü, string�� ��� �޼���, function�� ��� �ݹ��Լ�
     * @param  {String} options.type - ui Ÿ�� (alert, confirm)
     * @param  {boolean} options.custom - ��ư Ŀ���� ����
     * @param  {Object} options.button - ��ư Ŀ���� �ɼ�
     * @param  {String} options.button.target - Ÿ�� �±��� class �Ǵ� id ��
     * @param  {String} options.button.class - Ÿ�ٿ� ���Ӱ� ����� class
     * @param  {String} options.button.label - Ÿ�ٿ� ���Ӱ� ����� �ؽ�Ʈ
     * @param  {Function} options.button.event - Ÿ�� Ŭ���� �߻��� �̺�Ʈ �Լ�
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

        /** @throw uiShow, uiHide ���� �ϴܿ� ��ġ�ؾ��� */
        ui.custom && setUI(ui.button);

        $element.show()
            .find('.layer_h2').empty().append(ui.title).end()
            .find('.message_text').empty().append(convertMessage(ui.message));
    };

    function convertMessage(message){
        if(!message || typeof message !== 'string') return false;
        return message.split('\n').join('<br>');
    }

    // �˾� �ݱ�
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
     * ui ����
     * @param  {String} options.type - ui Ÿ�� (alert, confirm)
     * @param  {boolean} options.custom - ��ư Ŀ���� ����
     * @param  {Object} options.button - ��ư Ŀ���� �ɼ�
     * @param  {String} options.button.target - Ÿ�� �±��� class �Ǵ� id ��
     * @param  {String} options.button.class - Ÿ�ٿ� ���Ӱ� ����� class
     * @param  {String} options.button.label - Ÿ�ٿ� ���Ӱ� ����� �ؽ�Ʈ
     * @param  {Function} options.button.event - Ÿ�� Ŭ���� �߻��� �̺�Ʈ �Լ�
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
            $('.layer_submit').text('Ȯ��');
            $('.layer_cancel').text('���');
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
