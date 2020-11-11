import { Drawable, RGB } from '../objects/Drawable';
import { Renderer } from '../Renderer';
import { Letter, LetterOptions } from './Letter';

export interface TextOptions {
    data?: number[];
    color?: RGB;
    x?: number;
    y?: number;
    fontSize?: number;
    padding?: number;
}

export class TextRenderer extends Drawable {
    private letters: Letter[] = [];
    private shapesCount = 0;
    private fontSize = 1;
    constructor(renderer: Renderer, text: string, options: TextOptions = {}) {
        super(renderer);
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.fontSize = options.fontSize || 5;
        const padding = options.padding || 0.5;
        if (options.color) {
            this.drawColour = options.color;
        }
        let offset = 0;
        for (const letter of text) {
            const letterObject = this.parseText(letter, offset);
            offset += letterObject.width + padding;
            this.letters.push(letterObject);
        }
        let lettersCount = 0;
        for (const l of this.letters) {
            lettersCount += l.shapes;
        }
        this.shapesCount = lettersCount;
    }

    get shapes(): number {
        return this.shapesCount;
    }
    get vertices(): number[] {
        const v: number[] = [];
        for (const letter of this.letters) {
            for (const lv of letter.vertices) {
                v.push(lv);
            }
        }
        return v;
    }
    parseText(letter: string, offset: number) {
        letter = letter.toUpperCase();
        switch (letter) {
            case '0':
                return this.zero(offset);
            case '1':
                return this.one(offset);
            case '2':
                return this.two(offset);
            case '3':
                return this.three(offset);
            case '4':
                return this.four(offset);
            case '5':
                return this.five(offset);
            case '6':
                return this.six(offset);
            case '7':
                return this.seven(offset);
            case '8':
                return this.eight(offset);
            case '9':
                return this.nine(offset);
            case ' ':
                return this.whiteSpace(offset);
            default:
                break;
        }
        if (typeof this[letter] === 'function') {
            return this[letter](offset);
        }
        return this.questionMark(offset);
    }
    letterOptions(offset = 0): LetterOptions {
        return {
            colour: this.drawColour,
            renderer: this.renderer,
            size: this.fontSize,
            x: this.x + offset,
            y: this.y
        };
    }
    A(offset = 0) {
        const options = this.letterOptions(offset);

        return new Letter(options, [
            [0, 1, 0],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1],
        ]);
    }
    B(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 0],
        ]);
    }
    C(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [0, 1, 0],
            [1, 0, 1],
            [1, 0, 0],
            [1, 0, 1],
            [0, 1, 0],
        ]);
    }
    D(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0],
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 0],
        ]);
    }
    E(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 0],
            [1, 0, 0],
            [1, 1, 1],
        ]);
    }
    F(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 0],
            [1, 0, 0],
            [1, 0, 0],
        ]);
    }
    G(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
        ]);
    }
    H(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1],
        ]);
    }
    I(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1],
            [1],
            [1],
            [1],
            [1],
        ]);
    }
    J(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 1],
            [1, 0, 1],
            [0, 1, 0],
        ]);
    }
    K(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
        ]);
    }
    L(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1],
        ]);
    }
    M(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
        ]);
    }
    N(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 0, 1],
            [1, 1, 0, 1],
            [1, 1, 0, 1],
            [1, 0, 1, 1],
            [1, 0, 1, 1],
        ]);
    }
    O(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [0, 1, 0],
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
            [0, 1, 0],
        ]);
    }
    P(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0],
            [1, 0, 1],
            [1, 1, 0],
            [1, 0, 0],
            [1, 0, 0],
        ]);
    }
    Q(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [0, 1, 1],
            [1, 0, 1],
            [0, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
        ]);
    }
    R(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0],
            [1, 0, 1],
            [1, 1, 0],
            [1, 0, 1],
            [1, 0, 1],
        ]);
    }
    S(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [0, 1, 1],
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 0],
        ]);
    }
    T(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ]);
    }
    U(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
            [0, 1, 0],
        ]);
    }
    V(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
            [0, 1, 0],
            [0, 1, 0],
        ]);
    }
    W(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0],
        ]);
    }
    X(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1],
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1],
            [1, 0, 1],
        ]);
    }
    Y(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1],
            [1, 0, 1],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ]);
    }
    Z(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0],
            [1, 1, 1],
        ]);
    }
    zero(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [1, 0, 1],
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
        ]);
    }
    one(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1],
            [0, 1],
            [0, 1],
            [0, 1],
            [0, 1],
        ]);
    }
    two(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0],
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0],
            [1, 1, 1],
        ]);
    }
    three(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 0],
        ]);
    }
    four(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
        ]);
    }
    five(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [1, 0, 0],
            [1, 1, 0],
            [0, 0, 1],
            [1, 1, 0],
        ]);
    }
    six(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 0, 0],
            [1, 0, 0],
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
        ]);
    }
    seven(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 1],
        ]);
    }
    eight(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
        ]);
    }
    nine(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1],
            [0, 0, 1],
            [0, 0, 1],
        ]);
    }
    whiteSpace(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]);
    }
    questionMark(offset = 0) {
        const options = this.letterOptions(offset);
        return new Letter(options, [
            [1, 1, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 0, 0],
            [0, 1, 0],
        ]);
    }
}
