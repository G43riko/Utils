#ifndef __MEMORY_MANAGER_H_
#define __MEMORY_MANAGER_H_

class MemoryManager {
public:
	virtual void* allocate(size_t) = 0;
	virtual void   free(void*) = 0;
};

#endif //__MEMORY_MANAGER_H_