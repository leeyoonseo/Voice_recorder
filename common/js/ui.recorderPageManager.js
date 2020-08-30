 /**
  * 녹음기 화면 UI 매니저
  * @author Lee Yoon Seo (2019.09)
  * @version 1.0.0
  * @see utils.StringUtil.js
  * @see manager.TimeManager.js
  * @see FoxRecordUI.js
  * @support Chrome | fireFox | Edge | Safari | Opera 
 */
window.recorderPageManager = {
    name : "recorderPageManager",
    version : "1.0.0"
};//recorderPageManager

/** 
 * 녹음 화면
 * @constructor recorderPageManager
*/
recorderPageManager.RecordView = (function($){

    var $UI = $('#recorderArea');

    // [D] 최대 녹음 값, 1000 = 1초
    var TIME_LIMIT = 1000 * 60 * 10;
    var TIME_FORMAT = 'mm:ss';

    var isRecording = false;
    var progressbar;
    var _timer;

    //------------------- public ↓

    function _init(){
        if (progressbar) progressbar.reset();

        $UI.hide()
           .find('.pie_pointer').hide().end()
           .find('.bounce_circle').removeClass('blink').end()
           .find('.btn_box button').off('click').hide();

        _clearTimer();
    };

    function _ready(){
        // audioRecorder.saveRecord = false;
        recorderPageManager.PlayerView.init();
        progressbar = new progressBarDraw.Circle('.pie_wrap');

        $UI.show()
           .find('.info').show().end()
           .find('.btn_box').find('button').hide().end()
           .find('.start').one('click', _onStart).show();

        _setTimer();
        // audioRecorder.init();
    };

    /**
     * 타이머&로딩 바 셋팅, 녹음중에 초마다 호출
     * @param {Number} time 타이머 진행 시간 값
     */
    function _recording(time){
        // if (audioRecorder.audio) {
        //     if (Number(audioRecorder.audio.currentTime) !== Number(time.time / 1000)) {
        //         _timer.currentTime = audioRecorder.audio.currentTime * 1000;
        //     }
        // }
        progressbar.draw( 360 * time.time / TIME_LIMIT );
        $UI.find('.timer').text(time.format);
    };

    function _record(){
        _timer.start();
        isRecording = true;

        $UI.addClass('active')
           .find('.pie_pointer').show().end()
           .find('.bounce_circle').addClass('blink').end()
           .find('.start').hide().end()
           .find('.pause').show();
    };

    function _pause(){
        // audioRecorder.pause();
        _timer.stop();
        isRecording = false;

        $UI.removeClass('active')
            .find('.pause').hide().end()
            .find('.start').show();
    };

    function _stop(){
        _pause();
        // audioRecorder.stop();
    };

    //------------------- 이벤트 핸들러들 ↓

    function _onStart(){
        // audioRecorder.start();
        // if (!audioRecorder.recorder) {
        //     return;
        // }

        $UI.addClass('active')
           .find('.info').hide().end()
           .find('.start, .pause').on('click', _onResume).hide().end()
           .find('.stop').on('click', _onStop).show().end()
           .find('.again').on('click', _onRestart).show();

        _record();
    };

    function _onRestart(){
        _pause();
    
        LayerMessageBox.open({
            type : 2
        }, '녹음된 내용이 저장되지 않습니다.\n다시 녹음 할까요?', function(isState){
            if(!isState) return false;

            // audioRecorder.goRestart = true;
            // audioRecorder.stop();

            _init();
            _ready();
        });
    };

    function _onResume(){
        if(isRecording){
            _pause();

        }else{
            // audioRecorder.resume();
            _record();

        }         
    };

    function _onStop(){
        // audioRecorder.goRestart = false;
        _stop();
    };

    //------------------- private ↓

    
    function _setTimer(){
    _clearTimer();

    // 타이머
    _timer = new TimeManager();
        _timer.setup({
            startTime: 0,
            endTime: TIME_LIMIT,
            intervalGap: 10,
            displayFormat: TIME_FORMAT,

            // 타이머 진행 시
            onProgress: function(a, b){
                _recording({
                    format : a,
                    time : b
                });
            },

            // 제한 시간 초과 시
            onComplete : function(){
                _stop();
            }
        });
    };

    function _clearTimer(){
        if(!_timer) return false;

        _timer.stop();
        _timer = null;
    };

    _init();

    return { 
        init : _init, 
        ready : _ready, 
        record : _record, 
        pause : _pause, 
        stop : _stop 
    };

}(jQuery));//FoxRecordUI.RecordView

/** 
 * 재생 화면
 * @constructor recorderPageManager
*/
recorderPageManager.PlayerView = (function($){

    var isFirstPlay = true; // 첫번째 재생 시 사용

    var $UI = $('#playerArea');
    var bar = $UI.find('.rec_bar');
    var thumbW = $UI.find('.rec_bar_pointer').outerWidth();

    var audioEl;
    var player;

    var TIME_FORMAT = 'mm:ss';
    var progressbar;

    //------------------- public ↓

    function _init(){
        if(progressbar) progressbar.reset();

        audioEl = null;
        player = null;

        $UI.hide()
           .find('.controller button').off('click');
    };

    function _ready(audioBlob){
        audioEl = new Audio();
        player = new playerManager();
        progressbar = new progressBarDraw.Linear({
            wrap : '.rec_box',
            progress : '.rec_bar_played',
            thumb : '.rec_bar_pointer',
            bar : '.rec_bar'
        });

        // 오디오 셋팅
        player.init({
            element : '.player_ready',
            bar : '.rec_bar',
            audio : audioEl,
            audioFileSrc : audioBlob
        });

        // audio 사이클
        player.setLoadeddata(_audioLoadedata);
        player.setTimeupdate(_audioTimeupdate);
        player.setEnded(_audioEnded);
        player.setBarEvent(_audioAdjust);

        recorderPageManager.RecordView.init();
        _attachEvent();
    };  

    function _attachEvent(){
        $UI.show()
           .find('.play').on('click', _onResume).show().end()
           .find('.pause').on('click', _onResume).hide().end()
           .find('.save').on('click', _onSave).show().end()
           .find('.again').on('click', _onRestart).show().end()
           .find('.timer_limit, .timer').text(StringUtils.makeTimeString(0, TIME_FORMAT));
    }

    function _dettachEvent(){
        $UI.show()
           .find('.play, .pause, .save, .again').off('click');
    }

    function _play(){
        if(isFirstPlay) isFirstPlay = false;

        $UI.addClass('active')
           .find('.play').hide().end()
           .find('.pause').show();

        player.audio.play();
        player.playing = true;
    }    

    function _pause(){
        $UI.removeClass('active')
           .find('.pause').hide().end()
           .find('.play').show();

        player.audio.pause();
        player.playing = false;
    }
    
    function _stop(){
        player.audio.pause();
        player.audio.currentTime = 0;
    }

    function _save(){
        _pause();
        // audioRecorder.save();
        $UI.find('.save').attr('disabled', true);
    }

    /* 오디오 사이클 callback 함수 */
    function _audioLoadedata(duration){
        progressbar.draw(0);
        $UI.find('.timer_limit, .timer')
            .text(StringUtils.makeTimeString(duration * 1000, TIME_FORMAT));
    }

    function _audioTimeupdate(currentTime, duration){
        progressbar.draw((currentTime / duration) * (bar.outerWidth() - thumbW));
        $UI.find('.timer, .timer_current').html(StringUtils.makeTimeString(currentTime * 1000, TIME_FORMAT));
    }

    function _audioEnded(){
        _pause();
            
        progressbar.draw(0);
        $UI.find('.timer_current, .timer')
           .text(StringUtils.makeTimeString(0, TIME_FORMAT));
    }

    function _audioAdjust(e, audio){
        progressbar.input(e, audio);
    }

    //------------------- 이벤트 핸들러들 ↓

    /**
     * 재생, 일시정지 상태 여부
    */
    function _onResume(){
        (!player.playing) ? _play() : _pause();
    }
    
    // 녹음 재시작 클릭
    function _onRestart(){
        _pause();

        // var message = (audioRecorder.saveRecord) ? '다시 녹음 할까요?' : '녹음된 내용이 저장되지 않습니다.\n다시 녹음 할까요?';
        
        LayerMessageBox.open({
            type : 2
        }, message, function(isState){
            if(!isState) return false;

            isFirstPlay = true;

            _stop();
            _dettachEvent();

            recorderPageManager.RecordView.ready();
            $UI.find('.save').removeAttr('disabled');
            $UI.find('.timer, .timer_current').text(StringUtils.makeTimeString(0, TIME_FORMAT));
        });
    };

    function _onSave(){
        _save();
    };


    return { 
        init : _init, 
        ready : _ready,
        play : _play,
        pause : _pause,
        save : _save
    };

}(jQuery));//FoxRecordUI.PlayerView

