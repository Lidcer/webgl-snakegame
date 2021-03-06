precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;
attribute float delta;

varying vec3 fragColor;


float clamp_(float value, float min_, float max_) {
    if(value < min_) {
        return min_;
    } else if (value > max_) {
        return max_;
    }
    return value;
}

void main() {
    vec3 vertColor2 = vertColor;
    float intensive = 0.25;
    //vertColor2.r = vertColor2.r + (abs(vertPosition.x) + abs(vertPosition.y)); 
    //vertColor2.r = delta; // vertColor2.r * delta;
    //vertColor2.g = delta; // vertColor2.r * delta;
    //vertColor2.b = delta; // vertColor2.r * delta;
    fragColor = vertColor2;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}