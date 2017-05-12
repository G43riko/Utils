#include <algorithm>
#include <functional>

#ifndef G_HASHER_H
#define G_HASHER_H

class Hasher{
public:
	template<typename T>
	inline static size_t hash(T x, T y, T z){
		std::hash<T> hasher;
		unsigned long h1 = hasher(x);
		unsigned long h2 = hasher(y);
		unsigned long h3 = hasher(z);

		return std::hash<T>{}(h1 ^ (h2 << h3) ^ h3);
	}

	template<typename T>
	inline static size_t hash(T x, T z){
		std::hash<T> hasher;
		unsigned long h1 = hasher(x);
		unsigned long h2 = hasher(z);

		return std::hash<T>{}((h1 ^ h2) >> 2);
	}
};

int main(){
    return 0;
}

#endif //G_HASHER_H