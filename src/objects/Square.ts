import { Renderer } from '../Renderer';
import { Drawable } from './Drawable';

export class Square extends Drawable {
    constructor(renderer: Renderer, size = 10) {
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

        return [
            ...vec1,  ...this.colour,
            ...vec2,  ...this.colour,
            ...vec3,  ...this.colour,
            ...vec2,  ...this.colour,
            ...vec3,  ...this.colour,
            ...vec4,  ...this.colour
        ];
    }

    get shapes() {
        return 1;
    }
}
