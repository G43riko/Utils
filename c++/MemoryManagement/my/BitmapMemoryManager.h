#ifndef __MEMMGR_H_
#define __MEMMGR_H_

#include "MemoryManager.h"
#include <vector>
#include <set>
#include <map>
#include <bitset>

const int BIT_MAP_SIZE = 1024;
const int INT_SIZE = sizeof(int) * 8;
const int BIT_MAP_ELEMENTS = BIT_MAP_SIZE / INT_SIZE;

//Memory Allocation Pattern
//11111111 11111111 11111111
//11111110 11111111 11111111
//11111100 11111111 11111111
//if all bits for 1st section become 0 proceed to next section

//...
//00000000 11111111 11111111
//00000000 11111110 11111111
//00000000 11111100 11111111
//00000000 11111000 11111111

//The reason for this strategy is that lookup becomes O(1) inside the map 
//for the first available free block


typedef struct ArrayInfo{
    int MemPoolListIndex;
    int StartPosition;
    int Size;
} ArrayMemoryInfo;

typedef struct BitMapEntry{
    int Index;
    int BlocksAvailable;
    int BitMap[BIT_MAP_SIZE];
    BitMapEntry():BlocksAvailable(BIT_MAP_SIZE){
        memset(BitMap,0xff,BIT_MAP_SIZE / sizeof(char)); 
        // initially all blocks are free and bit value 1 in the map denotes 
        // available block
    }
    void SetBit(int position, bool flag){
        BlocksAvailable += flag ? 1 : -1;
        int elementNo = position / INT_SIZE;
        int bitNo = position % INT_SIZE;
        BitMap[elementNo] = flag ? BitMap[elementNo] | (1 << bitNo) : BitMap[elementNo] & ~(1 << bitNo); 
    };
    void SetMultipleBits(int position, bool flag, int count){
        BlocksAvailable += flag ? count : -count;
        int elementNo = position / INT_SIZE;
        int bitNo = position % INT_SIZE;

        int bitSize = (count <= INT_SIZE - bitNo) ? count : INT_SIZE - bitNo;  
        SetRangeOfInt(&BitMap[elementNo], bitNo + bitSize - 1, bitNo, flag);
        count -= bitSize;
        if (!count) return;

        int i = ++elementNo;
        while(count >= 0){
            if (count <= INT_SIZE){
                SetRangeOfInt(&BitMap[i], count - 1, 0, flag);
                return;
            }
            else 
                BitMap[i] = flag ? unsigned (-1) : 0;
            count -= 32; 
            i++;
        }
    };
    void SetRangeOfInt(int* element, int msb, int lsb, bool flag){
        for(int i = 0 ; i < BIT_MAP_ELEMENTS; ++i){
        if(flag){
            int mask = (unsigned(-1) << lsb) & (unsigned(-1) >> INT_SIZE-msb-1);
            *element |= mask;
        }
        else {
            int mask = (unsigned(-1) << lsb) & (unsigned(-1) >> INT_SIZE-msb-1);
            *element &= ~mask;
        }
        };
        Complex* FirstFreeBlock(size_t size);
        Complex* ComplexObjectAddress(int pos);
        void* Head();
    }
} BitMapEntry;

class BitmapMemoryManager : public MemoryManager {
    std::vector<void*> MemoryPoolList;
    std::vector<BitMapEntry> BitMapEntryList;
    //the above two lists will maintain one-to-one correpondence and hence 
    //should be of same  size.
    std::set<BitMapEntry*> FreeMapEntries;
    std::map<void*, ArrayMemoryInfo> ArrayMemoryList;

    void* AllocateArrayMemory(size_t size);
    void* AllocateChunkAndInitBitMap();
    void SetBlockBit(void* object, bool flag);
    void SetMultipleBlockBits(ArrayMemoryInfo* info, bool flag);
public:
     BitmapMemoryManager( ) {}
    ~BitmapMemoryManager( ) {}
    void* allocate(size_t);
    void   free(void*);
    std::vector<void*>& GetMemoryPoolList(); 
};

#endif