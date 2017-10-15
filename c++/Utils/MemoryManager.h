#include <sys/types.h> 

#define POOLSIZE 32

class MemoryManager {
public:
    virtual void* allocate(size_t) = 0;
    virtual void   free(void*) = 0;
};

class Complex_old {
public:
    Complex_old (double a, double b): r (a), c (b) {}
    private:
    double r; // Real Part
    double c; // Complex Part
};
   


MemoryManager gMemoryManager;

class Complex {
    union { 
        struct { 
            double r; // Real Part
            double c; // Complex Part
        };
        Complex* next;
    };
public:
    void* operator new(size_t size){
        return gMemoryManager.allocate(size);
    }; 
    void* operator new[ ](size_t size){
        return  gMemoryManager.allocate(size);
    };
    void operator delete (void* pointerToDelete){
        gMemoryManager.free(pointerToDelete);
    };
 
    void operator delete[ ] (void* arrayToDelete){
        gMemoryManager.free(arrayToDelete);
    };
public:
    Complex (double a, double b): r (a), c (b) {}
};

void MemoryManager::expandPoolSize(void){
    size_t size = (sizeof(Complex) > sizeof(FreeStore*)) ?
    sizeof(Complex) : sizeof(FreeStore*);
    FreeStore* head = reinterpret_cast <FreeStore*> (new char[size]);
    freeStoreHead = head;

    for (int i = 0; i < POOLSIZE; i++) {
        head -> next = reinterpret_cast <FreeStore*> (new char [size]);
        head = head -> next;
    }

    head -> next = 0;
};


typedef struct ArrayInfo{
    int MemPoolListIndex;
    int StartPosition;
    int Size;
} ArrayMemoryInfo;
typedef struct BitMapEntry{
    int      Index;
    int      BlocksAvailable;
    int      BitMap[BIT_MAP_SIZE];
    public:
    BitMapEntry():BlocksAvailable(BIT_MAP_SIZE){
        memset(BitMap,0xff,BIT_MAP_SIZE / sizeof(char)); 
        // initially all blocks are free and bit value 1 in the map denotes 
        // available block
    }
    void SetBit(int position, bool flag);
    void SetMultipleBits(int position, bool flag, int count);
    void SetRangeOfInt(int* element, int msb, int lsb, bool flag);
    Complex* FirstFreeBlock(size_t size);
    Complex* ComplexObjectAddress(int pos);
    void* Head();
} BitMapEntry;

class MemoryManagerBit : public IMemoryManager {
    std::vector<void*> MemoryPoolList;
    std::vector<BitMapEntry> BitMapEntryList;
    //the above two lists will maintain one-to-one correspondence and hence 
    //should be of same  size.
    std::set<BitMapEntry*> FreeMapEntries;
    std::map<void*, ArrayMemoryInfo> ArrayMemoryList;

    void* AllocateArrayMemory(size_t size);
    void* AllocateChunkAndInitBitMap();
    void SetBlockBit(void* object, bool flag){
        int i = BitMapEntryList.size() - 1;
        for (; i >= 0 ; i--){
            BitMapEntry* bitMap = &BitMapEntryList[i];
            if((bitMap->Head <= object ) && 
               (&(static_cast<Complex*>(bitMap->Head))[BIT_MAP_SIZE-1] >= object)){
                    int position = static_cast<Complex*>(object) - 
                    static_cast<Complex*>(bitMap->Head);
                    bitMap->SetBit(position, flag);
                    flag ? bitMap->BlocksAvailable++ : bitMap->BlocksAvailable--;
            }
        }
    };
    void SetMultipleBlockBits(ArrayMemoryInfo* info, bool flag){
        BitMapEntry* mapEntry = &BitMapEntryList[info->MemPoolListIndex];
        mapEntry->SetMultipleBits(info->StartPosition, flag, info->Size);
    };
public:
    MemoryManager( ) {}
    ~MemoryManager( ) {}
    void* allocate(size_t){
        if(size == sizeof(Complex)){    // mon-array version
            std::set<BitMapEntry*>::iterator freeMapI = FreeMapEntries.begin();
            if(freeMapI != FreeMapEntries.end()){
                BitMapEntry* mapEntry = *freeMapI;
                return mapEntry->FirstFreeBlock(size);
            }
            else{
                AllocateChunkAndInitBitMap();
                FreeMapEntries.insert(&(BitMapEntryList[BitMapEntryList.size() - 1]));
                return BitMapEntryList[BitMapEntryList.size() - 1].FirstFreeBlock(size);
            }
        }
        else{  // array version
            if(ArrayMemoryList.empty()){
                return AllocateArrayMemory(size);
            }
            else{
                std::map<void*, ArrayMemoryInfo>::iterator infoI =ArrayMemoryList.begin();
                std::map<void*, ArrayMemoryInfo>::iterator infoEndI = 
                ArrayMemoryList.end();
                while(infoI != infoEndI){
                    ArrayMemoryInfo info = (*infoI).second;
                    if(info.StartPosition != 0)  // search only in those mem blocks  
                        continue;             // where allocation is done from first byte
                    else {
                        BitMapEntry* entry = &BitMapEntryList[info.MemPoolListIndex];
                        if(entry->BlocksAvailable < (size / sizeof(Complex))) 
                            return AllocateArrayMemory(size);
                        else {
                            info.StartPosition = BIT_MAP_SIZE - entry->BlocksAvailable;
                            info.Size = size / sizeof(Complex);
                            Complex* baseAddress = static_cast<Complex*>(
                            MemoryPoolList[info.MemPoolListIndex]) + info.StartPosition;

                            ArrayMemoryList[baseAddress] = info;
                            SetMultipleBlockBits(&info, false);

                            return baseAddress;
                        } 
                    }
                }
            }
        } 
    };
    void free(void*){
        if(ArrayMemoryList.find(object) == ArrayMemoryList.end())
            SetBlockBit(object, true);         // simple block deletion 
        else{//memory block deletion
            ArrayMemoryInfo *info = &ArrayMemoryList[object];
            SetMultipleBlockBits(info, true);
        }
    };
    std::vector<void*> GetMemoryPoolList(); 
};
const int JOB_SCHEDULER_SIZE = sizeof(JobScheduler);
const int COMPLEX_SIZE = sizeof(Complex);
const int COORDINATE_SIZE = sizeof(Coordinate);
const int POOL_SIZE = 1024; //number of elements in a single pool
          //can be chosen based on application requirements 
 
const int MAX_BLOCK_SIZE = 36; //depending on the application it may change 
              //In above case it came as 36

class MemoryManagerFreeList : public IMemoryManager {
    VoidPtrList     Byte8PtrList;
    VoidPtrList     Byte16PtrList;
    VoidPtrList     Byte24PtrList;
    VoidPtrList     Byte32PtrList;
    VoidPtrList     Byte40PtrList;
    std::vector<void*>    MemoryPoolList;
public: 
    MemoryManager( ) {}
    ~MemoryManager( ) {}
    void* allocate(size_t){
        void* base = 0;
      switch(size)
        {
        case JOB_SCHEDULER_SIZE :  
          {
          if(Byte32PtrList.empty())
            {
            base = new char [32 * POOL_SIZE];
            MemoryPoolList.push_back(base);
            InitialiseByte32List(base);
            }
          void* blockPtr =  Byte32PtrList.front();
          *((static_cast<char*>(blockPtr)) + 30) = 32; //size of block set
          *((static_cast<char*>(blockPtr)) + 31) = 0; //block is no longer free
          Byte32PtrList.pop_front();
          return blockPtr;
          }         
        case COORDINATE_SIZE :  
          {
          if(Byte40PtrList.empty())
            {
            base = new char [40 * POOL_SIZE];
            MemoryPoolList.push_back(base);
            InitialiseByte40List(base);
            }
          void* blockPtr =  Byte40PtrList.front();
          *((static_cast<char*>(blockPtr)) + 38) = 40; //size of block set
          *((static_cast<char*>(blockPtr)) + 39) = 0; //block is no longer free
          Byte40PtrList.pop_front();
          return blockPtr;
          }         
        case COMPLEX_SIZE : 
          {
          if(Byte24PtrList.empty())
            {
            base = new char [24 * POOL_SIZE];
            MemoryPoolList.push_back(base);
            InitialiseByte24List(base);
            }
          void* blockPtr =  Byte24PtrList.front();
          *((static_cast<char*>(blockPtr)) + 22) = 24; //size of block set
          *((static_cast<char*>(blockPtr)) + 23) = 0; //block is no longer free
          Byte24PtrList.pop_front();
          return blockPtr;
          }
        default : break;
        }
      return 0;
    };
    void free(void*){
        char* init = static_cast<char*>(object);
 
      while(1)
        {
        int count = 0;
        while(*init != static_cast<char>(0xde))  
              //this loop shall never iterate more than 
          {                 // MAX_BLOCK_SIZE times and hence is O(1)
          init++;
          if(count > MAX_BLOCK_SIZE)
            {
            printf ("runtime heap memory corruption near %d", object);
            exit(1);
            } 
          count++; 
          }
        if(*(++init) == static_cast<char>(0xad))  // we have hit the guard bytes
          break;  // from the outer while 
        }
      init++;
      int blockSize = static_cast<int>(*init);
      switch(blockSize)
        {
        case 24: Byte24PtrList.push_front(object); break;
        case 32: Byte32PtrList.push_front(object); break;
        case 40: Byte40PtrList.push_front(object); break;
        default: break;
        }
      init++;
      *init = 1; // set free/available byte   
    };
};