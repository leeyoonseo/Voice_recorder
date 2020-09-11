class Progress {

    name = "ProgressBar";
    version ="1.0.0";

    constructor(options){
        const defaultOptions = {
            element : '.progress-bar',
        };
        
        this.options = {...defaultOptions, ...options};
        
        let { element } = this.options;
        
        if(typeof element === 'string'){
            element = document.querySelector(element);
        } 


        this.pointer = element.getElementsByClassName('progress-pointer')[0];
        this.progress = element.getElementsByClassName('progress')[0];
        this.element = element;
    }

    reset(){
        this.draw(0);
        return this;
    }

    draw(percent){
        this.progress.style.width = percent + '%';
        return this;
    }
}

class Circle extends Progress {
    constructor(options){
        super(options);

        this.halfCircleLeft;
        this.halfCircleRight;

        this.setUp();

        return this;
    }

    setUp(){
        this.halfCircleLeft = this.getHalfCircle();
        this.halfCircleRight = this.getHalfCircle();

        this.progress.append(this.halfCircleLeft);
        this.progress.append(this.halfCircleRight);

        return this;
    }

    getHalfCircle(){
        const half = document.createElement('div');
        half.classList.add('half-circle');
        half.style.transform = 'rotate(0)';

        return half;
    }

    draw(deg){
        this.clipBoundary(deg);
        this.rotate(deg);

        return this;
    }

    clipBoundary(deg){
        const clipStyle = (deg > 180) ? 'rect(auto auto auto auto)' : 'rect(0 1em 1em 0.5em)';
        this.progress.style.clip = clipStyle;

        return this;
    }
   
    rotate(deg){
        const leftDeg = (deg > 180) ? deg : 0;
        const rightDeg = (deg > 180) ? 180 : deg;
        const { halfCircleLeft, halfCircleRight, pointer } = this;
        
        halfCircleLeft.style.transform = 'rotate('+ leftDeg +'deg)';
        halfCircleRight.style.transform = 'rotate('+ rightDeg +'deg)';
        pointer.style.transform = 'rotate('+ deg +'deg)';

        return this;
    }
};