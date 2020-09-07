/**
 * 녹음기 로딩 바 UI
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
 * circle 로딩 바 생성
 * @constructor ProgressBar
 * @param {String} element circle이 그려질 부모 id나 class
 */
ProgressBar.Circle = function(element){
    this.name = "ProgressBar.Circle";
    this.element = element;

    var $progress;
    var $left;
    var $right;

    /**
     * draw 함수들 호출
     * @param {Number} deg 회전 시켜야하는 각도 값
     */
    this.draw = function(deg){
        _clipBoundary.call(this, deg);
        _rotate.call(this, deg);
    };

    this.reset = function(){
        this.draw(0);
    };

    // 회전할 때 사용되는 half-circle 생성
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
     * half-circle, pointer를 회전 시키는 함수
     * @param {Number} deg  회전 시켜야하는 각도 값
     */
    function _rotate(deg){
        if(deg < 0) return;

        $left.css('transform', 'rotate('+ ((deg > 180) ? deg : 0) +'deg)');
        $right.css('transform', 'rotate('+ ((deg > 180) ? 180 : deg) + 'deg)');
        $pointer.css('transform', 'rotate('+ deg + 'deg');
    }

   /**
     * half-circle를 회전 시키기 위한 스타일을 추가하는 함수
     * @param {Number} deg 회전 시키는 각도 값
     */
    function _clipBoundary(deg){
        $progress.css((deg > 180) ? {'clip': 'rect(auto auto auto auto)'} // full
                                  : {'clip': 'rect(0 1em 1em 0.5em)'}); // half
    }

    _init.call(this);

    return this.element;
};

/**
 * Linear 로딩 바 생성
 * @constructor ProgressBar
 * @param {Object} options 바 생성에 필요한 엘리먼트들
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
     * 로딩 바 그리기
     * @issue 로딩 바 밖으로 포인터가 노출되는 문제로 바의 너비에서 포인터의 반지름을 제하기 위하여 값을 계산하여 리턴
     * @param {Number} currentW 그려져야할 width 값
     */
    this.draw = function(currentW){
        $(progress).width((currentW + thumbRadius) + 'px');
    };

    /**
     * 로딩 바 이벤트
     * @issue 로딩 바 밖으로 포인터가 노출되는 문제로 바의 너비에서 포인터의 반지름을 제하기 위하여 값을 계산하여 리턴
     * @param {Object} e 로딩 바 event
     * @param {Object} audio 제어 할 오디오
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
