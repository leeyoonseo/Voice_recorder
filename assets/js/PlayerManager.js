/**
 * 오디오 페이지 매니저
 * @author Lee Yoon Seo (2019.09)
 * @version 1.1.0
 * @see utils.StringUtil.js
 * @see ProgressBar.js
 * @see AudioPlayer.js
 * @support Chrome | fireFox | Edge | Safari | Opera
 */

 var PM_CYCLE = {
    WAITING : 'waiting',
    LOADED : 'loaded',
    TIME_UPDATE : 'timeupdate',
    RESUME : 'resume',
    STOP : 'stop',
    PLAY : 'play',
};

window.AudioPlayerManager = function(){
    this.name = "AudioPlayerManager",
    this.version = "1.1.0"
};

window.AudioPlayerManager.prototype = {
    constructor : AudioPlayerManager,
    /**
     * 호출 시 세팅
     * @param {Object} opts  유저가 셋업 시 삽입하는 옵션 값
     * @param {String} opts.element  플레이어 태그의 클래스나 아이디
     * @param {String} opts.timeFormat  타이머 포맷
     */
    init : function(opts){
        this.options = $.extend(true, {
            element : '.sound_player',
            timeFormat : 'mm:ss',
        }, opts);

        this.playerStatus = PM_CYCLE.WAITING;
        this.element = $(this.options.element);
        this.playBtn = this.element.find('.btn_play');
        this.stopBtn = this.element.find('.btn_stop');
        this.bar = this.element.find('.status_bar');

        this.ready();

        return this;
    },

    // AudioPlayer, ProgressBar 생성자 호출
    ready : function(){
        // ie8이하 return false;
        var isNotSupportBrowser = this.isNotSupportBrowser();
        if(isNotSupportBrowser) return false;

        // this.audioEl = new Audio();
        this.player = new AudioPlayer();

        this.player.init({
            wrap : this.element,
            audio : new Audio(),
            audioFileSrc : this.element.data('src'),
        });

        this.progressbar = new ProgressBar.Linear({
            wrap : this.element,
            progress : '.playing',
            thumb : '.status_pointer',
            bar : '.status_bar',
        });

        this.setAudio();
        this.attachEvent();

        return this;
    },

    /* 오디오 사이클 callback 함수 세팅 */
    setAudio : function(){
        var that = this;
        var barW = this.player.bar.outerWidth();
        var pointerWidth = this.player.pointer.outerWidth();

        // 오디오 로드
        this.player.setLoadeddata(function(duration){
            that.playerStatus = PM_CYCLE.LOADED;
            that.setTimer(duration * 1000, 0);
        });

        // 오디오 타이머 진행
        this.player.setTimeupdate(function(currentTime, duration){
            if(that.playerStatus === PM_CYCLE.STOP){
                that.setTimer(duration * 1000, 0);
            }else{
                that.playerStatus = PM_CYCLE.TIME_UPDATE;
                that.setTimer(currentTime * 1000, (currentTime / duration) * (barW - pointerWidth));
            }
        });

        // 오디오 종료
        this.player.setEnded(function(duration){
            that.playerStatus = PM_CYCLE.STOP;
            that.stop(duration);
        });

        // 오디오 바 이벤트
        this.player.setBarEvent(function(e, audio){
            that.progressbar.input(e, audio);
            that.stopBtn.prop('disabled', false);
        });

        return this;
    },

    attachEvent : function(){
        var that = this;

        this.playBtn.on('click', function(e){
            e.preventDefault();
            that.playerStatus = PM_CYCLE.PLAY;
            that.resume();

            $(document).trigger(PM_CYCLE.RESUME, that.player);
        });

        this.stopBtn.on('click', function(e){
            e.preventDefault();
            that.playerStatus = PM_CYCLE.STOP;

            that.stop();
            this.disabled = true;

            $(document).trigger(PM_CYCLE.RESUME, that.player);
        });

        return this;
    },

    resume : function(){
        (this.player.audio.paused) ? this.play() : this.pause();

        return this;
    },

    play : function(){
        this.stopBtn.is('[disabled]') && this.stopBtn.attr('disabled', false);
        this.element.addClass('active');
        this.player.audio.play();

        return this;
    },

    pause : function(){
        this.element.removeClass('active');
        this.player.audio.pause();

        return this;
    },

    stop : function(){
        this.pause();
        this.player.stop();

        $(document).trigger(PM_CYCLE.STOP, this.player);
        return this;
    },

    /** 타이머 시간 값 셋팅
     * @param {Number} time 시간 값
     * @param {Number} currentW 바를 그리기 위한 시간 당 width 값
     */
    setTimer : function(time, currentW){
        this.progressbar.draw(currentW);
        this.element.find('.current_time').html(StringUtils.makeTimeString(time, this.options.timeFormat));

        return this;
    },

    /**
     * 하위 브라우저를 분기하여 클릭 이벤트에 안내 알림창 띄우기
     * @return {Boolean} IE8이하 브라우저 여부
     */
    isNotSupportBrowser : function(){
        var isNotSupport = ($('html').hasClass('lt-ie9')) ? true : false;

        if(isNotSupport){
            this.bar.on('click', function(){
                alert("지원하지 않는 인터넷 브라우저입니다.\n녹음기 서비스는 크롬에 최적화 되어 있습니다.")
            });

            this.playBtn.on('click', function(){
                alert("지원하지 않는 인터넷 브라우저입니다.\n녹음기 서비스는 크롬에 최적화 되어 있습니다.")
            });

            return true;

        }else{
            return false;

        }
    },
};
