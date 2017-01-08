#include <stdio.h>
#include <stdlib.h>

struct node{
	void * data;
	struct node * p_prev;
};

typedef struct front{
	struct node * p_first;
	struct node * p_last; 
	int size;
} Front;

void add(Front * front, void * item){
	struct node * newElement = (struct node *)malloc(sizeof(struct node));
	newElement -> p_prev = NULL;
	newElement -> data = item;

	if(front -> p_last == NULL){
		front -> p_last = front -> p_first = newElement;
	}
	else{
		front -> p_last -> p_prev = newElement;
		front -> p_last = newElement;
	}
	front -> size++;
}

void * delete(Front * front){
	if(!front -> size)
		return NULL;
	struct node * first = front -> p_first;
	front -> p_first = first -> p_prev;
	front -> size--;
	void * res = first -> data;
	free(first);

	return res;
}

int size(Front * front){
	return front -> size;
}

void * get(Front * front){
	if(!front -> size)
		return NULL;

	return front -> p_first -> data;
}

Front Front_new(){
	Front res;
	res.p_last = NULL;
	res.p_first = NULL;
	res.size = 0;
	return res;
}

Front * Front_newP(){
	Front * res = (Front *)malloc(sizeof(Front));
	res -> p_last = NULL;
	res -> p_first = NULL;
	res -> size = 0;
	return res;
}

int main(){
	Front * front = Front_newP();
	char meno[] = "a";
	char meno2[] = "b";
	char meno3[] = "c";
	char meno4[] = "d";
	char meno5[] = "e";

	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	add(front, meno);
	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	add(front, meno2);
	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	add(front, meno3);
	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	printf("\n");
	printf("del: %s\n", (char *)delete(front));
	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	printf("del: %s\n", (char *)delete(front));
	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	printf("del: %s\n", (char *)delete(front));
	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	printf("del: %s\n", (char *)delete(front));
	printf("size: %d, get: %s\n", size(front), (char *)get(front));
	return 0;
}