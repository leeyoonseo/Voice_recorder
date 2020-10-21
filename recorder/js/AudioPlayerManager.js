/**
 * ����� ������ �Ŵ���
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
     * ȣ�� �� ����
     * @param {Object} opts  ������ �¾� �� �����ϴ� �ɼ� ��
     * @param {String} opts.element  �÷��̾� �±��� Ŭ������ ���̵�
     * @param {String} opts.timeFormat  Ÿ�̸� ����
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

    // AudioPlayer, ProgressBar ������ ȣ��
    ready : function(){
        // ie8���� return false;
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

    /* ����� ����Ŭ callback �Լ� ���� */
    setAudio : function(){
        var that = this;
        var barW = this.player.bar.outerWidth();
        var pointerWidth = this.player.pointer.outerWidth();

        // ����� �ε�
        this.player.setLoadeddata(function(duration){
            that.playerStatus = PM_CYCLE.LOADED;
            that.setTimer(duration * 1000, 0);
        });

        // ����� Ÿ�̸� ����
        this.player.setTimeupdate(function(currentTime, duration){
            if(that.playerStatus === PM_CYCLE.STOP){
                that.setTimer(duration * 1000, 0);
            }else{
                that.playerStatus = PM_CYCLE.TIME_UPDATE;
                that.setTimer(currentTime * 1000, (currentTime / duration) * (barW - pointerWidth));
            }
        });

        // ����� ����
        this.player.setEnded(function(duration){
            that.playerStatus = PM_CYCLE.STOP;
            that.stop(duration);
        });

        // ����� �� �̺�Ʈ
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

    /** Ÿ�̸� �ð� �� ����
     * @param {Number} time �ð� ��
     * @param {Number} currentW �ٸ� �׸��� ���� �ð� �� width ��
     */
    setTimer : function(time, currentW){
        this.progressbar.draw(currentW);
        this.element.find('.current_time').html(StringUtils.makeTimeString(time, this.options.timeFormat));

        return this;
    },

    /**
     * ���� �������� �б��Ͽ� Ŭ�� �̺�Ʈ�� �ȳ� �˸�â ����
     * @return {Boolean} IE8���� ������ ����
     */
    isNotSupportBrowser : function(){
        var isNotSupport = ($('html').hasClass('lt-ie9')) ? true : false;

        if(isNotSupport){
            this.bar.on('click', function(){
                alert("�������� �ʴ� ���ͳ� �������Դϴ�.\n������ ���񽺴� ũ�ҿ� ����ȭ �Ǿ� �ֽ��ϴ�.")
            });

            this.playBtn.on('click', function(){
                alert("�������� �ʴ� ���ͳ� �������Դϴ�.\n������ ���񽺴� ũ�ҿ� ����ȭ �Ǿ� �ֽ��ϴ�.")
            });

            return true;

        }else{
            return false;

        }
    },
};
