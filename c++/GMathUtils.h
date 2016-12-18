#include <stdlib.h>
#include <math.h>

#define TO_RAD(x) (x * M_PI / 180.0)
#define TO_DEG(x) (x * 180.0 / M_PI)
#define MAX(a, b) (a > b ? a : b)
#define MIN(a, b) (a < b ? a : b)

template <typename T>
T gsin(T num){
	return static_cast<T>(sin(num));
}
template <typename T>
T gcos(T num){
	return static_cast<T>(cos(num));
}

template <typename T>
T between(T value, T min, T max){
	return MAX(min, MIN(value, max));
};

float interpolateLinear(float minValue, float maxValue, float scale) {
    return between((maxValue - minValue) * scale + minValue, minValue, maxValue);
};

template <typename T>
T interpolateSmooth(T a, T b, float scale) {
    float f = (T)(1.0 - cos(scale * M_PI)) * 0.5;
    
    return a * (1.0 - f) + b * f;
};

template <typename T>
T random(T min, T max){
	return min + static_cast <T>(rand()) / ( static_cast <T>(RAND_MAX / (max - min)));
};