/**
 * ����� �Ŵ���
 * @author Lee Yoon Seo (2019.09)
 * @update Lee Yoon Seo (2020.08)
 * @version 1.1.0
 * @see CheckBrowser-2.0.0.js
 * @support Chrome | fireFox | Edge | Safari | Opera
 */

/**
 * ����� �÷��̾�
 * @options playing {boolean} - ����� �÷��� ����
 */
window.AudioPlayer = function(){
    this.name = "player manager",
    this.version = "1.1.0",

    this.isTouch = CheckBrowser.isTouchScreen,

    this.Event = {
        Start : this.isTouch ? 'touchstart' : 'mousedown',
        Move : this.isTouch ? 'touchmove' : 'mousemove',
        End : this.isTouch ? 'touchend' : 'mouseup',
        Cancel : this.isTouch ? 'touchcancel' : 'mouseup',
        Leave : this.isTouch ? 'touchend' : 'mouseleave'
    }
};

window.AudioPlayer.prototype = {
    constructor : AudioPlayer,

    /**
     * ȣ�� �� ����
     * @param {Object} opts  ������ �¾� �� �����ϴ� �ɼ� ��
     * @param {String} opts.wrap  �÷��̾ ���Ե� ��Ʈ��ü�� Ŭ������ id
     * @param {String} opts.statusBar �÷��̾� ������� Ŭ������ id
     * @param {String} opts.audioFileSrc �÷��̾� ����� ���
     * @param {String} opts.timeFormat Ÿ�̸� ����
     */
    init : function(opts){

        this.options = $.extend(true, {
            wrap : '.player',
            statusBar : '.ui_status_bar',
            audioFileSrc : '',
            timeFormat : 'mm:ss',
        }, opts);

        this.audio = new Audio();
        this.wrap = $(this.options.wrap);

        this.statusBar = this.wrap.find(this.options.statusBar);
        this.bar = this.statusBar.find('.status_bar');
        this.pointer = this.statusBar.find('.status_pointer');

        this.ready();

        return this;
    },

    ready : function(){
        $(this.audio).off();

        this.dettachEvent();

        this.setAudioLifeCycle();
        this.attachEvent();

        return this;
    },

    stop : function(){
        this.audio.currentTime = 0;
        this.audio.pause();

        return this;
    },

    // ����� �ε�, callback �Լ� ����
    setLoadeddata : function(callback){
        this.loadeddataCallback = callback;

        return this;
    },

    // ����� Ÿ�̸� ��, callback �Լ� ����
    setTimeupdate : function(callback){
        this.timeupdateCallback = callback;

        return this;
    },

    // ����� ���� ��, callback �Լ� ����
    setEnded : function(callback){
        this.endedCallback = callback;

        return this;
    },

    // �ε� �� �̺�Ʈ ��, callback �Լ� ����
    setBarEvent : function(callback){
        this.barEventCallback = callback;

        return this;
    },

    setAudioLifeCycle : function(){
        var that = this;

        try {
            $(this.audio).attr('src', this.options.audioFileSrc)
            .on('error', function(e){
                // ����
                console.log(e.message);
            })

            // ����� �ε� ��
            .on('loadeddata', function(){
                var duration = this.duration;
                if (this.duration == 'Infinity') {
                    duration = recordedTime;
                    that.bar.css('cursor', 'default');
                }

                that.loadeddataCallback(duration);
                that.totalTime = duration;
            })

            // ����� Ÿ�̸� ��
            .on('timeupdate', function(){
                var duration = this.duration;
                if (this.duration == 'Infinity') {
                    duration = recordedTime;
                    that.bar.css('cursor', 'default');

                } else {
                    that.bar.css('cursor', '');
                }

                that.timeupdateCallback(this.currentTime, duration);
            })

            // ����� ���� ��
            .on('ended', function(){
                that.endedCallback(this.duration);

            }).load();

        } catch (e) {
            console.log(e.name + ": " + e.message);
        }

        return this;
    },

    attachEvent : function(){
        var that = this;

        // player�� ������ �ִ� audio �Ķ���ͷ� �����ؾ� �۵�
        this.bar.on(that.Event.Start, function(e){
            that.barEventCallback(e, that.audio);

            // ���콺�� �ణ ����� �巡�� �̺�Ʈ�� ����ǵ��� �ε� �� �θ� move �̺�Ʈ ���ε�
            that.statusBar.on(that.Event.Move, function(e){
                that.barEventCallback(e, that.audio);
            });
        });

        this.pointer.on(that.Event.Start, function(e){
            that.barEventCallback(e, that.audio);

            // ���콺�� �ణ ����� �巡�� �̺�Ʈ�� ����ǵ��� �ε� �� �θ� move �̺�Ʈ ���ε�
            that.statusBar.on(that.Event.Move, function(e){
                that.barEventCallback(e, that.audio);
            });
        });

        this.statusBar.on(that.Event.Cancel, function(){
            that.statusBar.off(that.Event.Move);

        }).on(that.Event.Leave, function(){
            that.statusBar.off(that.Event.Move);
        });

        return this;
    },

    dettachEvent : function(){
        this.bar.off();
        this.pointer.off();
        this.statusBar.off();

        return this;
    },

    /**
     * ��ư disabled �� callback �Լ� ����
     * @see record.html - callback : .html ���Ͽ��� �±׷� ������� �����ϱ� ���� ����
     * @param {Boolean} isEnabled ���� ����
     * @param {Object} callback ������Ʈ �Ķ���ͷ� �����Ͽ� ��ȣ�ۿ� ����
    */
    eventDisabled : function(isEnabled, callback){
        if(isEnabled){
            this.dettachEvent();

        }else{
            this.attachEvent();

        }

        this.statusBar.toggleClass('disabled', isEnabled);
        if(callback) callback(this.statusBar);
        
        return this;
    }
};
