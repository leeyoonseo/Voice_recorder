'use strict';
// socket
var socket = {
    socket_obj: null,
    socket_uid: null,
    input_type: null,
    output_type: 'mp3',
    socket_urls: [uploadUrl],
    output_url: downloadUrl,
    socket_url: null,
    create_date: null,
    connection: function() {
        if (socket.socket_urls.length === 0) {
            var error = {
                code: 500,
                message: '녹음서버에 접속할 수 없습니다.'
            };

            event_trigger("NotAvailableConnectServer", error);
            return;
        }
        socket.socket_url = socket.socket_urls[parseInt(Math.random() * (socket.socket_urls).length)];
        // socket open
        // 커넥션 에러시 사용자 알림 처리
        if (!socket.socket_obj) {
            socket.generateUid();

            socket.socket_obj = io(socket.socket_url);

            socket.socket_obj.on('connect', function() {
                var create_date = new Date().toISOString().slice(0, 10);
                var regExp = new RegExp("-", 'gi');
                socket.create_date = create_date.replace(regExp, "");

                socket.socket_obj.emit('join', {
                    uid: socket.socket_uid,
                    create_date: socket.create_date
                });

                var blob = audioRecorder.recorder.getBlob();

                if (blob.type === 'audio/webm') {
                    socket.input_type = 'webm';
                } else if (blob.type === 'audio/pcm') {
                    socket.input_type = 'pcm';
                } else if (blob.type === 'audio/ogg') {
                    socket.input_type = 'ogg';
                } else {
                    socket.input_type = 'wav';
                }

                socket.socket_obj.emit('stream', {
                    blob: blob,
                    uid: socket.socket_uid,
                    input_type: socket.input_type,
                    output_type: socket.output_type,
                    create_date: socket.create_date,
                    stop: true
                });
            });

            socket.socket_obj.on('connect_error', function() {
                socket.socket_obj.close();
                socket.socket_obj = null;

                socket.socket_urls.splice(socket.socket_urls.indexOf(socket.socket_url), 1);
                socket.connection();
            });

            socket.socket_obj.on('complete', function(file_name) {
                file_name += "?"+(Date.now());
                recordFileName = file_name;
                audioRecorder.saveUserRecording();
                socket.close();
            });
        }
    },
    stream: function() {

        var blob = audioRecorder.recorder.getBlob();
        var stop = false;

        if (socket.socket_obj) {
            if (blob.type == 'audio/webm') {
                socket.input_type = 'webm';
            } else if (blob.type == 'audio/pcm') {
                socket.input_type = 'pcm';
            } else if (blob.type == 'audio/ogg') {
                socket.input_type = 'ogg';
            } else {
                socket.input_type = 'wav';
            }

            socket.socket_obj.emit('stream', {
                blob: blob,
                uid: socket.socket_uid,
                input_type: socket.input_type,
                output_type: socket.output_type,
                create_date: socket.create_date,
                stop: stop
            });
        }
    },
    close: function() {
        socket.socket_obj.close();
        socket.socket_obj = null;
    },
    generateUid: function() {
        var d = new Date();
        var m = d.getTime();
        socket.socket_uid = (new Date().getTime() + '_' + Math.round(Math.random() * 10000));
    }
};

//오디오 녹음 및 실행
var audioRecorder = {
    //checkingBrowser
    isEdge: navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob),
    //checkingBrowser
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    recorder: null,
    microphone: null,
    audio: null,
    time: 0,
    goRestart: false,
    saveRecord: false,
    init: function() {
        this.audio = document.querySelector('audio');

        this.captureMicrophone(function(mic) {
            audioRecorder.microphone = mic;

            if(isSafari) {
                audioRecorder.replaceAudio();

                audioRecorder.audio.muted = true;
                audioRecorder.audio.srcObject = audioRecorder.microphone;
                return;
            }
        });
    },

    captureMicrophone: function(callback){
        if (this.microphone && this.microphone.active) {
            callback(this.microphone);
            return;
        }

        if (this.checkAvailableBrowser()) {
            if (this.isSafari) {
                navigator.mediaDevices.getUserMedia({
                    audio: true
                }).then(function(mic) {
                    callback(mic);
                }).catch(function(error) {
                    event_trigger(
                        "RecorderPermission",
                        {code: 403, message: '마이크를 연결하거나, 마이크 액세스를 허용해주세요.\n 마이크 액세스 허용은 브라우저의 마이크 허용 버튼을 눌러 확인하실 수 있습니다.'}
                    );
                });
            } else {
                navigator.getUserMedia(
                    {audio: true},
                    function(mic) {
                        audioRecorder.microphone = mic;
                        callback(mic);
                    },
                    function() {
                        event_trigger(
                            "RecorderPermission",
                            {code: 403, message: '마이크를 연결하거나, 마이크 액세스를 허용해주세요.\n 마이크 액세스 허용은 브라우저의 마이크 허용 버튼을 눌러 확인하실 수 있습니다.'}
                        );
                    }
                );
            }

        }
    },

    isAvailableBrowser: function() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        if (navigator.getUserMedia === undefined
            && navigator.mediaDevices !== undefined && navigator.mediaDevices.getUserMedia !== undefined) {
            navigator.getUserMedia = navigator.mediaDevices.getUserMedia;
        }

        return navigator.getUserMedia !== undefined && typeof navigator.getUserMedia === 'function';
    },

    checkAvailableBrowser: function() {
        if (!this.isAvailableBrowser()) {
            event_trigger("BrowserSupport", {
                code: 404,
                message: '이 브라우저는 녹음기능을 지원하지 않습니다.'
            });

            return false;
        } else {
            return true;
        }
    },

    stopRecordingCallback: function() {
        audioRecorder.replaceAudio(URL.createObjectURL(audioRecorder.recorder.getBlob()));
        recorderPageManager.PlayerView.ready(audioRecorder.audio.src);
    },

    replaceAudio: function(src){
        var newAudio = document.createElement('audio');
        newAudio.controls = true;

        if (src) {
            newAudio.src = src;
        }

        var parentNode = this.audio.parentNode;
        parentNode.innerHTML = '';
        parentNode.appendChild(newAudio);

        this.audio = newAudio;
    },

    start: function() {
        recordedTime = 0;
        if (!this.microphone || !this.microphone.active) {
            this.captureMicrophone(function(mic) {
                audioRecorder.microphone = mic;

                if(isSafari) {
                    audioRecorder.replaceAudio();

                    audioRecorder.audio.muted = true;
                    audioRecorder.audio.srcObject = audioRecorder.microphone;
                }
                audioRecorder.start();
            });
            return;
        }

        this.replaceAudio();

        this.audio.muted = true;
        this.audio.srcObject = this.microphone;

        var options = {
            type: 'audio',
            numberOfAudioChannels: isEdge ? 1 : 2,
            checkForInactiveTracks: true,
            bufferSize: 16384
        };

        if(isSafari || isEdge) {
            options.recorderType = StereoAudioRecorder;
        }

        if(navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
            options.sampleRate = 48000; // or 44100 or remove this line for default
        }

        if(isSafari) {
            options.sampleRate = 44100;
            options.bufferSize = 4096;
            options.numberOfAudioChannels = 2;
        }

        if(this.recorder) {
            this.recorder.destroy();
            this.recorder = null;
        }

        this.recorder = RecordRTC(this.microphone, options);

        this.recorder.startRecording();
        this.audio.play();
    },

    stop: function() {
        if (audioRecorder.goRestart) {
            this.recorder.stopRecording();
        } else {
            if (!this.microphone.active) {
                LayerMessageBox.open({type : 1}, '마이크 연결 상태가 불량하여 녹음이 종료되었습니다.');
            }
            recordedTime = this.audio.currentTime;
            this.recorder.stopRecording(this.stopRecordingCallback);
        }
    },

    save: function() {
        if (!audioRecorder.loadingIndicator) {
            audioRecorder.loadingIndicator = LoadingIndicator();
        }
        audioRecorder.loadingIndicator.show();

        socket.connection();
    },

    saveUserRecording: function() {
        if (recordFileName === '') {
            audioRecorder.loadingIndicator.hide();
            $('#recorderArea').find('.save').attr('disabled', false);
            LayerMessageBox.open({type : 0},'문제가 발생하였습니다. 다시 시도해주세요.');
            return;
        }

        $.ajax({
            method: 'POST',
            url: '/' + rootPath + '/record/save_html5',
            async: false,
            data: {
                fc_id: contentId,
                rec_time: this.audio.duration != 'Infinity' ? this.audio.duration : recordedTime,
                rec_filename: recordFileName
            }
        }).success(function(result){
            audioRecorder.loadingIndicator.hide();
            result = JSON.parse(result);

            if (result.code) {
                audioRecorder.saveRecord = true;
                LayerMessageBox.open({
                    type : 2
                    }, '녹음파일이 저장되었습니다.\n녹음기록을 보시겠습니까?', function(isState){
                    if(!isState) return false;
                    window.opener.location = '/' + rootPath + '/record';
                    self.close();
                });
            } else {
                $('#recorderArea').find('.save').attr('disabled', true);
                LayerMessageBox.open({
                    type : 1,
                    }, '문제가 발생하였습니다. 다시 시도해주세요.'
                );
            }
        }).fail(function(){
            audioRecorder.loadingIndicator.hide();

            $('#recorderArea').find('.save').attr('disabled', true);
            LayerMessageBox.open({type : 1}, '문제가 발생하였습니다. 다시 시도해주세요.');
        });
    },

    pause: function() {
        this.recorder.pauseRecording();
        this.audio.pause();
    },

    resume: function() {
        this.recorder.resumeRecording();
        this.audio.play();
    }


};

function event_trigger(eventName, options)
{
    var errorType = ($.inArray(eventName, ['BrowserSupport', 'RecorderPermission']) >= 0) ? 'clientError' : 'serverError';

    LayerMessageBox.open({
        type : 1,
        custom : true,
        button : [
            {
                target : '.submit',
                class : 'needGuide',
                label : (errorType === 'clientError') ? '해결 방법 보기' : '',
                event : function(){
                    if(errorType === 'clientError'){
                        window.opener.location = '/' + rootPath + '/forum/article_topic/record';
                    }
                    self.close();
                }
            },{
                target : '.btn_layer_close',
                event : function(){
                    if(errorType === 'clientError'){
                        $('.start').attr('disabled', true);
                        $('.recording').addClass('off');
                        return;
                    }
                    self.close();
                }
            }
        ]
    }, options.message);
}
