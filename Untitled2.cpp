#include <stdio.h>

using namespace std;

FILE* A;
FILE* B;

int main(){
  A = fopen("keycode.js", "r");
  B = fopen("output.txt", "w");
  int i;
  char c;
  for(i=0; true; i++){
    if(fscanf(A, "%c", &c)!=1) break;
    if(c=='&'){
            printf("123");
        fprintf(B, "\"");
    }else{
        fprintf(B, "%c", c);
    }
  }
  fclose(A);
  fclose(B);
  return 0;
}
