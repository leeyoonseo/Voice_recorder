/**
 * 나의 학습기록 오디오 UI 매니저
 * @author Lee Yoon Seo (2019.09)
 * @version 1.0.0
 * @see utils.StringUtil.js 
 * @see ui.ProgressBarDraw.js
 * @see ui.playerManager.js
 * @support Chrome | fireFox | Edge | Safari | Opera | IE9 ~
 */
window.myRecordPageManager = function(){
    this.name = "myRecordPageManager",
    this.version = "1.0.0"
};

window.myRecordPageManager.prototype = {
    constructor : myRecordPageManager,  

    /**
     * 호출 시 세팅
     * @param {Object} newOptions  유저가 셋업 시 삽입하는 옵션 값
     */
    init : function(newOptions){
        this.options = $.extend(true, {
            element : '.player_ready',
            timeFormat : 'mm:ss'

        }, newOptions);

        this.element = $(this.options.element);
        this.controlBtn = this.element.find('.rec_box_playpause');
        this.bar = this.element.find('.rec_bar');

        this.ready();
    },

    // playerManager, progressBarDraw 생성자 호출
    ready : function(){
        // ie8이하 return false;
        var isNotSupportBrowser = this.isNotSupportBrowser(); 
        if(isNotSupportBrowser) return false;

        this.audioEl = new Audio();
        this.player = new playerManager();
        this.player.init({
            element : this.element,
            audio : this.audioEl,
            audioFileSrc : this.element.data('src')
        
        });
        
        this.progressbar = new progressBarDraw.Linear({wrap : this.element});

        this.setAudioCallbackFunc();
        this.attachEvent();
    },

    /* 오디오 사이클 callback 함수 세팅 */
    setAudioCallbackFunc : function(){
        var that = this;
        var barW = this.bar.outerWidth();
        var thumbW = this.element.find('.rec_bar_pointer').outerWidth();

        this.player.setLoadeddata(_audioLoadedata);
        this.player.setTimeupdate(_audioTimeupdate);
        this.player.setEnded(_audioEnded);
        this.player.setBarEvent(_audioAdjust);
        
        // 오디오 로드 시
        function _audioLoadedata(duration){
            that.setTimer(duration * 1000, 0);        
        }

        // 오디오 타이머 시
        function _audioTimeupdate(currentTime, duration){
            that.setTimer(currentTime * 1000, (currentTime / duration) * (barW - thumbW));
        }

        // 오디오 종료 시
        function _audioEnded(duration){
            that.resume(false);
            that.setTimer(duration * 1000, 0);

            // @see record.html
            $(document).trigger('historyAudioPlaying', that.player);
        }

        // 로딩 바 이벤트 시
        function _audioAdjust(e, audio){
            that.progressbar.input(e, audio);

        }

    },

    attachEvent : function(){
        var that = this;
        
        this.controlBtn.on('click', function(e){
            e.preventDefault();

            that.resume();
            $(document).trigger('historyAudioPlaying', that.player);
        });
    },

    resume : function(){
        (!this.player.playing) ? this.play() : this.pause();
    },

    play : function(){
        this.controlBtn.addClass('playing')
                       .find('.hidden').text('pause');

        this.player.audio.play();
        this.player.playing = true;
    },

    pause : function(){
        this.controlBtn.removeClass('playing')
                       .find('.hidden').text('play');

        this.player.audio.pause();
        this.player.playing = false;
    },    

    /** 타이머 시간 값 셋팅 
     * @param {Number} time 시간 값
     * @param {Number} currentW 바를 그리기 위한 시간 당 width 값
     */
   setTimer : function(time, currentW){
        this.progressbar.draw(currentW);
        this.element.find('.timer').html(StringUtils.makeTimeString(time, this.options.timeFormat));
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

            this.controlBtn.on('click', function(){
                alert("지원하지 않는 인터넷 브라우저입니다.\n녹음기 서비스는 크롬에 최적화 되어 있습니다.")
            
            });

            return true;
        
        }else{
            return false;
        
        }
    },
};