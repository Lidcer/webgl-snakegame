import { Renderer } from '../Renderer';
import { Drawable, RGB } from './Drawable';

export interface SquareOptions {
    data?: number[];
    colour?: RGB;
    x?: number;
    y?: number;
}

export class Square extends Drawable {
    private _data: number[] = [];
    constructor(renderer: Renderer, size = 10, options: SquareOptions = {} ) {
        super(renderer);
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.data = options.data || [];
        this.size = size;
        if (options.colour) {
            this.drawColour = options.colour;
        }
    }

    get vertices() {
        const vec1 = [this.posX, this.posY];
        const vec2 = [this.posX + this.horizontalSize, this.posY];
        const vec3 = [this.posX, this.posY - this.verticalSize];
        const vec4 = [this.posX + this.horizontalSize, this.posY - this.verticalSize];

        if (this.data) {
            return [
                ...vec1,  ...this.colour, ...this.data,
                ...vec2,  ...this.colour, ...this.data,
                ...vec3,  ...this.colour, ...this.data,
                ...vec2,  ...this.colour, ...this.data,
                ...vec3,  ...this.colour, ...this.data,
                ...vec4,  ...this.colour, ...this.data
            ];
        }

        return [
            ...vec1,  ...this.colour,
            ...vec2,  ...this.colour,
            ...vec3,  ...this.colour,
            ...vec2,  ...this.colour,
            ...vec3,  ...this.colour,
            ...vec4,  ...this.colour,
        ];
    }

    set data(data: number[]) {
        this._data = data;
    }
    get data() {
        return this._data;
    }

    get shapes() {
        return 1;
    }
}
