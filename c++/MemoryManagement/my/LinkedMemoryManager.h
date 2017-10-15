#include "MemoryManager.h"
#include <sys/types.h> 

#define POOLSIZE 32
#define BLOCK_SIZE /*sizeof(Complex)*/10
class LinkedMemoryManager: public MemoryManager { 
    struct FreeStore{
        FreeStore *next;
    }; 
    void expandPoolSize(void);
    void cleanUp(void){
        FreeStore* nextPtr = freeStoreHead;
        for (; nextPtr; nextPtr = freeStoreHead) {
            freeStoreHead = freeStoreHead -> next;
            delete [] nextPtr; // remember this was a char array
        }
    };
    FreeStore* freeStoreHead;
public:
    inline LinkedMemoryManager(void) { 
        freeStoreHead = 0;
        expandPoolSize ();
    }
    inline virtual ~LinkedMemoryManager(void) { 
        cleanUp ();
    }
    virtual void* allocate(size_t size){
        if (0 == freeStoreHead){
            expandPoolSize ();
        }

        FreeStore* head = freeStoreHead; freeStoreHead = head -> next;
        return head;
    };
    virtual void free(void* deleted){
        FreeStore* head = static_cast <FreeStore*> (deleted);
        head -> next = freeStoreHead;
        freeStoreHead = head;
    };
};

void LinkedMemoryManager::expandPoolSize(void){
    size_t size = (BLOCK_SIZE > sizeof(FreeStore*)) ? BLOCK_SIZE : sizeof(FreeStore*);
    FreeStore* head = reinterpret_cast <FreeStore*> (new char[size]);
    freeStoreHead = head;

    for (int i = 0; i < POOLSIZE; i++) {
        head -> next = reinterpret_cast <FreeStore*> (new char [size]);
        head = head -> next;
    }

    head -> next = 0;
};