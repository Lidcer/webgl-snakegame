import { Renderer } from './Renderer';
import { vertexShader, fragmentShader, vertexShaderTest } from './generated/shaders';
import { Input, Controls } from './Input';
import { Snake } from './objects/Snake';
import { Food } from './objects/Food';
import { WindowInfo } from './objects/Interfaces';
import { random, clamp } from './Utils';
import { GameDom } from './GameDom';
import { GameOptions } from './GameOptions';
import { TextRenderer } from './Font/Text';

enum GameControls {
    Up,
    Down,
    Left,
    Right,
    None,
}

export class SnakeGame {
    static readonly DEFAULT_SPEED = 300;
    private readonly height = GameOptions.height || 500;
    private readonly width = GameOptions.width || 500;
    private readonly pixelWidth = GameOptions.pixelWidth || 12;
    private readonly pixelHeight = GameOptions.pixelHeight || 12;
    private speed = GameOptions.speed || SnakeGame.DEFAULT_SPEED;
    private time = 0;
    private lifeTime = 0;
    private now = performance.now();
    private border = false;
    private renderer: Renderer;
    private input = new Input();
    private food: Food;
    //private aData = [1];
    private score: TextRenderer;

    private direction = GameControls.None;

    private snake: Snake[] = [];
    private paused = false;
    private gameDom: GameDom;

    private showFps = true;

    //Game options
    private colliders = GameOptions.colliders;
    private snakeAnimation = GameOptions.snakeAnimation;

    constructor() {
        // options
        if (GameOptions.verbose) {
            if (!this.colliders) console.info('Colliders disabled');
            if (!GameOptions.feedbackAnimation) console.info('Feedback animation disabled');
            if (!GameOptions.snakeAnimation) console.info('Snake animation disabled');
        }

        // options

        this.renderer = new Renderer(this.height, this.width);

        if (GameOptions.experimentalShader) {
            this.renderer.loadShader('vertex', vertexShaderTest, this.gl.VERTEX_SHADER, false);
        } else {
            this.renderer.loadShader('vertex', vertexShader, this.gl.VERTEX_SHADER, false);
        }
        this.renderer.loadShader('fragment', fragmentShader, this.gl.FRAGMENT_SHADER);
        this.gameDom = new GameDom(this.renderer, this.height, this.width);
        if (this.speed !== SnakeGame.DEFAULT_SPEED) {
            this.gameDom.speed = this.speed;
        }

        this.restartGame();

        this.input.on(this.control);

        const triangleVertexBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexBufferObject);

        this.renderer.attribArray('vertPosition', 2, this.gl.FLOAT);
        this.renderer.attribArray('vertColor', 3, this.gl.FLOAT);
     //   this.renderer.attribArray('delta', 1, this.gl.FLOAT);
        this.renderer.initAttribArrays();

        this.gl.useProgram(this.program);
        if (GameOptions.showTextInGame) {
            this.score = new TextRenderer(this.renderer, 'The snake game', {y: 2, x: 2, color: Snake.snakeColour, fontSize: 5});
        }

        if (GameOptions.verbose) {
            console.log(`Drawing with ${this.renderer.technology}`);
        }
    }

    restartGame() {
        this.snake = [];
        this.addSnake(random(1, this.pixelHeight - 2), random(1, this.pixelWidth - 2));
        //this.addSnake(this.pixelHeight - 5, this.pixelWidth - 1);
        this.spawnRandomFood();
        this.paused = false;

    }

    addSnake(y: number, x: number) {
        this.food = undefined;
        const snake = new Snake(this.renderer, this.windowInfo, {x, y, gameSpeed: this.speed, /*data: this.aData*/});
        this.snake.push(snake);
        this.gameDom.score = this.snake.length;
        if (GameOptions.showTextInGame) {
            this.score = new TextRenderer(this.renderer, `${this.snake.length}`, {y: 2, x: 2, color: Snake.snakeColour, fontSize: 5});
        }
    }

    private control = (control: Controls) => {
        if (control === Controls.Confirm && this.paused) {
            return this.restartGame();
        }
        if (this.paused) return;
        const behind = (yOffset = 0, xOffset = 0): boolean => {
            const head = this.snake[0];
            const neck = this.snake[1];
            if (!head || !neck) return true;
            const hX = clamp(head.onGridX, 0, this.pixelHeight) + xOffset;
            const hY = clamp(head.onGridY, 0, this.pixelHeight) + yOffset;
            const nX = clamp(neck.onGridX, 0, this.pixelHeight);
            const nY = clamp(neck.onGridY, 0, this.pixelHeight);
            let horizontalColliding = false;
            if ((hX === 0 && nX === this.pixelWidth) || (hX === this.pixelWidth && nX === 0) || (hX === 1 && nX === 0) || Math.abs(hX - nX ) > 2 || hX === nX) {
                horizontalColliding = true;
            }
            let verticalColliding = false;
            if ((hY === 0 && nY === this.pixelHeight) || (hY === this.pixelHeight && nY === 0) || (hY === 1 && nY === 0) || Math.abs(hY - nY) > 2 || hY === nY) {
                verticalColliding = true;
            }
            return !(horizontalColliding && verticalColliding);
        };
        const directionNow = this.direction;
        if (control === Controls.Up && this.direction !== GameControls.Up && behind(-1, 0)) {
            this.direction = GameControls.Up;
            this.gameDom.bounce('top', true);
        } else if (control === Controls.Down && this.direction !== GameControls.Down && behind(1, 0)) {
            this.direction = GameControls.Down;
            this.gameDom.bounce('top', false);
        } else if (control === Controls.Left && this.direction !== GameControls.Left && behind(0, -1)) {
            this.direction = GameControls.Left;
            this.gameDom.bounce('left', true);
        } else if (control === Controls.Right && this.direction !== GameControls.Right && behind(0, 1)) {
            this.direction = GameControls.Right;
            this.gameDom.bounce('left', false);
        }
        if (directionNow === GameControls.None && directionNow !== this.direction && GameOptions.showTextInGame) {
            this.score = new TextRenderer(this.renderer, `${this.snake.length}`, {y: 2, x: 2, color: Snake.snakeColour, fontSize: 5});
        }
    }

    updateSnakePos() {
        const head = this.snake[0];
        let onGridX = head.onGridX;
        let onGridY = head.onGridY;

        if (!this.food) return;
        if (head.onGridX === this.food.onGridX && head.onGridY === this.food.onGridY) {
            const tail = this.snake[this.snake.length - 1];
            this.addSnake(tail.pos.y, tail.pos.x);
            this.food = undefined;
            this.spawnRandomFood();
        }

        if (this.direction === GameControls.Up) {
            head.moveY(1);
        } else if (this.direction === GameControls.Down) {
            head.moveY(-1);
        } else if (this.direction === GameControls.Left) {
            head.moveX(+1);
        } else if (this.direction === GameControls.Right) {
            head.moveX(-1);
        }

        //  skipping head
        for (let i = 1; i < this.snake.length; i++) {
            const onGridXBackup = this.snake[i].onGridX;
            const onGridYBackup = this.snake[i].onGridY;
            if (!this.border && (this.pixelWidth - 1) === this.snake[i].onGridX - onGridX) {
                this.snake[i]._onGridX = this.pixelWidth;
            } else if (!this.border && this.pixelWidth - 1 === onGridX - this.snake[i].onGridX) {
                this.snake[i]._onGridX = -1;
            } else {
                this.snake[i].onGridX = onGridX;
            }

            if (!this.border && this.pixelHeight - 1 === this.snake[i].onGridY - onGridY) {
                this.snake[i]._onGridY = this.pixelHeight;
            } else if (!this.border && this.pixelHeight - 1 === onGridY - this.snake[i].onGridY) {
                this.snake[i]._onGridY = -1;
            } else {
                this.snake[i].onGridY = onGridY;
            }

            onGridX = onGridXBackup;
            onGridY = onGridYBackup;
        }
    }

    draw = () => {
        const now = performance.now();
        const delta = now - this.now;
        this.now = now;

        if (delta <= 0) return requestAnimationFrame(this.draw);
        if (this.paused) return requestAnimationFrame(this.draw);

        this.time += delta;
        if (this.showFps) {
            const fps = Math.round(1 / (delta / 1000));
            this.gameDom.fps = fps;
        }

        if (this.time > this.speed) {
            for (const snake of this.snake) {
                snake.correctPos();
            }
           this.updateSnakePos();

            this.time = 0;
        }

        const triangleVertices = [];
        let count = 0;

        if (this.food) {
            //this.food.data = this.aData;
            this.food.vertices.forEach(vertex => {
                triangleVertices.push(vertex);
            });
            count += this.food.shapes;
        }
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snakeAnimation) this.snake[i].move(this.time / this.speed);
            //this.snake[i].data = this.aData;
            if (i === 0) {
                this.snake[i].size = 1;
            } else {
                const invertedI = this.snake.length - i;
                let percentage = invertedI / (this.snake.length * 1.1);
                percentage = percentage * 0.5 + 0.5;
                this.snake[i].size = percentage;
            }

            this.snake[i].vertices.forEach(vertex => {
                triangleVertices.push(vertex);
            });
            count += this.snake[i].shapes;
        }
        if (this.score) {
            this.score.vertices.forEach(e => {
                triangleVertices.push(e);
            });
            count += this.score.shapes;
        }

        if (this.colliders && this.isColliding()) {
            this.paused = true;
            return requestAnimationFrame(this.draw);
        }

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangleVertices), this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * count);
        //this.aData[0] = 1;
        requestAnimationFrame(this.draw);
    }

    isColliding() {
        const head = this.snake[0];

        // skipping head and end of the snake
        for (let i = 1; i < this.snake.length; i++) {
            if (head.onGridX === this.snake[i].onGridX && head.onGridY === this.snake[i].onGridY) {
                return true;
            }
        }
        return false;
    }

    spawnRandomFood() {
        if (!this.food) {
            const result = Food.randomPos(this.pixelHeight, this.pixelWidth, this.snake);
            if (!result) {
                this.food = undefined;
                this.paused = true;
            } else {
                this.food = new Food(this.renderer, this.windowInfo, result.y, result.x);
                //this.food.data = this.aData;
            }
        }
    }


    destroy() {
        this.input.destroy();
        this.renderer.destroy();
        this.gameDom.destroy();
    }
    private get windowInfo(): WindowInfo {
        return {
            height: this.height,
            width: this.width,
            pixelHeight: this.pixelHeight,
            pixelWidth: this.pixelWidth,
        };
    }

    private get gl() {
        return this.renderer.gl;
    }
    private get program() {
        return this.renderer.program;
    }
}
