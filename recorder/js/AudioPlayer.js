/**
 * 오디오 매니저
 * @author Lee Yoon Seo (2019.09)
 * @update Lee Yoon Seo (2020.08)
 * @version 1.1.0
 * @see CheckBrowser-2.0.0.js
 * @support Chrome | fireFox | Edge | Safari | Opera
 */

/**
 * 오디오 플레이어
 * @options playing {boolean} - 오디오 플레이 상태
 */
window.AudioPlayer = function(){
    this.name = "player manager",
    this.version = "1.1.0",

    this.isTouch = CheckBrowser.isTouchScreen,

    this.Event = {
        Start : this.isTouch ? 'touchstart' : 'mousedown',
        Move : this.isTouch ? 'touchmove' : 'mousemove',
        End : this.isTouch ? 'touchend' : 'mouseup',
        Cancel : this.isTouch ? 'touchcancel' : 'mouseup',
        Leave : this.isTouch ? 'touchend' : 'mouseleave'
    }
};

window.AudioPlayer.prototype = {
    constructor : AudioPlayer,

    /**
     * 호출 시 세팅
     * @param {Object} opts  유저가 셋업 시 삽입하는 옵션 값
     * @param {String} opts.wrap  플레이어가 포함된 루트객체의 클래스나 id
     * @param {String} opts.statusBar 플레이어 진행바의 클래스나 id
     * @param {String} opts.audioFileSrc 플레이어 오디오 경로
     * @param {String} opts.timeFormat 타이머 포맷
     */
    init : function(opts){

        this.options = $.extend(true, {
            wrap : '.player',
            statusBar : '.ui_status_bar',
            audioFileSrc : '',
            timeFormat : 'mm:ss',
        }, opts);

        this.audio = new Audio();
        this.wrap = $(this.options.wrap);

        this.statusBar = this.wrap.find(this.options.statusBar);
        this.bar = this.statusBar.find('.status_bar');
        this.pointer = this.statusBar.find('.status_pointer');

        this.ready();

        return this;
    },

    ready : function(){
        $(this.audio).off();

        this.dettachEvent();

        this.setAudioLifeCycle();
        this.attachEvent();

        return this;
    },

    stop : function(){
        this.audio.currentTime = 0;
        this.audio.pause();

        return this;
    },

    // 오디오 로드, callback 함수 저장
    setLoadeddata : function(callback){
        this.loadeddataCallback = callback;

        return this;
    },

    // 오디오 타이머 시, callback 함수 저장
    setTimeupdate : function(callback){
        this.timeupdateCallback = callback;

        return this;
    },

    // 오디오 종료 시, callback 함수 저장
    setEnded : function(callback){
        this.endedCallback = callback;

        return this;
    },

    // 로딩 바 이벤트 시, callback 함수 저장
    setBarEvent : function(callback){
        this.barEventCallback = callback;

        return this;
    },

    setAudioLifeCycle : function(){
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
                that.totalTime = duration;
            })

            // 오디오 타이머 시
            .on('timeupdate', function(){
                var duration = this.duration;
                if (this.duration == 'Infinity') {
                    duration = recordedTime;
                    that.bar.css('cursor', 'default');

                } else {
                    that.bar.css('cursor', '');
                }

                that.timeupdateCallback(this.currentTime, duration);
            })

            // 오디오 종료 시
            .on('ended', function(){
                that.endedCallback(this.duration);

            }).load();

        } catch (e) {
            console.log(e.name + ": " + e.message);
        }

        return this;
    },

    attachEvent : function(){
        var that = this;

        // player가 가지고 있는 audio 파라미터로 전달해야 작동
        this.bar.on(that.Event.Start, function(e){
            that.barEventCallback(e, that.audio);

            // 마우스가 약간 벗어나도 드래그 이벤트가 적용되도록 로딩 바 부모에 move 이벤트 바인딩
            that.statusBar.on(that.Event.Move, function(e){
                that.barEventCallback(e, that.audio);
            });
        });

        this.pointer.on(that.Event.Start, function(e){
            that.barEventCallback(e, that.audio);

            // 마우스가 약간 벗어나도 드래그 이벤트가 적용되도록 로딩 바 부모에 move 이벤트 바인딩
            that.statusBar.on(that.Event.Move, function(e){
                that.barEventCallback(e, that.audio);
            });
        });

        this.statusBar.on(that.Event.Cancel, function(){
            that.statusBar.off(that.Event.Move);

        }).on(that.Event.Leave, function(){
            that.statusBar.off(that.Event.Move);
        });

        return this;
    },

    dettachEvent : function(){
        this.bar.off();
        this.pointer.off();
        this.statusBar.off();

        return this;
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
            this.attachEvent();

        }

        this.statusBar.toggleClass('disabled', isEnabled);
        if(callback) callback(this.statusBar);
        
        return this;
    }
};
