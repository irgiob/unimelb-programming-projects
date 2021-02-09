/* * * * * * *
 * Hashing module for Assignment 2.
 *
 * created for COMP20007 Design of Algorithms 2020
 * template by Tobias Edwards <tobias.edwards@unimelb.edu.au>
 * implementation by Irgio Basrewan <ibasrewan@student.unimelb.edu.au>
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "hash.h"

// value of 2^n where n is number of binary bits per char, in this case 6
#define X 64
// maximum number of characters for one string/line
#define MAXCHAR 256

// reads a line from stdin and copies it to an array
void getline_stdin(char *string);
// converts char into int based on function in problem 1a
int chr2int(char chr);
// hashes string using hash function from problem 1
int hash_string(char *string, int m);
// inserts strings from stdin into a hash table
int insert_to_hashtable(char **hash_table, int n, int m, int k, char **strings);

// Implements a solution to Problem 1 (a), which reads in from stdin:
//   N M
//   str_1
//   str_2
//   ...
//   str_N
// And outputs (to stdout) the hash values of the N strings 1 per line.
void problem_1_a() {
  // initialize variables and read values for n & m from first line of stdin
  int n, m, i;
  char string[MAXCHAR+1]; 
  scanf("%d %d\n",&n,&m);

  // print out output of hash function for every following line in stdin
  for(i=0;i<n;i++) {
    getline_stdin(string);
    printf("%d\n",hash_string(string, m));
  }
}

// Implements a solution to Problem 1 (b), which reads in from stdin:
//   N M K
//   str_1
//   str_2
//   ...
//   str_N
// Each string is inputed (in the given order) into a hash table with size
// M. The collision resolution strategy must be linear probing with step
// size K. If an element cannot be inserted then the table size should be
// doubled and all elements should be re-hashed (in index order) before
// the element is re-inserted.
//
// This function must output the state of the hash table after all insertions
// are performed, in the following format
//   0: str_k
//   1:
//   2: str_l
//   3: str_p
//   4:
//   ...
//   (M-2): str_q
//   (M-1):
void problem_1_b() {
  // initialize a read values for n, m, & k from stdin
  int n, m, k, i;
  scanf("%d %d %d\n",&n,&m,&k);
  // initialize hash table with values to NULL
  char **hash_table = malloc(m*sizeof(char*));
  for(int j=0;j<m;j++){
    hash_table[j] = NULL;    
  }
  // initialize array of strings with strings from input
  char **strings = malloc(n*sizeof(char*));
  for(i=0;i<n;i++) {
    strings[i] = malloc(MAXCHAR*sizeof(char));
    getline_stdin(strings[i]);
  }

  // try to insert strings into hash table, if fail double size then repeat
  while(insert_to_hashtable(hash_table,n,m,k,strings) == -1) {
    m *= 2;
    hash_table = realloc(hash_table, m*sizeof(char*));
    for(int j=0;j<m;j++){
      hash_table[j] = NULL;    
    }
  }

  // once successful, print hash table to stdout
  for(i=0;i<m;i++){
    printf("%d:",i);
    if(hash_table[i] != NULL){
      printf(" %s",hash_table[i]);
      free(hash_table[i]);
    }
    printf("\n");
  }

  // free everything
  for(i=0;i<n;i++) {
    free(strings[i]);
  }
  free(strings);
  free(hash_table);
}

// functions used to solve problem 1

// reads a line from stdin and copies it to an array
void getline_stdin(char *string) {
  int i = 0;
  char chr;
  scanf("%c", &chr);
  while(chr != '\n') {
    string[i++] = chr;
    scanf("%c", &chr);
  }
  string[i] = '\0';
}

// converts char into int based on function in problem 1a
int chr2int(char chr) {
  if(chr >= 'a') {
    return chr - 97;
  }
  else if (chr <= '9') {
    return chr + 4;
  }
  else {
    return chr - 39;
  }
}

// hashes string using hash function from problem 1
int hash_string(char *string, int m) {
  // set sum to int value of first char mod m
  int sum = chr2int(string[0])%m, i = 1;

  // multiplies sum with 64 then adds next char until \0, uses mod identities
  // (a+b)mod c=(a mod c+b mod c)mod c & (ab)mod c=(a mod c)(b mod c)mod c
  while(string[i] != '\0') {
    sum = (sum%m * X%m)%m;
    sum = (sum%m + chr2int(string[i++])%m)%m;
  }

  // return final sum mod m once null byte is reached
  return sum % m;
}

// inserts strings from stdin into a hash table
int insert_to_hashtable(char **hash_table, int n, int m, int k, char **strings) {
  // initialize counting vars and var to store has val
  int i, j, hash_val, count = 0;

  for(i=0;i<n;i++) {
    // get hash val for every string
    hash_val = hash_string(strings[i], m);
    // jump to next available slot if collision
    if(hash_table[hash_val] != NULL) {
      int curr_val = (hash_val + k) % m;

      while(hash_table[curr_val] != NULL) {
        // if no available spots, rewrite strings array w/ new order
        if(curr_val == hash_val) {
          for(j=0;j<m;j++) {
            if(hash_table[j] != NULL) {
              strcpy(strings[count++],hash_table[j]);
              free(hash_table[j]);
            }
          }
          // return -1 to indicate the process failed
          return -1;
        }
        curr_val = (curr_val + k) % m;
      }
      hash_val = curr_val;
    }
    
    // if slot available, place string in that slot
    hash_table[hash_val] = malloc((strlen(strings[i])+1)*sizeof(char));
    strcpy(hash_table[hash_val],strings[i]);
  }
  return 1;
}