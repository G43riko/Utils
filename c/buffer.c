#include <stdio.h>
#include <stdlib.h>

struct node{
	void * data;
	struct node * p_prev;
};

typedef struct buffer{
	struct node * p_last; 
	int size;
} Buffer;

void add(Buffer * buffer, void * item){
	struct node * newElement = (struct node *)malloc(sizeof(struct node));
	newElement -> p_prev = NULL;
	newElement -> data = item;

	if(buffer -> p_last == NULL){
		buffer -> p_last = newElement;
	}
	else{
		newElement -> p_prev = buffer -> p_last;
		buffer -> p_last = newElement;
	}
	buffer -> size++;
}

void * delete(Buffer * buffer){
	if(buffer -> p_last == NULL)
		return NULL;
	struct node * last = buffer -> p_last;
	buffer -> p_last = last -> p_prev;
	buffer -> size--;
	void * res = last -> data;
	free(last);

	return res;
}

int size(Buffer * buffer){
	return buffer -> size;
}

void * get(Buffer * buffer){
	if(buffer -> p_last == NULL)
		return NULL;

	return buffer -> p_last -> data;
}

Buffer Buffer_new(){
	Buffer res;
	res.p_last = NULL;
	res.size = 0;
	return res;
}

Buffer * Buffer_newP(){
	Buffer * res = (Buffer *)malloc(sizeof(Buffer));
	res -> p_last = NULL;
	res -> size = 0;
	return res;
}

int main(){
	Buffer * buffer = Buffer_newP();
	char meno[] = "a";
	char meno2[] = "b";
	char meno3[] = "c";
	char meno4[] = "d";
	char meno5[] = "e";

	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	add(buffer, meno);
	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	add(buffer, meno2);
	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	add(buffer, meno3);
	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	printf("\n");
	printf("del: %s\n", (char *)delete(buffer));
	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	printf("del: %s\n", (char *)delete(buffer));
	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	printf("del: %s\n", (char *)delete(buffer));
	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	printf("del: %s\n", (char *)delete(buffer));
	printf("size: %d, get: %s\n", size(buffer), (char *)get(buffer));
	return 0;
}