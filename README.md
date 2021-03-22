# LSCH-17 녹음기HTML 전환
## 전달 사항
1. TODO 가 붙은 항목을 확인부탁드립니다.
2. 파일 전체가 수정된 HTML
   1. free_recorder.html
   2. recordings_remark.html
   3. view_recording.html
   4. memo.html
3. CSS는 오픈당시에 덮여쓰기 해야하는 부분들이 있으므로 오픈 당일 퍼블리셔가 직접 작업 진행해야합니다.   

## 파일 변경사항
### 1. ui.LayerMessageBox.js --> LayerMessageBox.js

#### 사용법
- '0' 타입과 '1' 타입 alert로 통합
- '2' 타입은 confirm으로 변경

##### Example - alert
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({ 
    type : 'alert'
}, '메세지를 입력해주세요.\n안내창입니다.');
</code></pre>
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'alert',
    message : '메세지를 입력해주세요.\n안내창입니다.'
});</code></pre>


##### Example - comfirm
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
    message : '메세지를 입력해주세요.\n안내창입니다.'
});</code></pre>
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
}, '메세지를 입력해주세요.\n안내창입니다.');
</code></pre>

##### Example - Callback
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
    message : '메세지를 입력해주세요.\n안내창입니다.'
}, function(isStatus){
    if(isStatus){
        // 확인버튼 클릭 시 실행 영역
    }else{
        // 취소버튼 클릭 시 실행 영역
    }
});
</code></pre>

##### Example - Custom
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
    custom : true,
    message : '메세지입니다.',
    button : [
        {
            target : '.layer_submit',
            class : 'popup_submit',
            label : '전송',
            event : function(){
                // 전송버튼 클릭 시 이벤트 영역
            }
        },{
            target : '.layer_close',
            event : function(){
                // X 버튼 클릭 시 이벤트 영역
            }
        },{
            target : '.layer_cancel',
            class : 'popup_close',
            label : '닫기',
            event : function(){
                // 닫기버튼 클릭 시 이벤트 영역
            }
        }
    ]
});
</code></pre>

### 2. ui.LoadingIndicator.js --> LoadingIndicator.js
#### 사용법
<pre><code>var $loader = LoadingIndicator({
    className : 'progress',
    message : '로딩중...',
});

// 보여주기
$loader.show();

// 감추기
$loader.hide();
</code></pre>

### 3. ui.playerManager.js --> AudioPlayer.js
#### 사용법
<pre><code>var $el = $('.sound_player');
var player = new AudioPlayer();

// 최초 init
player.init({
    element : $el
});

// 플레이어 진행바 disabled 컨트롤
player.eventDisabled(true);
player.eventDisabled(false);
</code></pre>

### 4. ui.playerPageManager.js --> AudioPlayerManager.js   
#### 사용법
<pre><code>var $element = $('.sound_player');
var player = new AudioPlayerManager().init({ element : $element });</code></pre>

### 5. ui.progressBarDraw.js --> ProgressBar.js   

### 6. ui.recorderPageManager.js --> AudioRecorderManager.js
#### 사용법
##### AudioRecorderManager.RecordView
<pre><code>// 최초 녹음기 init
AudioRecorderManager.RecordView.init();

// 녹음기 옵션 설정 및 이벤트 바인딩등의 준비 작업
AudioRecorderManager.RecordView.ready();

// 녹음
AudioRecorderManager.RecordView.record();

// 타이머 값 입력, 진행바에 값 입력(진행 초마다 호출 필수)
AudioRecorderManager.RecordView.recording();

// 녹음 일시정지
AudioRecorderManager.RecordView.pause();

// 녹음정지
AudioRecorderManager.RecordView.stop();

// 마이크 볼륨 값에 따른 ui 설정
// @param {number} - 볼륨 값
AudioRecorderManager.RecordView.inputMicVolume(volume);

// 녹음기 리셋
AudioRecorderManager.RecordView.reset();</code></pre>

##### AudioRecorderManager.PlayerView
<pre><code>// 최초 플레이어 init, audioSrc 삽입
AudioRecorderManager.PlayerView.init(audioSrc);

// 플레이어 옵션 설정 및 이벤트 바인딩등의 준비 작업
AudioRecorderManager.PlayerView.ready();

// 재생
AudioRecorderManager.PlayerView.play();

// 일시정지
AudioRecorderManager.PlayerView.pause();

// 저장
AudioRecorderManager.PlayerView.save();</code></pre>