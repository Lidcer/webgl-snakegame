
type webGL = WebGL2RenderingContext | WebGLRenderingContext;
interface Shaders {
    [shaderName: string] : Shader;
}
interface Shader {
    textRaw: string;
    type: number;
}
interface AttribArraySpec {
    size: number;
    type: number;
    name: string;
}

export class Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private readonly webGL: webGL;
    private readonly production = false;
    private shaders: Shaders = {};
    private compiledShaders: WebGLShader[] = [];
    private _webGLProgram: WebGLProgram;
    private _usedTechnology = 'webgl2';
    private attribArraySpec: AttribArraySpec[] = [];

    constructor(height?: number, width?: number) {
        const canvas = document.createElement('canvas');
        let webGL: webGL = canvas.getContext(this._usedTechnology) as WebGL2RenderingContext;
        if (!webGL) {
            this._usedTechnology = 'webgl';
            this.webGL = canvas.getContext(this._usedTechnology) as WebGLRenderingContext;
        }
        if (!webGL) {
            this._usedTechnology = 'experimental-webgl';
            webGL = canvas.getContext('experimental-webgl') as WebGLRenderingContext;

        }
        if (!webGL) {
            throw new Error('Unable to create create webgl context');
        }
        if (height !== undefined) {
            canvas.height = height;
        }

        if (width !== undefined) {
            canvas.width = width;
        }

        this._canvas = canvas;
        this.webGL = webGL;
        this.setViewport();
    }

    loadShader(shaderName: string, text: string, type: number, build = true) {
        this.shaders[shaderName] = { textRaw: text, type };
        if (build) {
            this.recompileEverything();
        }
    }

    unloadShader(shaderName: string) {
        if (this.shaders[shaderName]) {
            delete this.shaders[shaderName];
            this.recompileEverything();
        }
    }

    attribArray(name: string, size: number, type: number) {
        this.attribArraySpec.push({name, type, size});
    }
    initAttribArrays() {
        const stride = this.attribArraySpec.map(a => a.size).reduce((a, b) => a + b);
        let offset = 0;
        for (const attribArray of this.attribArraySpec) {
            const { size, name, type } = attribArray;
            const location = this.gl.getAttribLocation(this.program, name);
            this.gl.vertexAttribPointer(
                location,
                size,
                type,
                false,
                stride * Float32Array.BYTES_PER_ELEMENT,
                offset * Float32Array.BYTES_PER_ELEMENT,
            );
            offset += size;
            this.gl.enableVertexAttribArray(location);
        }
        this.attribArraySpec = [];
    }

    destroy() {
        //TODO remove programs
        try {
            this.canvas.parentNode.removeChild(this.canvas);
        } catch (_) { /* ignored */}
    }

    private recompileEverything() {
        const shaders = Object.keys(this.shaders);
        if (this.program) {
            for (const compiledShader of this.compiledShaders) {
                this.gl.detachShader(this.program, compiledShader);
            }
        }

        this.compiledShaders = [];
        for (const str of shaders) {
            const {textRaw, type} = this.shaders[str];
            const shader = this.gl.createShader( type );
            this.gl.shaderSource(shader, textRaw);
            this.gl.compileShader(shader);
            if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                setTimeout(() => {
                    this.gl.deleteShader(shader);
                });
                throw new Error(`Error Compiling a shader ${this.gl.getShaderInfoLog(shader)}`);
            } else {
                this.compiledShaders.push(shader);
            }
        }
        this.recrateProgram();
    }

    private recrateProgram() {
        if (this._webGLProgram) {
            this.gl.deleteProgram(this._webGLProgram);
        }
        this._webGLProgram = this.gl.createProgram();
        for (const shader of this.compiledShaders) {
            this.gl.attachShader(this._webGLProgram, shader);
        }
        this.gl.linkProgram(this._webGLProgram);

        if (!this.gl.getProgramParameter(this._webGLProgram, this.gl.LINK_STATUS)) {
            throw new Error(`Error linking a program ${this.gl.getProgramInfoLog(this._webGLProgram)}`);
        }

        // not recommended in production mode
        if (!this.production) {
            this.gl.validateProgram(this._webGLProgram);
            if (!this.gl.getProgramParameter(this._webGLProgram, this.gl.VALIDATE_STATUS)) {
                this.gl.deleteProgram(this._webGLProgram);
                throw new Error(`Error validating program ${this.gl.getProgramInfoLog(this._webGLProgram)}`);
            }
        }
    }

    private setViewport() {
        this.gl.viewport(0, 0, this.width, this.height);
    }

    get technology () {
        return this._usedTechnology;
    }

    get program () {
        return this._webGLProgram;
    }

    get gl() {
        return this.webGL;
    }

    get canvas() {
        return this._canvas;
    }
    get height() {
        return this.canvas.height;
    }
    set height(number: number) {
        this.canvas.height = number;
        this.setViewport();
    }
    get width() {
        return this.canvas.width;
    }
    set width(number: number) {
        this.canvas.width = number;
        this.setViewport();
    }
}
