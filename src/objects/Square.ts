import { Renderer } from '../Renderer';
import { Drawable } from './Drawable';

export class Square extends Drawable {
    time = 0;
    constructor(renderer: Renderer, size = 10, private _data?: number[]) {
        super(renderer);
        this.x = 0;
        this.y = 0;
        this.size = size;
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

    set data(data: number[] | undefined) {
        this._data = data;
    }
    get data() {
        return this._data;
    }

    get shapes() {
        return 1;
    }
}
