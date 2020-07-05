import { Square } from './Square';
import { Renderer } from '../Renderer';
import { clamp } from '../Utils';
import { WindowInfo } from './Interfaces';

export class Snake extends Square {
    public static readonly snakeColour = [32, 247, 90];

    private speed = 0;
    private canGoThroughEdge = true;
    private square: Square;
     _onGridX: number | undefined;
     _onGridY: number | undefined;
    private snakeSize = 0.5;
    private precision = 1; // lower it is better it is at least it

    constructor(renderer: Renderer, private windowInfo: WindowInfo, gameSpeed: number, x: number, y: number) {
        super(renderer);
        this.red = Snake.snakeColour[0];
        this.green = Snake.snakeColour[1];
        this.blue = Snake.snakeColour[2];
        this.setSnakeSize(windowInfo);

        this.setSnakeTime(gameSpeed);
        this.onGridX = x;
        this.onGridY = y;
        this.y = this.sPosY;
        this.x = this.sPosX;
    }
    moveX(num: number) {
        if (num > 0) {
            this._onGridX = clamp(--this._onGridX, -1, this.windowInfo.pixelWidth);
        } else if (num < 0) {
            this._onGridX = clamp(++this._onGridX, -1, this.windowInfo.pixelWidth);
        }
    }
    moveY(num: number) {
        if (num > 0) {
            this._onGridY = clamp(--this._onGridY, -1, this.windowInfo.pixelHeight);
        } else if (num < 0) {
            this._onGridY = clamp(++this._onGridY, -1, this.windowInfo.pixelHeight);
        }
    }
    move(delta: number) {
        if (this.sPosX > this.x) {
            this.x += delta * this.speed;
            if (this.sPosX < this.x) this.x = this.sPosX;
        } else if (this.sPosX < this.x) {
            this.x -= delta * this.speed;
            if (this.sPosX > this.x) this.x = this.sPosX;
        }

        if (this.sPosY > this.y) {
            this.y += delta * this.speed;
            if (this.sPosY < this.y) this.y = this.sPosY;
        } else if (this.sPosY < this.y) {
            this.y -= delta * this.speed;
            if (this.sPosY > this.y) this.y = this.sPosY;
        }
        this.borderSquare();
        this.snapOnGrid();
    }
    correctPos() {
        this.y = this.sPosY;
        this.x = this.sPosX;
        this.borderSquare();
        this.snapOnGrid();
    }

    setSnakeTime(gameTime: number) {
        //    this.speed = gameTime / 500 * 0.4;
        if (gameTime < 2) {
            this.speed = 0;
        } else if (gameTime >= 5 && gameTime < 10) {
            this.speed = 0.4;
        } else if (gameTime >= 10 && gameTime < 20) {
            this.speed = 0.3;
        } else if (gameTime >= 30 && gameTime < 30) {
            this.speed = 0.28;
        } else if (gameTime >= 40 && gameTime < 50) {
            this.speed = 0.29;
        } else if (gameTime >= 50 && gameTime < 60) {
            this.speed = 0.3;
        } else if (gameTime >= 60 && gameTime < 100) {
            this.speed = 0.31;
        } else if (gameTime >= 100 && gameTime < 200) {
            this.speed = 0.31;
        } else if (gameTime >= 200 && gameTime < 300) {
            this.speed = 0.31;
        } else if (gameTime >= 300 && gameTime < 400) {
            this.speed = 0.31;
        } else if (gameTime >= 400 && gameTime < 500) {
            this.speed = 0.21;
        } else if (gameTime >= 500 && gameTime < 1000) {
            this.speed = 0.20;
        } else if (gameTime >= 1000 && gameTime < 2000) {
            this.speed = 0.17;
        } else {
            this.speed = 0.2;
        }
        //console.log(`Game speed: ${gameTime}, Snake speed: ${this.speed}`);
    }

    set size(percentage: number) {
        if (!this.windowInfo) return;
        percentage = clamp(percentage, 0, 1);
        this.snakeSize = percentage;
        this.setSnakeSize();
    }

    set onGridX(num: number) {
        this._onGridX = clamp(num, 0, this.windowInfo.pixelWidth - 1);
    }
    get onGridX() {
        return this._onGridX;
    }
    set onGridY(num: number) {
        this._onGridY = clamp(num, 0, this.windowInfo.pixelHeight - 1);
    }
    get onGridY() {
        return this._onGridY;
    }

    get shapesToDraw() {
        return 2;
    }
    get shapes() {
        return this.square ? 2 : 1;
    }
    get pos() {
        const x = clamp(this._onGridX, 1, this.windowInfo.pixelWidth + 1);
        const y = clamp(this._onGridY, 1, this.windowInfo.pixelHeight + 1);
        return {x, y};
    }

    get vertices() {
        if (this.square) {
            return [...super.vertices, ...this.square.vertices];
        }
        return super.vertices;
    }

    private setSnakeSize (windowInfo?: WindowInfo) {
        windowInfo = windowInfo || this.windowInfo;
        this.widthSize = (windowInfo.width / windowInfo.pixelWidth) * this.snakeSize;
        this.heightSize = (windowInfo.height / windowInfo.pixelHeight) * this.snakeSize;
    }

    private borderSquare() {
        if (this.y > 0 && this.y < (this.windowInfo.height - (this.pixelSizeHeight * this.snakeSize)) &&
            this.x > 0 && this.x < (this.windowInfo.width - (this.pixelSizeWidth * this.snakeSize))) {
            if (this.square) {
                this.square = undefined;
            }
            return;
        }
        if (this.y + (this.pixelSizeHeight * this.snakeSize) - this.precision < 0) {
            this._onGridY = this.windowInfo.pixelHeight - 1;
            this.y = this.sPosY;

        } else if (this.y + this.precision > this.windowInfo.height) {
            this._onGridY = 0;
            this.y = this.sPosY;
        }

        if (this.x + (this.pixelSizeWidth * this.snakeSize) - this.precision < 0) {
            this._onGridX = this.windowInfo.pixelWidth - 1;
            this.x = this.sPosX;
        } else if (this.x + this.precision  > this.windowInfo.width) {
            this._onGridX = 0;
            this.x = this.sPosX;
        }

        if (!this.square) {
            this.square = new Square(this.renderer);
            this.square.red = Snake.snakeColour[0];
            this.square.green = Snake.snakeColour[1];
            this.square.blue = Snake.snakeColour[2];
        }

        if (this.y < 0) {
            this.square.y = this.y + this.windowInfo.height;

        } else if (this.y > (this.windowInfo.height - this.pixelSizeHeight)) {
            this.square.y = this.y - this.windowInfo.height;
        } else {
            this.square.y = this.y;
        }

        if (this.x < 0) {
            this.square.x = this.x + this.windowInfo.width;

        } else if (this.x > (this.windowInfo.width - this.pixelSizeWidth)) {
            this.square.x = this.x - this.windowInfo.width;
        } else {
            this.square.x = this.x;
        }

        // const widthPrecision = this.pixelSizeWidth * 0.9;
        // console.log(this.posX, this.windowInfo.pixelWidth + widthPrecision)
        // if (this.onGridX > this.windowInfo.pixelWidth + widthPrecision) {
        //     this._onGridX = 0;
        //     console.log(1)
        // }
        //     // } else if (this.onGridX < 0) {
        // //     this.onGridX = this.windowInfo.pixelWidth - 1;
        // // }

        this.square.widthSize = (this.windowInfo.width / this.windowInfo.pixelWidth) * this.snakeSize;
        this.square.heightSize = (this.windowInfo.height / this.windowInfo.pixelHeight) * this.snakeSize;
    }

    private get sPosX() {
        return this.sPosXRaw + (this.xOffset * 0.5);
    }
    private get sPosY() {
        return this.sPosYRaw + (this.yOffset * 0.5);
    }
    private get sPosXRaw() {
        return this.pixelSizeWidth * this.onGridX;
    }
    private get sPosYRaw() {
        return this.pixelSizeHeight * this.onGridY;
    }

    private snapOnGrid() {
        if (this.sPosY < this.y + this.precision && this.sPosY > this.y - this.precision) {
            this.y = this.sPosY;
        }
        if (this.sPosX < this.x + this.precision && this.sPosX > this.x - this.precision) {
            this.x = this.sPosX;
        }
    }
    private get pixelSizeWidth() {
        return this.windowInfo.width / this.windowInfo.pixelWidth;
    }
    private get pixelSizeHeight() {
        return this.windowInfo.height / this.windowInfo.pixelHeight;
    }

    private get yOffset () {
        return this.pixelSizeHeight - (this.pixelSizeHeight * this.snakeSize);
    }

    private get xOffset () {
        return this.pixelSizeWidth - (this.pixelSizeWidth * this.snakeSize);
    }

}
