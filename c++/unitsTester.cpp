#include <stdio.h>
#include <cstdint>
#include <array>

struct testStruct{
	int a;
	int b;
	int64_t c;
};
class testClass{
	int a;
	int b;
	int64_t c;
};
//TODO otestovať
template<typename T, uint32_t width, uint32_t height>
class Array2D{
	std::array<T, width * height> _array;
public:
	inline T& get(uint32_t x, uint32_t y){
		return  _array[x * height + y];
	}
	inline const T& get(uint32_t x, uint32_t y) const{
		return  _array[x * height + y];
	}
	inline void set(uint32_t x, uint32_t y, const T& object){
		_array[x * height + y] = object;
	}
	template<typename Vector>
	inline T& get(Vector vec) const{
		return  _array[vec.x * height + vec.y];
	}
	template<typename Vector>
	inline static Vector getSurFromPos(uint64_t pos){
		return Vector((int)(pos / height), pos % height);
	};
};

template<typename T, uint32_t size, uint32_t height>
class Array3D{
	std::array<T, size * size * height> _array;
	uint64_t area = size * size;
public:
	inline T& get(uint32_t x, uint32_t y, uint32_t z){
		return  _array[y * area + x * size + z];
	}
	inline const T& get(uint32_t x, uint32_t y, uint32_t z) const{
		return  _array[y * area + x * size + z];
	}
	inline void set(uint32_t x, uint32_t y, uint32_t z, const T& object){
		_array[y * area + x * size + z] = object;
	}
	template<typename Vector>
	inline T& get(Vector vec) const{
		return  _array[vec.y * area + vec.x * size + vec.z];
	}
	template<typename Vector>
	inline static Vector getSurFromPos(uint64_t pos){
		return Vector(pos % size, pos / (size * size), pos % size);
	};
};
/*
double getNum(unsigned int x, unsigned int y, unsigned int z){
	if(x < size && z < size && y < height){
		return  y * size * size + x * size +z;
	}
	return -1;
}
void show(unsigned int x, unsigned int y, unsigned int z){
	printf("[%d, %d, %d] = %f\n", x, y, z, getNum(x, y, z));
}
*/
#include <math.h>
class Sphere{
	float _size;
	float _parts;
public:
	Sphere(float size, float parts){
		_size = size;
		_parts = parts;
	}

	void generate(){
		float stepV = 180 / _parts;
		float stepH = 90 / _parts;
		for(int i=0 ; i<_parts ; i++){
			double y = cos(i * stepV);
			for(int j=0 ; j<_parts ; j++){
				double x = cos(j * stepH);
				double z = sin(j * stepH);
				printf("[x, y, z] = [%f, %f, %f]\n", x, y, z);
			}
		}

	}
};
const uint32_t size = 3;
const uint32_t height = 5;

int main(void){
	Sphere sphere(1, 5);
	sphere.generate();
	Array3D<int, size, height> pole;
	pole.set(1, 2, 3, 321);

	printf("result: %d\n", pole.get(1, 2, 4));
	//printf("max: %f\n", size * size *height);
	/*
	int counter = 0;
	for(unsigned int k=0 ; k<height ; k++){
		for(unsigned int i=0 ; i<size ; i++){
			for(unsigned int j=0 ; j<size ; j++){
				unsigned locX = (counter / size) % size;
				unsigned locY = (counter / (size * size));
				unsigned locZ = counter % size;
				printf("[%d, %d, %d] == ", locX, locY, locZ);
				counter++;
				show(i, k, j);
			}
		}	
	}
	*/
	return 0;
}