#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/time.h>

struct node{
	void * value;
	unsigned int key;
	struct node * p_next;
};

typedef struct map{
	struct node ** lists;
	struct node ** lastElements; //TODO pointer na poslednu entitu na zrychlenie pridavania
	int allocated; //velkosť alokovaného pola
	int used; //počet použitých polí
	//double rehashRatio; //pomer hovoriaci o tom kedy sa má mapa rehashovať
	int items; //počet dát
} Map;


struct node * createEmptyNode(unsigned int key, void * data){
	struct node * newElement = (struct node *)malloc(sizeof(struct node));
	newElement -> value = data;
	newElement -> key = key;
	newElement -> p_next = NULL;
	return newElement;
}

Map Map_new(int size){
	Map result;
	result.used = 0;
	result.items = 0;
	result.allocated = size;
	result.lists = (struct node **)malloc(sizeof(struct node*) * size);
	result.lastElements = (struct node **)malloc(sizeof(struct node*) * size);
	for(int i=0 ; i<size ; i++){
		result.lists[i] = NULL;
		result.lastElements[i] = NULL;
	}
	return result;
}

Map * Map_newP(int size){
	Map * result = (Map *)malloc(sizeof(Map));
	result -> used = 0;
	result -> items = 0;
	result -> allocated = size;
	result -> lists = (struct node **)malloc(sizeof(struct node*) * size);
	result -> lastElements = (struct node **)malloc(sizeof(struct node*) * size);
	for(int i=0 ; i<size ; i++){
		result -> lists[i] = NULL;
		result -> lastElements[i] = NULL;
	}
	return result;
}

void cleanUp(Map * map){
	//TODO vymazať všetky alokovane prvky
	free(map -> lists);
	free(map);
}

void * removeElement(Map * mapa, unsigned int key){
	int hash = key % mapa -> allocated;
	if(mapa -> lists[hash] == NULL){
		return NULL;
	}
	struct node * p_act, * p_prev;
	for(p_prev = p_act = mapa -> lists[hash] ; p_act != NULL ; p_prev = p_act, p_act = p_act -> p_next){
		if(p_act -> key == key){
			p_prev -> p_next = p_act -> p_next;
			mapa -> items--;
			if(p_act == p_prev){
				mapa -> used--;
				mapa -> lists[hash] = NULL;
				mapa -> lastElements[hash] = NULL;
			}
			if(p_act -> p_next == NULL){
				mapa -> lastElements[hash] = p_prev;
			}
			void * result = p_act -> value;
			free(p_act);
			return result;
		}
	}
}
/*
void rehash(Map * mapa, int size){
	struct node ** newList = (struct node **)malloc(sizeof(struct node*) * size);
	struct node * p_act, p_prev;
	for(int i=0 ; i<mapa -> allocated ; i++){
		if(mapa -> lists[i] != NULL){
			for(p_prev = p_act = mapa -> lists[i] ; p_act != NULL ; p_prev = p_act, p_act = p_act -> p_next){
				if(p_prev != p_act){
					free(p_prev);
				}	

				//presunut p_act donoveho zoznamu
			}
			free(p_prev);
		}
	}



	mapa -> allocated = size;
}
*/

void add(Map * mapa, unsigned int key, void * val){
	int hash = key % mapa -> allocated;
	if(mapa -> lists[hash] == NULL){
		mapa -> lists[hash] = createEmptyNode(key, val);
		mapa -> lastElements[hash] = mapa -> lists[hash];
		mapa -> used++;
	}
	else{
		mapa -> lastElements[hash] -> p_next = createEmptyNode(key, val);
		mapa -> lastElements[hash] = mapa -> lastElements[hash] -> p_next;
		/*
		struct node * p_act;
		for(p_act = mapa -> lists[hash] ; p_act -> p_next != NULL ; p_act = p_act -> p_next);
		p_act -> p_next = createEmptyNode(key, val);
		mapa -> lastElements[hash] = p_act -> p_next;
		*/
	}
	mapa -> items++;
	
}

void showData(Map * mapa){
	printf("used: %d, allocated: %d, items: %d\n", mapa -> used, mapa -> allocated, mapa -> items);
}

void * get(Map * mapa, unsigned int key){
	int hash = key % mapa -> allocated;
	if(mapa -> lists[hash] == NULL){
		return NULL;
	}
	struct node * p_act;
	//TODO for by mal isť od predu aj odzadu až ku stredu
	//TODO starať sa o zotriedenie aby sa logaritmicky hladalo
	for(p_act = mapa -> lists[hash] ; p_act != NULL ; p_act = p_act -> p_next){
		if(p_act -> key == key){
			return p_act -> value;
		}
	}
}

int getHashVal(char * str){
	unsigned int i, len = strlen(str), h = 0;
	for(i=0 ; i<len ; i++)
		h = 7 * h + str[i];
	return h;
}


int main(){
	Map * mapa = Map_newP(10);
	int count = 100000;
	char * meno = "abcdefghij";

	struct timeval stop, start, bp1, bp2;
	gettimeofday(&start, NULL);
	for(int i=0 ;i<count ; i++)
		add(mapa, i, meno);

	showData(mapa);
	gettimeofday(&bp1, NULL);
	
	for(int i=0 ; i<count ; i++)
		get(mapa, i);

	showData(mapa);
	gettimeofday(&bp2, NULL);

	for(int i=0 ; i<count ; i++)
		removeElement(mapa, i);

	gettimeofday(&stop, NULL);

	printf("all %lu\n", stop.tv_usec - start.tv_usec);
	printf("add %lu\n", bp1.tv_usec - start.tv_usec);
	printf("get %lu\n", bp2.tv_usec - bp1.tv_usec);
	printf("remove %lu\n", stop.tv_usec - bp2.tv_usec);

	return 0;
	char * meno1 = "gabriel";
	char * meno2 = "magdalena";
	char * meno3 = "kristina";
	char * meno4 = "nikola";

	showData(mapa);

	add(mapa, getHashVal(meno1), (void*)meno1);
	add(mapa, getHashVal(meno2), (void*)meno2);
	add(mapa, getHashVal(meno3), (void*)meno3);
	add(mapa, getHashVal(meno4), (void*)meno4);
	
	showData(mapa);

	printf("pre %s to vratilo %s\n", meno1, (char *)get(mapa, getHashVal(meno1)));
	printf("pre %s to vratilo %s\n", meno2, (char *)get(mapa, getHashVal(meno2)));
	printf("pre %s to vratilo %s\n", meno3, (char *)get(mapa, getHashVal(meno3)));
	printf("pre %s to vratilo %s\n", meno4, (char *)get(mapa, getHashVal(meno4)));

	showData(mapa);

	printf("mal sa vymazat %s a zmazal sa %s\n", meno1, (char *)removeElement(mapa, getHashVal(meno1)));
	printf("mal sa vymazat %s a zmazal sa %s\n", meno2, (char *)removeElement(mapa, getHashVal(meno2)));
	printf("mal sa vymazat %s a zmazal sa %s\n", meno3, (char *)removeElement(mapa, getHashVal(meno3)));
	printf("mal sa vymazat %s a zmazal sa %s\n", meno4, (char *)removeElement(mapa, getHashVal(meno4)));

	showData(mapa);
	
	return 0;
}