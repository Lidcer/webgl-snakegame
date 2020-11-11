import { RGB } from '../objects/Drawable';
import { Square, SquareOptions } from '../objects/Square';
import { Renderer } from '../Renderer';

export interface LetterOptions {
    x: number;
    y: number;
    size: number;
    colour: RGB;
    renderer: Renderer;
}

export class Letter {
    private _x = 0;
    private _y = 0;
    private _size = 0;
    private _width = 0;
    private _colour: RGB;
    private squares: Square[] = [];

    constructor(options: LetterOptions, shape: number[][]) {
        this.size = options.size;
        this.x = options.x;
        this.y = options.y;
        this._colour = options.colour;

        const cords: SquareOptions[] = this.parseCords(shape, options.size);
        for (const xy of cords) {
            xy.colour = options.colour;
            this.squares.push(new Square(options.renderer, options.size, xy));
        }
        this._width = shape.sort((a, b) => a.length < b.length ? 1 : -1)[0].length;
    }

    get shapes(): number {
        return this.squares.length;
    }
    get vertices(): number[] {
        const vert: number[] = [];
        for (const s of this.squares) {
            for (const v of s.vertices) {
                vert.push(v);
            }
        }
        return vert;
    }
    get width() {
        return this._width;
    }
    get x() {
        return this._x;
    }
    set x(x: number) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y: number) {
        this._y = y;
    }
    get size() {
        return this._size;
    }
    set size(size: number) {
        this._size = size;
    }
    get colour() {
        return this._colour;
    }

    private parseCords(cords: number[][], size: number) {
        size = size * 0.9;
        const calculated: {x: number, y: number}[] = [];
        for (let i = 0; i < cords.length; i++) {
            const y = i + this.y;
            for (let j = 0; j < cords[i].length; j++) {
                const x = j + this.x;
                if (cords[i][j]) {
                    calculated.push({x: x + (size * x), y: y + (size * y)});
                }
            }
        }
        return calculated;
    }
}
