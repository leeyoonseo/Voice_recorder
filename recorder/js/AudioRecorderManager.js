/**
 * 녹음기, 플레이어 페이지 매니저
 * @author Lee Yoon Seo (2019.09)
 * @update Lee Yoon Seo (2020.08)
 * @version 1.1.0
 * @support Chrome | fireFox | Edge | Safari | Opera
 */

//  TODO progress 앞에 대문자로 할 것!!
'use strict';

var DEFAULT = {
    TIME_LIMIT : 6000, // default : 60000
    TIME_FORMAT : 'mm:ss',
};

// AudioRecorderManager 진행 사이클
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
    version : "1.1.0",
    status : RM_CYCLE.WAITING,
    options : {
        autoStart : false,
        autoNextStep : true,
    },
};

AudioRecorderManager.RecordView = (function(){
    var $UI = $('#recorderArea');
    var progress = {
        init : function(){
            this.node && this.node.reset();
            this.node = this.node || new Circle({ element : '.progress-circle' });
          
            // const { progress } = obj.dataset;
            // new Progress({ element : obj }).draw(progress);
            return this;
        },

        setUp : function(time){
            this.node.draw( 360 * time / DEFAULT.TIME_LIMIT );
            return this;
        }
    };
    var timer = {
        init : function(){
            this.node = this.node || new TimeManager({
                startTime: 0,
                endTime: DEFAULT.TIME_LIMIT,
                intervalGap: 10,
                displayFormat: DEFAULT.TIME_FORMAT,
                onProgress: function(format, time){
                    AudioRecorderManager.RecordView.recording(time, format);
                },
                onComplete : function(){
                    if(AudioRecorderManager.options.autoNextStep){
                        AudioRecorderManager.PlayerView.ready();
                    }
                },
            });

            return this;
        },

        start : function(){
            this.node.start();
            return this;
        },

        stop : function(){
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
        $UI.removeClass('active');
        timer.clear();
        dettachEvent();

        return this;
    };

    /**
     * 녹음기 준비
     * @param {Object} options - 자동시작여부, 플레이어 자동 전환여부등의 옵션값이 담긴 객체
     * @param {boolean} options.autoStart - 자동시작 여부
     * @param {boolean} options.autoNextStep - 플레이어 자동전환 여부
     */
    var ready = function(options){
        AudioRecorderManager.status = RM_CYCLE.RECORDER_READY;

        if(options){
            AudioRecorderManager.options = $.extend({}, AudioRecorderManager.options, options);
        }

        AudioRecorderManager.PlayerView.init();
        progress.init();
        timer.init();

        attachEvent();

        $(document).trigger(RM_CYCLE.RECORDER_READY, $UI);

        if(AudioRecorderManager.options.autoStart){
            AudioRecorderManager.RecordView.record();
        }

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
        progress.setUp(time);
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
        AudioRecorderManager.PlayerView.ready();

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

    /**
     * 마이크 볼륨 값
     * @param {Number} volume 
     */
    function inputMicVolume(volume){
        $UI.find('.status_bar').css('width', volume + '%');
    }

    // init();

    return {
        reset,
        init,
        ready,
        record,
        recording,
        pause,
        stop,
        inputMicVolume,
    };

}());
//FoxRecordUI.RecordView

/**
* 재생 화면
* @constructor AudioRecorderManager
*/
AudioRecorderManager.PlayerView = (function(){
    var $UI = $('#playerArea');
    var progress = {
        init : function(){
            this.node && this.node.reset();
            this.node = this.node || new ProgressBar({
                element : '.progress-linear',
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
            // TODO audioSrc 삽입 후 아래 if문 삭제 요청
            if(!audioSrc || $.trim(audioSrc)){
                audioSrc = '../recorder/sample/audio0.mp3';
            }
            // // TODO audioSrc 삽입 후 아래 if문 삭제 요청

            this.node = this.node || new AudioPlayer();
            this.node.init({
                wrap : '.player',
                audioFileSrc : audioSrc,
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

        setCurrentTime(time){
            this.node.audio.currentTime = 0;

            return this;
        },

        setLifeCycle : function(){
            this.node.setLoadeddata(function(duration){
                progress.draw(0);
                $UI.find('.total_time').text(StringUtils.makeTimeString(duration * 1000, DEFAULT.TIME_FORMAT));
            });

            this.node.setTimeupdate(function(currentTime, duration){
                var barW = $UI.find('.status_bar').outerWidth();
                var thumbW = $UI.find('.status_bar .status_pointer').outerWidth();

                progress.draw((currentTime / duration) * (barW - thumbW));
                $UI.find('.timer, .current_time')
                   .html(StringUtils.makeTimeString(currentTime * 1000, DEFAULT.TIME_FORMAT));
            });

            this.node.setEnded(function(){
                pause();
                progress.draw(0);

                $UI.find('.btn_stop').attr('disabled', true).end()
                    .find('.current_time, .timer')
                    .text(StringUtils.makeTimeString(0, DEFAULT.TIME_FORMAT));
            });

            this.node.setBarEvent(function(e, audio){
                progress.input(e, audio);

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

        progress.init();

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

    function handlerResume(){
        player.getPlayStatus() ? pause() : play();
    }

    return {
        init,
        ready,
        play,
        pause,
        save
    };
}());
//FoxRecordUI.PlayerView
