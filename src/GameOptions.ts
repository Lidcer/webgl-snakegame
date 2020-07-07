const params = new  URLSearchParams(window.location.search);

export class GameOptions  {

    static get colliders() {
        return params.get('no-colliders') !== null ? false : true;
    }
    static get verbose() {
        return params.get('verbose') !== null ? true : false;
    }
    static get feedbackAnimation() {
        return params.get('no-feedback-animation') !== null ? false : true;
    }
    static get snakeAnimation() {
        return params.get('no-snake-animation') !== null ? false : true;
    }

    static get showFps() {
        return params.get('show-fps') !== null ? true : false;
    }

    static get height() {
        const height = params.get('height');
        const heightInt = parseInt(height);
        if (isNaN(heightInt) || heightInt < 0) {
            return undefined;
        }
        return heightInt;
    }

    static get width() {
        const width = params.get('width');
        const widthInt = parseInt(width);
        if (isNaN(widthInt) || widthInt < 0) {
            return undefined;
        }
        return widthInt;
    }

    static get pixelWidth() {
        const pixelWidth = params.get('pixel-width');
        const pixelWidthInt = parseInt(pixelWidth);
        if (isNaN(pixelWidthInt) || pixelWidthInt < 0) {
            return undefined;
        }
        return pixelWidthInt;
    }

    static get pixelHeight() {
        const pixelHeight = params.get('pixel-height');
        const pixelHeightInt = parseInt(pixelHeight);
        if (isNaN(pixelHeightInt) || pixelHeightInt < 0) {
            return undefined;
        }
        return pixelHeightInt;
    }

    static get speed() {
        const speed = params.get('speed');
        const speedInt = parseInt(speed);
        if (isNaN(speedInt) || speedInt < 0) {
            return undefined;
        }
        return speedInt;
    }

    static get experimentalShader() {
        return params.get('experimental-shader') !== null ? false : true;
    }
}

