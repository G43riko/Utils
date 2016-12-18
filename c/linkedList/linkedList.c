#include <stdio.h>
#include <stdlib.h>

struct node{
	void * data;
	struct node * p_next;
	struct node * p_prev;
};

typedef struct list{
	struct node * first;
	struct node * last;
	int size;
} List;

void * getLast(List * list){return list -> last -> data;}
void * getFirst(List * list){return list -> first -> data;}
void * get(List * list, int id){
	if(id >= list -> size){
		return NULL;
	}
	int counter = 0;
	struct node * it = list -> first;
	while(it != NULL){
		if(id == counter){
			return it -> data;
		}
		counter++;
		it = it -> p_next;
	}
	return NULL;
}

struct node * createEmptyNode(void * data){
	struct node * newElement = (struct node *)malloc(sizeof(struct node));
	newElement -> data = data;
	newElement -> p_next = NULL;
	newElement -> p_prev = NULL;
	return newElement;
}

void * deleteFirst(List * list){
	if(list -> size == 0){
		return NULL;
	}
	
	struct node * first = list -> first;
	if(list -> size == 1){
		list -> first = list -> first = NULL;
	}
	else{
		list -> first = first -> p_next;
		list -> first -> p_prev = NULL;
	}
	list -> size--;
	void * result = first -> data;
	free(first);

	return result;
}

void * deleteLast(List * list){
	if(list -> size == 0){
		return NULL;
	}

	struct node * last = list -> last;
	if(list -> size == 1){
		list -> last = list -> first = NULL;
	}
	else{
		list -> last = last -> p_prev;
		list -> last -> p_next = NULL;
	}
	list -> size--;
	void * result = last -> data;
	free(last);
	return result;
}

void * delete(List * list, int index){
	if(index == 0){
		return deleteFirst(list);
	}
	if(index == list -> size){
		return deleteLast(list);
	}
	if(index > list -> size){
		return NULL;
	}

	int id = 0;
	struct node * it = list -> first;
	while(it != NULL){
		if(id++ == index){
			it -> p_prev -> p_next = it -> p_next;
			it -> p_next -> p_prev = it -> p_prev;

			void * result = it -> data;
			free(it);
			return result;
		}
		it = it -> p_next;
	}
}

void push_back(List * list, void * data){
	struct node * newElement = createEmptyNode(data);

	if(list -> size == 0){
		list -> last = list -> first = newElement;
	}
	else{
		list -> last -> p_next = newElement;
		newElement -> p_prev = list -> last;
		list -> last = newElement;
	}
	list -> size++;
}

void push_front(List * list, void * data){
	struct node * newElement = createEmptyNode(data);

	if(list -> size == 0){
		list -> last = list -> first = newElement;
	}
	else{
		list -> first -> p_prev = newElement;
		newElement -> p_next = list -> first;
		list -> first = newElement;
	}
	list -> size++;
}

void push_at(List * list, void * data, int index){
	struct node * newElement = createEmptyNode(data);
	if(index == 0){
		push_front(list, data);
		return;
	}
	if(index >= list -> size){
		push_back(list, data);
		return;
	}

	int id = 0;
	struct node * it = list -> first;
	while(it != NULL){
		if(id++ == index){
			it -> p_prev -> p_next = newElement;
			newElement -> p_prev = it -> p_prev;

			newElement -> p_next = it;
			it -> p_prev = newElement;
			return;
		}
		it = it -> p_next;
	}
}

int indexOf(List * list, void * element){
	int id = 0;
	struct node * it = list -> first;
	while(it != NULL){
		if(it -> data == element){
			return id;
		}
		id++;
		it = it -> p_next;
	}
	return -1;
}

void each(List * list, void(*func)(void *)){
	struct node * it = list -> first;
	while(it != NULL){
		func(it -> data);
		it = it -> p_next;
	}
}

int size(List * list){
	return list -> size;
}

List List_new() { 
	List res;
	res.size = 0;
	res.first = NULL;
	res.last = NULL;
	return res;
}

List * List_newP() { 
  List * res = (List *)malloc(sizeof(List))
  res -> size = 0;
  res -> first	= NULL;
  res -> last = NULL;
  return res;
}

void show(void * element){
	printf("res: %s\n", (char *)element);
}

int main(void){
	List * list = List_newP();
	char meno[] = "a";
	char meno2[] = "b";
	char meno3[] = "c";
	char meno4[] = "d";
	char meno5[] = "e";

	push_back(list, meno);
	push_back(list, meno2);
	push_back(list, meno3);
	push_front(list, meno4);

	each(list, show);

	printf("index of %s je %d\n", meno, indexOf(list, meno));
	printf("index of %s je %d\n", meno2, indexOf(list, meno2));
	printf("index of %s je %d\n", meno3, indexOf(list, meno3));
	printf("index of %s je %d\n", meno4, indexOf(list, meno4));
	printf("index of %s je %d\n", meno5, indexOf(list, meno5));

	printf("size: %d\n", size(list));

	printf("at index %d is %s\n", 0, (char*)get(list, 0));
	printf("at index %d is %s\n", 1, (char*)get(list, 1));
	printf("at index %d is %s\n", 2, (char*)get(list, 2));
	printf("at index %d is %s\n", 3, (char*)get(list, 3));
	printf("at index %d is %s\n", 4, (char*)get(list, 4));
	printf("at index %d is %s\n", 7, (char*)get(list, 7));

	printf("vymauzal sa: %s\n", (char *)deleteFirst(list));
	printf("vymauzal sa: %s\n", (char *)deleteLast(list));
	//printf("vymauzal sa: %s\n", (char *)deleteFirst(list));
	each(list, show);

}