#include <iostream>
#include <stdio.h>
#include "GMaths2.h"
#include "Utils/GameLoop.h"
#include "Utils/MemoryManager.h"
#include "Utils/MeshSimplification.h"

void testLoop(void){
	GameLoop loop(80);
	printf("ms: %f\n", loop.getCurrentMilliseconds());
	printf("us: %f\n", loop.getCurrentMicroseconds());
	int i=100000;

	while(i--){
		
		if(loop.loop()){
			printf("fps: %d, delta: %f\n", loop.getFPS(), loop.getDelta());
		};
	}
	printf("ns: %f\n", loop.getCurrentNanoseconds());	
};
void testMeshSimplification(){
	simplification::test();
};	
void testVector(void){
	std::vector<int> v;
	//v.reserve(100);
	v.push_back(0);
	v.push_back(1);
	v.push_back(2);
	printf("size: %lu\n", v.size());
	for(int i : v){
		printf("%d, ", i);
	}
	printf("\n");
};

void testMemoryManager(void){
	struct test{
		static void t_old(void){
			Complex_old* array[1000];
		    for (int i = 0;i  <  50000; i++) {
		        for (int j = 0; j  <  1000; j++) {
		            array[j] = new Complex_old (i, j);
		        }
		        for (int j = 0; j  <  1000; j++) {
		            delete array[j];
		        }
		    }
		}
		static void t_new(void){
			Complex* array[1000];
		    for (int i = 0;i  <  50000; i++) {
		        for (int j = 0; j  <  1000; j++) {
		            array[j] = new Complex (i, j);
		        }
		        for (int j = 0; j  <  1000; j++) {
		            delete array[j];
		        }
		    }
		}
	};
	test::t_new();
	//test::t_old();
}

int main(void){
	testMemoryManager();
	//testLoop();
	//testMeshSimplification();
	return 0;
}