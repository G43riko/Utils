#include <sys/types.h> 
#include "LinkedMemoryManager.h"
#include "BitmapMemoryManager.h"

LinkedMemoryManager gMemoryManager;

class Complex_old {
    double r; // Real Part
    double c; // Complex Part
public:
    Complex_old (double a, double b): r (a), c (b) {}
};

class Complex {
    union { 
        struct { 
            double r; // Real Part
            double c; // Complex Part
        };
        Complex* next;
    };
public:
    void* operator new(size_t size){return gMemoryManager.allocate(size);}; 
    void* operator new[ ](size_t size){return  gMemoryManager.allocate(size);};
    void operator delete (void* pointerToDelete){gMemoryManager.free(pointerToDelete);};
    void operator delete[ ] (void* arrayToDelete){gMemoryManager.free(arrayToDelete);};

    Complex (double a, double b): r (a), c (b) {}
};

int main(void){
    return 0;
};