#include <math.h>

// ----------------------------------------------------------------------------------------------------------------------------

class Vector2f{
public:
    union{
        struct{float x, y;};
        struct{float s, t;};
        struct{float r, g;};
    };
    Vector2f() : x(0.0f), y(0.0f){}
    ~Vector2f(){}
    Vector2f(float num) : x(num), y(num){}
    Vector2f(float x, float y) : x(x), y(y){}
    //Vector2f(int x, int y) : x(x), y(y){}
    //Vector2f(double x, double y) : x(x), y(y){}
    Vector2f(const Vector2f &u) : x(u.x), y(u.y){}
    Vector2f& operator = (const Vector2f &u){x = u.x; y = u.y; return *this;}
    Vector2f operator - (){return Vector2f(-x, -y);}
    float* operator & (){return (float*)this;};
    Vector2f& operator += (float num){x += num; y += num; return *this;}
    Vector2f& operator += (const Vector2f &u){x += u.x; y += u.y; return *this;}
    Vector2f& operator -= (float num){x -= num; y -= num; return *this;}
    Vector2f& operator -= (const Vector2f &u){x -= u.x; y -= u.y; return *this;}
    Vector2f& operator *= (float num){x *= num; y *= num; return *this;}
    Vector2f& operator *= (const Vector2f &u){x *= u.x; y *= u.y; return *this;}
    Vector2f& operator /= (float num){x /= num; y /= num; return *this;}
    Vector2f& operator /= (const Vector2f &u){x /= u.x; y /= u.y; return *this;}
    friend Vector2f operator + (const Vector2f &u, float num){return Vector2f(u.x + num, u.y + num);}
    friend Vector2f operator + (float num, const Vector2f &u){return Vector2f(num + u.x, num + u.y);}
    friend Vector2f operator + (const Vector2f &u, const Vector2f &v){return Vector2f(u.x + v.x, u.y + v.y);}
    friend Vector2f operator - (const Vector2f &u, float num){return Vector2f(u.x - num, u.y - num);}
    friend Vector2f operator - (float num, const Vector2f &u){return Vector2f(num - u.x, num - u.y);}
    friend Vector2f operator - (const Vector2f &u, const Vector2f &v){return Vector2f(u.x - v.x, u.y - v.y);}
    friend Vector2f operator * (const Vector2f &u, float num){return Vector2f(u.x * num, u.y * num);}
    friend Vector2f operator * (float num, const Vector2f &u){return Vector2f(num * u.x, num * u.y);}
    friend Vector2f operator * (const Vector2f &u, const Vector2f &v){return Vector2f(u.x * v.x, u.y * v.y);}
    friend Vector2f operator / (const Vector2f &u, float num){return Vector2f(u.x / num, u.y / num);}
    friend Vector2f operator / (float num, const Vector2f &u){return Vector2f(num / u.x, num / u.y);}
    friend Vector2f operator / (const Vector2f &u, const Vector2f &v){return Vector2f(u.x / v.x, u.y / v.y);}
    void show(bool endLine = true){
        printf("[%f, %f]", x, y);
        if(endLine)
            printf("\n");
    }
    Vector2f& set(float x, float y){this -> x = x; this -> y = y; return *this}
    int getXi(){return (int)x;}
    int getYi(){return (int)y;}
    float dot(const Vector2f &u){return this -> x * u.x + this -> y * u.y;}
    float length(){return sqrt(this -> lengthSqrt());}
    float lengthSqrt(){return this -> x * this -> x + this -> y * this -> y;}
    Vector2f getNormalized(){return *this / (float)sqrt(this -> x * this -> x + this -> y * this -> y);}
    Vector2f normalize(){
        *this /= (float)sqrt(this -> x * this -> x + this -> y * this -> y);
        return *this;
    }

    /**
     * angle in radians
     */
    Vector2f rotate(float angle){
        float c = cos(angle), s = sin(angle);

        this -> x = this -> x * c - this -> y * s;
        this -> y = this -> x * s + this -> y * c;
        return *this;
    }

    /**
     * angle in radians
     */
    Vector2f getRotated(float angle){
        float c = cos(angle), s = sin(angle);
        return Vector2f(this -> x * c - this -> y * s, this -> x * s + this -> y * c);;
    }
};

float dot(const Vector2f &u, const Vector2f &v){
    return u.x * v.x + u.y * v.y;
}

Vector2f mix(const Vector2f &u, const Vector2f &v, float a){
    return u * (1.0f - a) + v * a;
}

Vector2f reflect(const Vector2f &i, const Vector2f &n){
    return i - 2.0f * dot(n, i) * n;
}

Vector2f refract(const Vector2f &i, const Vector2f &n, float eta){
    Vector2f r;

    float ndoti = dot(n, i), k = 1.0f - eta * eta * (1.0f - ndoti * ndoti);

    if(k >= 0.0f){
        r = eta * i - n * (eta * ndoti + sqrt(k));
    }

    return r;
}   