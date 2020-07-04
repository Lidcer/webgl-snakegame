import { Renderer } from './Renderer';
import { Snake } from './object/Snake';
import { Socket } from 'dgram';

export class GameDom {

    private readonly backgroundColor = [32, 32, 32];
    private readonly grayColor = [0, 0, 0];

    private readonly mainGameClass = 'the-snake-game';
    private readonly scoreClass = 'the-snake-score';
    private readonly borderClass = 'the-snake-border';
    private readonly canvasClass = 'the-snake-canvas-';

    private div = document.createElement('div');
    private scoreDiv = document.createElement('div');
    private fpsDiv = document.createElement('div');
    private border = document.createElement('div');
    private style = document.createElement('style');

    constructor(private renderer: Renderer, private _height, private _width) {
        this.createCss();
        this.div.classList.add(this.mainGameClass);
        this.border.classList.add(this.borderClass);
        this.scoreDiv.classList.add(this.scoreClass);
        this.fpsDiv.classList.add(this.scoreClass);
        this.renderer.canvas.classList.add(this.canvasClass);

        this.score = 0;
        this.border.style.border = `2px solid white`;
        this.border.style.width = `${this.renderer.width}px`;
        this.border.style.height = `${this.renderer.height}px`;

        this.div.append(this.scoreDiv);
        this.div.append(this.fpsDiv);
        window.addEventListener('resize', this.resize);

        this.div.append(this.border);
        this.border.append(this.renderer.canvas);
        document.body.append(this.div);
        this.resize();
    }

    private createCss() {
        const transitionTime = 0.15;
        const s = Snake.snakeColour;

        const styleText = [
          `.${this.mainGameClass} {`,
          `   position: fixed;`,
          `   z-index: 999999999999;`,
          `   padding: 5px;`,
          `   transition: top ${transitionTime}s ease 0s, left ${transitionTime}s ease 0s;`,
          `   background-color: rgb(${this.backgroundColor[0]}, ${this.backgroundColor[1]}, ${this.backgroundColor[2]});`,
          `}`,

          `.${this.scoreClass} {`,
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
          `   transition: margin-top ${transitionTime}s ease 0s, margin-left ${transitionTime}s ease 0s`,
          `}`,
        ].join('\n');
        this.style.textContent = styleText;
        document.head.append(this.style);
      }

    set score(score: number) {
        this.scoreDiv.textContent = `Score: ${score}`;
    }

    set fps(fps: number) {
        this.fpsDiv.textContent = `Fps: ${fps}`;
    }

    bounce(direction: 'top' | 'left', minus = false) {
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
    private resize = () => {
        this.div.style.top = `${window.innerHeight * 0.5 - this.height * 0.5}px`;
        this.div.style.left = `${window.innerWidth * 0.5 - this.width * 0.5}px`;
    }
}
