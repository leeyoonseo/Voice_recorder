# 녹음기
##### AudioRecorderManager.RecorderView
<pre><code>
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

// 녹음기 리셋
AudioRecorderManager.RecordView.reset();</code></pre>

##### AudioRecorderManager.PlayerView
<pre><code>// 플레이어 옵션 설정 및 이벤트 바인딩등의 준비 작업, audioSrc 삽입
AudioRecorderManager.PlayerView.ready(audioSrc);

// 재생
AudioRecorderManager.PlayerView.play();

// 일시정지
AudioRecorderManager.PlayerView.pause();

// 저장
AudioRecorderManager.PlayerView.save();</code></pre>