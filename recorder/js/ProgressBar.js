/**
 * ������ �ε� �� UI
 * @author Lee Yoon Seo (2019.09)
 * @version 1.0.0
 * @see CheckBrowser-2.0.0.js
 * @support Chrome | fireFox | Edge | Safari | Opera
 */
window.ProgressBar = {
    name : "progress bar draw",
    version : "1.0.0",
};

/**
 * circle �ε� �� ����
 * @constructor ProgressBar
 * @param {String} element circle�� �׷��� �θ� id�� class
 */
ProgressBar.Circle = function(element){
    this.name = "ProgressBar.Circle";
    this.element = element;

    var $progress;
    var $left;
    var $right;

    /**
     * draw �Լ��� ȣ��
     * @param {Number} deg ȸ�� ���Ѿ��ϴ� ���� ��
     */
    this.draw = function(deg){
        _clipBoundary.call(this, deg);
        _rotate.call(this, deg);
    };

    this.reset = function(){
        this.draw(0);
    };

    // ȸ���� �� ���Ǵ� half-circle ����
    function _createHalfCircle(){
        return $('<div></div>').prop({'class' : 'half-circle'})
                               .css({'transform' : '_rotate(0)'});
    }

    function _init(){
        $pointer = $(this.element).find('.pie_pointer');
        $progress = $(this.element).find('.pie');

        $left = _createHalfCircle();
        $right = _createHalfCircle();

        $progress.empty().append([$left, $right]);

        this.draw(0);
    };

    /**
     * half-circle, pointer�� ȸ�� ��Ű�� �Լ�
     * @param {Number} deg  ȸ�� ���Ѿ��ϴ� ���� ��
     */
    function _rotate(deg){
        if(deg < 0) return;

        $left.css('transform', 'rotate('+ ((deg > 180) ? deg : 0) +'deg)');
        $right.css('transform', 'rotate('+ ((deg > 180) ? 180 : deg) + 'deg)');
        $pointer.css('transform', 'rotate('+ deg + 'deg');
    }

   /**
     * half-circle�� ȸ�� ��Ű�� ���� ��Ÿ���� �߰��ϴ� �Լ�
     * @param {Number} deg ȸ�� ��Ű�� ���� ��
     */
    function _clipBoundary(deg){
        $progress.css((deg > 180) ? {'clip': 'rect(auto auto auto auto)'} // full
                                  : {'clip': 'rect(0 1em 1em 0.5em)'}); // half
    }

    _init.call(this);

    return this.element;
};

/**
 * Linear �ε� �� ����
 * @constructor ProgressBar
 * @param {Object} options �� ������ �ʿ��� ������Ʈ��
 */
ProgressBar.Linear = function(options){
    this.name = "ProgressBar.Linear";

    this.options = $.extend(true, {
        wrap : '.rec_box',
        progress : '.rec_bar_played',
        thumb : '.rec_bar_pointer',
        bar : '.rec_bar'
    }, options);

    this.wrap = (typeof this.options.wrap === 'string') ? $(this.options.wrap) : this.options.wrap;

    var isTouch = CheckBrowser.isTouchScreen;
    var progress = this.wrap.find(this.options.progress).get(0);
    var bar = this.wrap.find(this.options.bar);
    var thumbRadius = this.wrap.find(this.options.thumb).outerWidth() / 2;

    /**
     * �ε� �� �׸���
     * @issue �ε� �� ������ �����Ͱ� ����Ǵ� ������ ���� �ʺ񿡼� �������� �������� ���ϱ� ���Ͽ� ���� ����Ͽ� ����
     * @param {Number} currentW �׷������� width ��
     */
    this.draw = function(currentW){
        $(progress).width((currentW + thumbRadius) + 'px');
    };

    /**
     * �ε� �� �̺�Ʈ
     * @issue �ε� �� ������ �����Ͱ� ����Ǵ� ������ ���� �ʺ񿡼� �������� �������� ���ϱ� ���Ͽ� ���� ����Ͽ� ����
     * @param {Object} e �ε� �� event
     * @param {Object} audio ���� �� �����
     */
    this.input = function(e, audio){
        if (audio.duration == 'Infinity') {
            return;
        }
        var theRealEvent = isTouch ? e.originalEvent.touches[0] : e;
        var x = (theRealEvent.pageX - $(bar).offset().left);

        audio.currentTime = Math.round(audio.duration * x / $(bar).outerWidth());
    };

    this.reset = function(){
        this.draw(0);
    };

    function _init(){
        this.draw(0);
    }

    _init.call(this);

    return {
        el : this.element,
        draw : this.draw,
        input : this.input,
        reset : this.reset
    }
};
