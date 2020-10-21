# LSCH-17 ������HTML ��ȯ
## ���� ����
1. TODO �� ���� �׸��� Ȯ�κ�Ź�帳�ϴ�.
2. ���� ��ü�� ������ HTML
   1. free_recorder.html
   2. recordings_remark.html
   3. view_recording.html
   4. memo.html
3. CSS�� ���´�ÿ� �������� �ؾ��ϴ� �κе��� �����Ƿ� ���� ���� �ۺ��Ű� ���� �۾� �����ؾ��մϴ�.   

## ���� �������
### 1. ui.LayerMessageBox.js --> LayerMessageBox.js

#### ����
- '0' Ÿ�԰� '1' Ÿ�� alert�� ����
- '2' Ÿ���� confirm���� ����

##### Example - alert
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({ 
    type : 'alert'
}, '�޼����� �Է����ּ���.\n�ȳ�â�Դϴ�.');
</code></pre>
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'alert',
    message : '�޼����� �Է����ּ���.\n�ȳ�â�Դϴ�.'
});</code></pre>


##### Example - comfirm
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
    message : '�޼����� �Է����ּ���.\n�ȳ�â�Դϴ�.'
});</code></pre>
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
}, '�޼����� �Է����ּ���.\n�ȳ�â�Դϴ�.');
</code></pre>

##### Example - Callback
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
    message : '�޼����� �Է����ּ���.\n�ȳ�â�Դϴ�.'
}, function(isStatus){
    if(isStatus){
        // Ȯ�ι�ư Ŭ�� �� ���� ����
    }else{
        // ��ҹ�ư Ŭ�� �� ���� ����
    }
});
</code></pre>

##### Example - Custom
<pre><code>var LayerMessageBox = new LayerMessageBox();

LayerMessageBox.open({
    type : 'confirm',
    custom : true,
    message : '�޼����Դϴ�.',
    button : [
        {
            target : '.layer_submit',
            class : 'popup_submit',
            label : '����',
            event : function(){
                // ���۹�ư Ŭ�� �� �̺�Ʈ ����
            }
        },{
            target : '.layer_close',
            event : function(){
                // X ��ư Ŭ�� �� �̺�Ʈ ����
            }
        },{
            target : '.layer_cancel',
            class : 'popup_close',
            label : '�ݱ�',
            event : function(){
                // �ݱ��ư Ŭ�� �� �̺�Ʈ ����
            }
        }
    ]
});
</code></pre>

### 2. ui.LoadingIndicator.js --> LoadingIndicator.js
#### ����
<pre><code>var $loader = LoadingIndicator({
    className : 'progress',
    message : '�ε���...',
});

// �����ֱ�
$loader.show();

// ���߱�
$loader.hide();
</code></pre>

### 3. ui.playerManager.js --> AudioPlayer.js
#### ����
<pre><code>var $el = $('.sound_player');
var player = new AudioPlayer();

// ���� init
player.init({
    element : $el
});

// �÷��̾� ����� disabled ��Ʈ��
player.eventDisabled(true);
player.eventDisabled(false);
</code></pre>

### 4. ui.playerPageManager.js --> AudioPlayerManager.js   
#### ����
<pre><code>var $element = $('.sound_player');
var player = new AudioPlayerManager().init({ element : $element });</code></pre>

### 5. ui.progressBarDraw.js --> ProgressBar.js   

### 6. ui.recorderPageManager.js --> AudioRecorderManager.js
#### ����
##### AudioRecorderManager.RecordView
<pre><code>// ���� ������ init
AudioRecorderManager.RecordView.init();

// ������ �ɼ� ���� �� �̺�Ʈ ���ε����� �غ� �۾�
AudioRecorderManager.RecordView.ready();

// ����
AudioRecorderManager.RecordView.record();

// Ÿ�̸� �� �Է�, ����ٿ� �� �Է�(���� �ʸ��� ȣ�� �ʼ�)
AudioRecorderManager.RecordView.recording();

// ���� �Ͻ�����
AudioRecorderManager.RecordView.pause();

// ��������
AudioRecorderManager.RecordView.stop();

// ����ũ ���� ���� ���� ui ����
// @param {number} - ���� ��
AudioRecorderManager.RecordView.inputMicVolume(volume);

// ������ ����
AudioRecorderManager.RecordView.reset();</code></pre>

##### AudioRecorderManager.PlayerView
<pre><code>// ���� �÷��̾� init, audioSrc ����
AudioRecorderManager.PlayerView.init(audioSrc);

// �÷��̾� �ɼ� ���� �� �̺�Ʈ ���ε����� �غ� �۾�
AudioRecorderManager.PlayerView.ready();

// ���
AudioRecorderManager.PlayerView.play();

// �Ͻ�����
AudioRecorderManager.PlayerView.pause();

// ����
AudioRecorderManager.PlayerView.save();</code></pre>