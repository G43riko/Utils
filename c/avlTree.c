#include <stdio.h>
#include <stdlib.h>

#define MAX(a, b) (a > b ? a : b)

typedef struct Node{
	int key;
	struct Node * left;
	struct Node * right;
	void * data;
	int height;
} Node;

typedef struct avl{
	Node * root;
	int size;
} AVL;

struct Node * createEmptyNode(int key, void * data){
	Node * newElement = (Node *)malloc(sizeof(Node));
	newElement -> key = key;
	newElement -> data = data;
	newElement -> left = newElement -> right = NULL;
	newElement -> height = 1;
	return newElement;
}

/**************************************
 AVL TREEE ROTATIONS
 **************************************/
Node * leftRotation(Node * k2){
	Node * k1 = k2 -> left;

	k2 -> left = k1 -> right;
	k1 -> right = k2;
 
	k2 -> height = MAX(height(k2 -> left), height(k2 -> right)) + 1;
	k1 -> height = MAX(height(k1 -> left), k2 -> height) + 1;
	return k1;
}

Node * rightRotation(Node * k1){
	Node * k2 = k1 -> right;

	k1 -> right = k2 -> left;
	k2 -> left = k1;
 
	k1 -> height = MAX(height(k1 -> left), height(k1 -> right)) + 1;
	k2 -> height = MAX(height(k2 -> right), k1 -> height) + 1;
 
	return k2;
}

Node * doubleLeftRotation(Node * k3){
	k3 -> left = rightRotation(k3 -> left);
	return leftRotation(k3);
}

Node * doubleRightRotation(Node * k1){
	k1 -> right = leftRotation(k1 -> right);
	return rightRotation(k1);
}
/**************************************
 AVL OPERATIONS
 **************************************/

void insert(AVL * avl, void * data, int key){
	if(!avl -> size){
		avl -> root = createEmptyNode(key, data);
	}
	avl -> size++
	//TODO dorobiť
}

void * get(AVL * avl, int key){
	if(!avl -> size)
		return NULL;
	//TODO dorobiť
}

void * remove(AVL * avl, int key){
	if(!avl -> size)
		return NULL;
	//TODO dorobiť
}

int height(Node * node){
	return (node == NULL ? - 1 : node -> height);
}

void size(AVL * avl){
	return av -> size;
}

AVL Avl_new(){
	AVL result;
	result.root = NULL;
	result.size = 0;
	return result;
}

AVL * Avl_newP(){
	AVL * result = (AVL *)malloc(sizeof(AVL));
	result -> root = NULL;
	result -> size = 0;
	return result;
}

int main(){
	return 0;
}