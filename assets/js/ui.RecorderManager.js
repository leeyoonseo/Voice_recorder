/**
 * 녹음기, 플레이어 페이지 매니저
 * @author Lee Yoon Seo (2019.09~)
 * @version 1.2.0
 * @support Chrome | fireFox | Edge | Safari | Opera
 */

'use strict';

const VERSION = '1.2.0';

var DEFAULT = {
    TIME_LIMIT : 30000, // 1000 = 1초
    TIME_FORMAT : 'mm:ss',
};

// RecorderManager 진행 사이클
var RM_CYCLE = {
    RECORDER_READY : 'rm-recorder-ready',
    RECORDER_RECORD : 'rm-recorder-record',
    RECORDER_PAUSE : 'rm-recorder-pause',
    RECORDER_STOP : 'rm-recorder-stop',
    PLAYER_READY : 'rm-player-ready',
    PLAYER_PLAY : 'rm-player-play',
    PLAYER_PAUSE : 'rm-player-pause',
    PLAYER_STOP : 'rm-player-stop',
    SAVE : 'rm-save',
    RESET : 'rm-reset',
    WAITING : 'rm-waiting',
};

/**
 * 녹음기, 플레이어 매니저
 * @status 녹음기 상태 (*RM_CYCLE 참고)
 */
window.AudioRecorderManager = {
    name : "AudioRecorderManager",
    version : VERSION,
    status : RM_CYCLE.WAITING,
    recordTime: null,
};

AudioRecorderManager.RecordView = (function(){
    var $UI = $('#recorderArea');

    var progressbar = {
        init : function(){
            this.node && this.node.reset();
            this.node = this.node || new ProgressBar.Circle('.pie_wrap');

            return this;
        },

        setUp : function(time){
            this.node.draw( 360 * time / DEFAULT.TIME_LIMIT );
            return this;
        }
    };

    var timer = {
        init : function(){
            this.node = this.node || new TimeManager();

            this.node.setup({
                startTime: 0,
                currentTime: 0,
                endTime: DEFAULT.TIME_LIMIT,
                intervalGap: 10,
                displayFormat: DEFAULT.TIME_FORMAT,
                onProgress: function(format, time){
                    this.currentTime = time;
                    AudioRecorderManager.RecordView.recording(time, format);
                },
            });

            return this;
        },

        start : function(){
            this.node.start();
            return this;
        },

        stop : function(){
            AudioRecorderManager.recordTime = this.node.currentTime;
            this.node.stop();
            return this;
        },

        clear : function(){
            if(!this.node) return false;

            this.node.stop();
            this.node = null;

            return this;
        }
    };

    var init  = function(){
        chunks = [];
        $UI.removeClass('active');
        timer.clear();
        dettachEvent();

        return this;
    };

    var ready = function(){
        AudioRecorderManager.status = RM_CYCLE.RECORDER_READY;
        AudioRecorderManager.PlayerView.init();
        progressbar.init();
        timer.init();
        attachEvent();

        $(document).trigger(RM_CYCLE.RECORDER_READY, $UI);
        return this;
    };

    var attachEvent = function(){
        $UI.show()
        .find('.control_btns').find('button').show().end()
        .find('.btn_record').on('click', handlerResume).show().end()
        .find('.btn_stop').on('click', handlerStop).show().end();

        return this;
    };

    var dettachEvent = function(){
        $UI.addClass('init').hide()
        .find('.pie_pointer').hide().end()
        .find('.btn_stop').prop('disabled', true).end()
        .find('button').off('click').hide();

        return this;
    };

    var record = function(){
        AudioRecorderManager.status = RM_CYCLE.RECORDER_RECORD;
        timer.start();

        $UI.removeClass('init').addClass('active')
        .find('.btn_stop').attr('disabled', false).end()
        .find('.pie_pointer').show();

        $(document).trigger(RM_CYCLE.RECORDER_RECORD, $UI);

        return this;
    };

    /**
     * 녹음 중 타이머, 진행 바를 설정 함수
     * @param {Number} time - 시간 값 
     * @param {String} format - 타이머 포맷
     */
    var recording = function(time, format){
        progressbar.setUp(time);
        $UI.find('.timer').text(format);

        return this;
    };

    var pause = function(){
        AudioRecorderManager.status = RM_CYCLE.RECORDER_PAUSE;
        timer.stop();

        $UI.removeClass('active')
        .find('.btn_record').show();

    $(document).trigger(RM_CYCLE.RECORDER_PAUSE, $UI);

    return this;
    };

    var stop = function(){
        pause();

        $(document).trigger(RM_CYCLE.RECORDER_STOP, $UI);
        return this;
    };

    var reset = function(){
        AudioRecorderManager.RecordView.init();
        AudioRecorderManager.RecordView.ready();

        $(document).trigger(RM_CYCLE.RESET, $UI);

        return this;
    };

    function handlerResume(){
        var isRecordActive = $UI.hasClass('active');
        isRecordActive ? pause() : record();
    };

    function handlerStop(){
        stop();
    };

    return {
        reset,
        init,
        ready,
        record,
        recording,
        pause,
        stop,
    };

}());

/**
 * 재생 화면
 * @constructor AudioRecorderManager
 */
AudioRecorderManager.PlayerView = (function(){
    var $UI = $('#playerArea');

    var progressbar = {
        init : function(){
            this.node && this.node.reset();
            this.node = this.node || new ProgressBar.Linear({
                wrap : '.player .ui_status_bar',
                progress : '.playing',
                thumb : '.status_pointer',
                bar : '.status_bar'
            });

            return this;
        },

        draw : function(per){
            this.node.draw(per);

            return this;
        },

        input : function(e, audio){
            this.node.input(e, audio);

            return this;
        }
    };

    var player = {
        init : function(audioSrc){
            audioSrc = audioSrc ? audioSrc : '../recorder/sample/audio0.mp3';
            
            this.node = this.node || new AudioPlayer();
            this.node.init({
                wrap : '.player',
                audioFileSrc : audioSrc,
                recordTime: AudioRecorderManager.recordTime,
            });

            return this;
        },

        setPlaying : function(flag){
            this.node.playing = flag;

            return this;
        },

        getPlayStatus : function(){
            return this.node.playing ? true : false;
        },

        setCurrentTime(){
            this.node.audio.currentTime = 0;

            return this;
        },

        setLifeCycle : function(){
            this.node.setLoadeddata(function(duration){
                progressbar.draw(0);
                $UI.find('.total_time').text(StringUtils.makeTimeString(duration * 1000, DEFAULT.TIME_FORMAT));
            });

            this.node.setTimeupdate(function(currentTime, duration){
                var barW = $UI.find('.status_bar').outerWidth();
                var thumbW = $UI.find('.status_bar .status_pointer').outerWidth();

                progressbar.draw((currentTime / duration) * (barW - thumbW));
                $UI.find('.timer, .current_time')
                .html(StringUtils.makeTimeString(currentTime * 1000, DEFAULT.TIME_FORMAT));
            });

            this.node.setEnded(function(){
                pause();
                progressbar.draw(0);

                $UI.find('.btn_stop').attr('disabled', true).end()
                    .find('.current_time, .timer')
                    .text(StringUtils.makeTimeString(0, DEFAULT.TIME_FORMAT));
            });

            this.node.setBarEvent(function(e, audio){
                progressbar.input(e, audio);

                $UI.find('.btn_stop').prop('disabled', false);
            });

            return this;
        },

        play : function(){
            this.node.audio.play();

            return this;
        },

        pause : function(){
            this.node.audio.pause();

            return this;
        },
    };

    var init = function(){
        $UI.hide();
        dettachEvent();

        return this;
    };

    /**
     * @param {String} audioSrc - 오디오 경로 
     */
    var ready = function(audioSrc){

        AudioRecorderManager.status = RM_CYCLE.PLAYER_READY;

        progressbar.init();

        // TODO 오디오 링크 추가
        player.init(audioSrc).setLifeCycle();

        AudioRecorderManager.RecordView.init();
        attachEvent();

        $(document).trigger(RM_CYCLE.PLAYER_READY, $UI);

        return this;
    };

    var attachEvent = function(){
        $UI.show()
            .find('.btn_play').on('click', handlerResume).show().end()
            .find('.btn_stop').on('click', stop).end()
            .find('.total_time, .current_time').text(StringUtils.makeTimeString(0, DEFAULT.TIME_FORMAT));

        return this;
    };

    var dettachEvent = function(){
        $UI.find('.btn_play, .btn_stop').off('click');

        return this;
    };

    var play = function(){
        AudioRecorderManager.status = RM_CYCLE.PLAYER_PLAY;

        $UI.addClass('active').find('.btn_stop').removeAttr('disabled');
        player.play().setPlaying(true);

        $(document).trigger(RM_CYCLE.PLAYER_PLAY, $UI);

        return this;
    };

    var pause = function(){
        AudioRecorderManager.status = RM_CYCLE.PLAYER_PAUSE;

        $UI.removeClass('active');

        player.pause();
        player.setPlaying(false);

        $(document).trigger(RM_CYCLE.PLAYER_PAUSE, $UI);

        return this;
    };

    var stop = function(){
        pause();

        player.setCurrentTime(0);
        $UI.find('.btn_stop').attr('disabled', true);

        $(document).trigger(RM_CYCLE.PLAYER_STOP, $UI);

        return this;
    };

    var save = function(){
        stop();
        dettachEvent();
        $UI.find('.timer, .current_time').text(StringUtils.makeTimeString(0, DEFAULT.TIME_FORMAT));
        AudioRecorderManager.RecordView.ready();

        $(document).trigger(RM_CYCLE.SAVE, $UI);

        return this;
    };

    var restart = function(){
        stop();
        dettachEvent();

        AudioRecorderManager.RecordView.ready();
        player.setCurrentTime(0);
    };

    function handlerResume(){
        player.getPlayStatus() ? pause() : play();
    }

    return {
        restart,
        init,
        ready,
        play,
        pause,
        save
    };
}());
//FoxRecordUI.PlayerView
