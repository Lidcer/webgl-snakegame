import { Renderer } from './Renderer';
import { Snake } from './objects/Snake';
import { Socket } from 'dgram';
import { GameOptions } from './GameOptions';

export class GameDom {

    private readonly backgroundColor = [32, 32, 32];
    private readonly grayColor = [0, 0, 0];
    private readonly mainGamePadding = 5;
    private readonly borderThickness = 2;

    private readonly mainGameClass = 'the-snake-game';
    private readonly textClass = 'the-snake-text';
    private readonly borderClass = 'the-snake-border';
    private readonly canvasClass = 'the-snake-canvas';
    private readonly feedbackAnimation = GameOptions.feedbackAnimation;

    private div = document.createElement('div');
    private scoreDiv = document.createElement('div');
    private fpsDiv = document.createElement('div');
    private speedDiv = document.createElement('div');
    private border = document.createElement('div');
    private style = document.createElement('style');


    constructor(private renderer: Renderer, private _height, private _width) {
        this.createCss();
        this.div.classList.add(this.mainGameClass);
        this.border.classList.add(this.borderClass);
        this.scoreDiv.classList.add(this.textClass);
        this.fpsDiv.classList.add(this.textClass);
        this.speedDiv.classList.add(this.textClass);
        this.renderer.canvas.classList.add(this.canvasClass);

        this.score = 0;
        this.border.style.border = `${this.borderThickness}px solid white`;
        this.border.style.width = `${this.renderer.width}px`;
        this.border.style.height = `${this.renderer.height}px`;

        this.div.append(this.scoreDiv);
        this.div.append(this.speedDiv);
        if (GameOptions.showFps) {
            this.div.append(this.fpsDiv);
        }
        window.addEventListener('resize', this.resize);

        this.div.append(this.border);
        this.border.append(this.renderer.canvas);
        document.body.append(this.div);


        const time = 1.5;
        if (this.feedbackAnimation) {
            this.div.style.transition = `top ${time}s ease 0s, left ${time}s ease 0s`,
            this.div.style.top = `-${this.height * 2}px`;
        }

        this.resize(this.feedbackAnimation ? 15 : undefined);
        if (this.feedbackAnimation) {
            setTimeout(() => {
                this.div.style.transition = '';
                this.resize();
            }, time * 1000);
        }

    }

    private createCss() {
        const transitionTime = 0.15;
        const s = Snake.snakeColour;

        const styleText = [
          `.${this.mainGameClass} {`,
          `   position: fixed;`,
          `   z-index: 999999999999;`,
          `   padding: ${this.mainGamePadding}px;`,
          `   transition: top ${transitionTime}s ease 0s, left ${transitionTime}s ease 0s;`,
          `   background-color: rgb(${this.backgroundColor[0]}, ${this.backgroundColor[1]}, ${this.backgroundColor[2]});`,
          `}`,

          `.${this.textClass} {`,
          `   display: inline-block;`,
          `   margin: 5px;`,
          `   color: rgb(${s[0]}, ${s[1]}, ${s[2]});`,
          `   font-family: Impact, Charcoal, sans-serif;`,
          `   margin: 0px 0px 5px 10px;`,
          `}`,

          `.${this.borderClass} {`,
          `   background-color: rgb(${this.grayColor[0]}, ${this.grayColor[1]}, ${this.grayColor[2]});`,
          `   font-family: Impact, Charcoal, sans-serif;`,
          `}`,

          `.${this.canvasClass} {`,
          `   position: absolute;`,
          `   transition: margin-top ${transitionTime}s ease 0s, margin-left ${transitionTime}s ease 0s;`,
          `}`,
        ].join('\n');
        this.style.textContent = styleText;
        document.head.append(this.style);
      }

    set score(score: number) {
        this.scoreDiv.textContent = `Score: ${score}`;
    }

    set fps(fps: number) {
        if (!GameOptions.showFps) return;
        this.fpsDiv.textContent = `Fps: ${fps}`;
    }
    set speed(speed: number) {
        this.speedDiv.textContent = `Speed: ${speed}`;
    }

    bounce(direction: 'top' | 'left', minus = false) {
        if (!this.feedbackAnimation) return;
        const boundingClientRect = this.div.getBoundingClientRect();
        const distance = 5;
        const time = 50;
        const m = minus ? -1 : 1;
        const xy = direction === 'top' ? 'top' : 'left';

        //this.div.style[direction] = `${boundingClientRect[xy] + (distance  * m)}px`;
        if (direction === 'top') {
            this.div.style.top = `${boundingClientRect[xy] + (distance  * m)}px`;
            this.renderer.canvas.style.marginTop = `${distance * 2 * -m}px`;
        } else {
            this.div.style.left = `${boundingClientRect[xy] + (distance  * m)}px`;
            this.renderer.canvas.style.marginLeft = `${distance * 2 * -m}px`;
        }
        setTimeout(() => {
            this.div.style[direction] = `${boundingClientRect[xy]}px`;
            if (direction === 'top') {
                this.renderer.canvas.style.marginTop = '';
            } else {
                this.renderer.canvas.style.marginLeft = '';
            }
        }, time);
    }

    destroy() {
        try {
            this.div.parentNode.removeChild(this.div);
        } catch (_) { /* ignored error */  }

        window.removeEventListener('resize', this.resize);
    }

    set height(height: number) {
        this._height = height;
    }
    get height() {
        return this._height;
    }
    set width(width: number) {
        this._width = width;
    }
    get width() {
        return this._width;
    }
    private resize = (e?: UIEvent | number) => {
        const yOffset = typeof e === 'number' ? e : 0;
        const margin = 10;
        const score = this.scoreDiv.getBoundingClientRect();
        const padding = (this.mainGamePadding * 2) + (this.borderThickness * 2);
        const width = this.renderer.width + padding + (margin * 2);
        const height = this.renderer.height + padding + (margin * 2) + score.height;
        const ratio = height / width;

        if (window.innerWidth < width) {
            this.div.style.top = `${window.innerHeight * 0.5 - height * 0.5 + margin + yOffset}px`;
            this.div.style.left = `${margin}px`;
            const divWidth = window.innerWidth - margin - padding - this.mainGamePadding;
            this.div.style.width = `${divWidth}px`;
            const canvasWidth = window.innerWidth - padding - margin - this.mainGamePadding * 2;
            this.border.style.width = `${canvasWidth}px`;
            this.renderer.canvas.style.width = `${canvasWidth}px`;

            this.div.style.height = `${(divWidth * ratio + score.height * 1.5) + yOffset}px`;
            this.border.style.height = `${canvasWidth * ratio}px`;
            this.renderer.canvas.style.height = `${canvasWidth * ratio }px`;
        } else if (window.innerHeight < height) {
            this.div.style.left = `${window.innerWidth * 0.5 - width * 0.5 + margin}px`;
            this.div.style.top = `${margin + yOffset}px`;
            const divHeight = window.innerHeight - margin - padding - this.mainGamePadding;
            this.div.style.height = `${divHeight}px`;
            const canvasHeight = window.innerHeight - padding - margin - this.mainGamePadding * 2 - (score.height * 1.5);
            this.border.style.height = `${canvasHeight}px`;
            this.renderer.canvas.style.height = `${canvasHeight}px`;

            this.div.style.width = `${(divHeight - (score.height * 1.5)) * ratio}px`;
            this.border.style.width = `${canvasHeight * ratio}px`;
            this.renderer.canvas.style.width = `${canvasHeight * ratio }px`;
        } else {
            this.div.style.height = '';
            this.div.style.width = '';
            this.renderer.canvas.style.height = '';
            this.renderer.canvas.style.width = '';
            this.border.style.width = `${this.renderer.width}px`;
            this.border.style.height = `${this.renderer.height}px`;

            this.div.style.top = `${window.innerHeight * 0.5 - height * 0.5 + margin + yOffset}px`;
            this.div.style.left = `${window.innerWidth * 0.5 - width * 0.5 + margin}px`;
        }

    }
}
