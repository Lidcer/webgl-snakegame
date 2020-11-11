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
    float border = 0.25;
     vertColor2.r = vertColor2.r + abs(vertPosition.x + vertPosition.y); 
    vertColor2.g = vertColor2.g - abs(vertPosition.x + vertPosition.y);
    vertColor2.b = vertColor2.b - abs(vertPosition.x + vertPosition.y);
     
    fragColor = vertColor2;
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}