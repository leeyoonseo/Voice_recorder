/**
 * 오디오 매니저
 * @author Lee Yoon Seo (2019.09)
 * @version 1.0.0
 * @see CheckBrowser-2.0.0.js
 * @support Chrome | fireFox | Edge | Safari | Opera | IE9 ~
 */
window.playerManager = function(){
    this.name = "player manager",
    this.version = "1.0.0",

    this.playing = false,
    this.isTouch = CheckBrowser.isTouchScreen,

    this.Event = {
        Start : this.isTouch ? 'touchstart' : 'mousedown',
        Move : this.isTouch ? 'touchmove' : 'mousemove',
        End : this.isTouch ? 'touchend' : 'mouseup',
        Cancel : this.isTouch ? 'touchcancel' : 'mouseup',
        Leave : this.isTouch ? 'touchend' : 'mouseleave' 
    }

};

window.playerManager.prototype = {
    constructor : playerManager,  

    /**
     * 호출 시 세팅
     * @param {Object} newOptions  유저가 셋업 시 삽입하는 옵션 값
     */
    init : function(newOptions){
        this.options = $.extend(true, {
            element : '.player_ready',
            audio : '',
            audioFileSrc : '',
            timeFormat : 'mm:ss'

        }, newOptions);

        this.audio = this.options.audio;
        this.element = $(this.options.element);
        this.bar = this.element.find('.rec_bar');
        this.thumb = this.element.find('.rec_bar_pointer');

        this.ready();
    },

    ready : function(){
        $(this.autio).off();

        this.dettachEvent();
        this.AudioAttachEvent();
        this.BarAttachEvent();
    },

    // 오디오 로드, callback 함수 저장
    setLoadeddata : function(callback){
        this.loadeddataCallback = callback; 
    
    },

    // 오디오 타이머 시, callback 함수 저장
    setTimeupdate : function(callback){
        this.timeupdateCallback = callback;
    
    },

    // 오디오 종료 시, callback 함수 저장
    setEnded : function(callback){
        this.endedCallback = callback;

    },

    // 로딩 바 이벤트 시, callback 함수 저장
    setBarEvent : function(callback){
        this.barEventCallback = callback;

    },

    AudioAttachEvent : function(){
        var that = this;
        try {
            $(this.audio).attr('src', this.options.audioFileSrc)
                .on('error', function(e){
                    // 에러
                    console.log(e.message);
                })
                // 오디오 로드 시
                .on('loadeddata', function(){
                    var duration = this.duration;
                    if (this.duration == 'Infinity') {
                        duration = recordedTime;
                        that.bar.css('cursor', 'default');
                    }
                    that.loadeddataCallback(duration);
                })
                .on('timeupdate', function(){
                    var duration = this.duration;
                    if (this.duration == 'Infinity') {
                        duration = recordedTime;
                        that.bar.css('cursor', 'default');
                    } else {
                        that.bar.css('cursor', '');
                    }
                    // 오디오 타이머 시
                    that.timeupdateCallback(this.currentTime, duration);
                })
                .on('ended', function(){
                    // 오디오 종료 시
                    that.endedCallback(this.duration);

                }).load();

        } catch (e) {
            console.log(e.name + ": " + e.message);
        }

    },

    BarAttachEvent : function(){
        var that = this;

        // player가 가지고 있는 audio 파라미터로 전달해야 작동
        this.bar.on(that.Event.Start, function(e){
            that.barEventCallback(e, that.audio);

            // 마우스가 약간 벗어나도 드래그 이벤트가 적용되도록 로딩 바 부모에 move 이벤트 바인딩
            that.element.on(that.Event.Move, function(e){ 
                that.barEventCallback(e, that.audio); 

            });
        });

        this.thumb.on(that.Event.Start, function(e){
            that.barEventCallback(e, that.audio);

            // 마우스가 약간 벗어나도 드래그 이벤트가 적용되도록 로딩 바 부모에 move 이벤트 바인딩
            that.element.on(that.Event.Move, function(e){ 
                that.barEventCallback(e, that.audio); 

            });
        });

        this.element.on(that.Event.Cancel, function(){
            that.element.off(that.Event.Move);

        }).on(that.Event.Leave, function(){
            that.element.off(that.Event.Move);

        });  
    },

    dettachEvent : function(){
        this.bar.off();
        this.thumb.off();
        this.element.off();
    },

    /** 
     * 버튼 disabled 및 callback 함수 실행
     * @see record.html - callback : .html 파일에서 태그로 오디오를 제어하기 위해 생성
     * @param {Boolean} isEnabled 실행 여부
     * @param {Object} callback 엘리먼트 파라미터로 전달하여 상호작용 가능 
    */ 
    eventDisabled : function(isEnabled, callback){
        if(isEnabled){
            this.dettachEvent();

        }else{
            this.BarAttachEvent();
            
        }

        this.element.toggleClass('disabled', isEnabled);
        if(callback) callback(this.element);
    }
};