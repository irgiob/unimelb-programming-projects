/* * * * * * *
 * Text Analysis module for Assignment 2.
 *
 * created for COMP20007 Design of Algorithms 2020
 * template by Tobias Edwards <tobias.edwards@unimelb.edu.au>
 * implementation by Irgio Basrewan <ibasrewan@student.unimelb.edu.au>
 */
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "text_analysis.h"

// constants

#define NCHAR 27
#define ASCII2INT 96
#define INITIAL_SIZE 32
#define MAX_PROB 5

// trie data type and funtions

typedef struct trie Trie;

struct trie {
    int freq;
    int chr;
    Trie* children[NCHAR];
    Trie *prev;
};

Trie *new_trie();
void free_trie(Trie *trie);
void fill_trie(Trie *trie, int n);
int max_trie_depth(Trie *trie, int max, int depth);

// print functions for each question

void print_trie_2a(Trie *trie);
void print_trie_2b(Trie *trie, int k, int depth);
void print_trie_2c(Trie *trie, char *stub, int depth, int stub_len);

// miscellaneous functions

void get_probabilities(Trie *trie, char **strings, int *curr_string, 
  int curr_depth, int *freqs);
int compare (const void *a, const void *b);

// Build a character level trie for a given set of words.
//
// The input to your program is an integer N followed by N lines containing
// words of length < 100 characters, containing only lowercase letters.
//
// Your program should built a character level trie where each node indicates
// a single character. Branches should be ordered in alphabetic order.
//
// Your program must output the post-order traversal of the characters in
// the trie, on a single line.
void problem_2_a() {
  // initialize trie and read n from stdin
  Trie *trie = new_trie();
  int n;
  scanf("%d\n",&n);

  // fill trie with strings from stdin
  fill_trie(trie,n);

  // print the trie according to 2a specifications
  printf("^\n");
  print_trie_2a(trie);

  // free trie
  free_trie(trie);
}

// Using the trie constructed in Part (a) this program should output all
// prefixes of length K, in alphabetic order along with their frequencies
// with their frequencies. The input will be:
//   n k
//   str_0
//   ...
//   str_(n-1)
// The output format should be as follows:
//   an 3
//   az 1
//   ba 12
//   ...
//   ye 1
void problem_2_b() {
  // initialize trie and read values of n & k from stdin
  Trie *trie = new_trie();
  int n, k;
  scanf("%d %d\n",&n,&k);

  // fill trie with strings from stdin
  fill_trie(trie,n);

  // print trie according to 2b specifications
  print_trie_2b(trie, k, 0);
  
  // free trie
  free_trie(trie);
}

// Again using the trie data structure you implemented for Part (a) you will
// provide a list (up to 5) of the most probable word completions for a given
// word stub.
//
// For example if the word stub is "al" your program may output:
//   0.50 algorithm
//   0.25 algebra
//   0.13 alright
//   0.06 albert
//   0.03 albania
//
// The probabilities should be formatted to exactly 2 decimal places and
// should be computed according to the following formula, for a word W with the
// prefix S:
//   Pr(word = W | stub = S) = Freq(word = W) / Freq(stub = S)
//
// The input to your program will be the following:
//   n
//   stub
//   str_0
//   ...
//   str_(n-1)
// That is, there are n + 1 strings in total, with the first being the word
// stub.
//
// If there are two strings with the same probability ties should be broken
// alphabetically (with "a" coming before "aa").
void problem_2_c() {
  // initialize trie and read value of n from stdin
  Trie *trie = new_trie();
  int n, output_size = INITIAL_SIZE, count = 0;
  scanf("%d\n",&n);

  // read stub string from stdin and store in array
  char *stub = malloc(output_size*sizeof(char)), chr;
  scanf("%c",&chr);
  while(chr != '\n') {
    stub[count++] = chr;
    scanf("%c",&chr);
    if(count == output_size) {
      output_size *= 2;
      stub = realloc(stub,output_size*sizeof(char));
    }
  }

  // fill trie with strings from stdin
  fill_trie(trie,n);

  // print trie according to 2c specifications
  print_trie_2c(trie, stub, 0, count);

  // free trie and array holding stub string
  free(stub);
  free_trie(trie);
}

// Trie Functions

// create a new trie structure
Trie *new_trie() {
    Trie *trie = malloc(sizeof(Trie));
    assert(trie);

    // set all properties of structure to default values
    trie->freq = 0;
    trie->chr = 0;
    trie->prev = NULL;
    int i;
    for(i=0;i<NCHAR;i++){
      trie->children[i] = NULL;
    }
    return trie;
}

// recursively free all trie structs in trie structure
void free_trie(Trie *trie) {
  int i;
  for(i=0;i<NCHAR;i++) {
    if(trie->children[i] != NULL) {
      free_trie(trie->children[i]);
    }
  }
  free(trie);
}

// fills trie with strings from stdin
void fill_trie(Trie *trie, int n) {
  // initialize variables
  int i, pos;
  char chr;

  // iterate for every string in text file
  for(i=0;i<n;i++) {
    Trie *head = trie;
    scanf("%c",&chr);
    while(chr != '\n') {

      // if specific char at specific depth does not exist,
      // create new trie in children index of that char
      pos = chr - ASCII2INT;
      if(head->children[pos] == NULL) {
        head->children[pos] = new_trie();
        head->children[pos]->chr = pos;
        head->children[pos]->prev = head;
      }
      head->children[pos]->freq += 1;
      scanf("%c",&chr);
      head = head->children[pos];
    }

    // at end of string, add $ trie element
    if(head->children[0] == NULL) {
      head->children[0] = new_trie();
      head->children[0]->chr = 0;
      head->children[0]->prev = head;
    }
    head->children[0]->freq += 1;
  }
}

// gets maximum depth of trie
int max_trie_depth(Trie *trie, int max, int depth) {
  int i;
  // recurse deeper into trie
  for(i=0;i<NCHAR;i++) {
    if(trie->children[i] != NULL && i != 0) {
      max = max_trie_depth(trie->children[i], max, depth+1);
    }
  }

  // return maximum of max and current depth
  if(depth > max) {
    return depth;
  } else {
    return max;
  }
}

// print functions for the different problems

// prints each element in the trie through preorder traversal
void print_trie_2a(Trie *trie) {
  int i;
  for(i=0;i<NCHAR;i++) {

    // if element exists, print its char value
    if(trie->children[i] != NULL) {
      if(i == 0) {
        printf("$\n");
      } else {
        printf("%c\n",(char)(i+ASCII2INT));
      }

      // recurse for lower depth elements
      print_trie_2a(trie->children[i]);
    }
  }
}

void print_trie_2b(Trie *trie, int k, int depth) {
  // intialize variables 
  int i, j, count = 0;
  char *output = malloc(k*sizeof(char));

  for(i=0;i<NCHAR;i++) {
    // if depth has reached k,
    if(k == depth) {
      
      // backtrack towards root, copying char into output array as you go
      Trie *head = trie;
      while(head->prev != NULL) {
        output[count++] = (char)(head->chr + ASCII2INT);
        head = head->prev;
      }

      // print output array in reverse order
      for(j=count-1;j>=0;j--) {
        printf("%c",output[j]);
      }

      // print frequency for that specific string
      printf(" %d\n",trie->freq);
      break;
    }
    // if k has not reach depth, traverse deeper
    if(trie->children[i] != NULL && i != 0) {
      print_trie_2b(trie->children[i], k, depth+1);
    }
  }

  // free output array
  free(output);
}

void print_trie_2c(Trie *trie, char *stub, int depth, int stub_len) {
  // initialize variables
  int i, j, k, max_len = max_trie_depth(trie,0,0), count = 0, curr_string = 0;

  // intialize array to store frequencies of strings (sorted & unsorted)
  int *freqs = malloc(trie->freq*sizeof(int));
  int *sorted_freqs = malloc(trie->freq*sizeof(int));

  // initialize array of strings to store strings from trie
  char **strings = malloc(trie->freq*sizeof(char*));
  for(i=0;i<trie->freq;i++) {
    strings[i] = malloc((max_len+2)*sizeof(char));
  }

  for(i=0;i<NCHAR;i++) {
    if(trie->children[i] != NULL) {
      // if trie has traversed to same depth as stub,
      if(depth == stub_len) {

        // get probabilities of strings: store said strings in strings array
        // and store frequency of said strings in freqs array
        get_probabilities(trie, strings, &curr_string, depth, freqs);

        // copy values from freqs array to sorted version then sort
        for(j=0;j<curr_string;j++) {
          sorted_freqs[j] = freqs[j];
        }
        qsort(sorted_freqs,curr_string,sizeof(int),compare);

        // iterate through sorted and unsorted freqs arrays
        for(j=0;j<curr_string;j++) {
          for(k=0;k<curr_string;k++) {

            // stop printing if maximum strings to print is reached
            if(count == MAX_PROB) {
              break;
            }

            // if sorted array equals unsorted, using index of unsorted to
            // print correct string to stdout w/ corresponding probability
            if(sorted_freqs[j] == freqs[k]) {
              printf("%.2f %s\n",(double)freqs[k]/trie->freq, strings[k]);
              freqs[k] = 0;
              count += 1;
            }
          }
        }
        break;
      }

      // while trie depth hasn't reached stub, traverse deeper
      if((char)(trie->children[i]->chr+ASCII2INT) == stub[depth]) {
        print_trie_2c(trie->children[i], stub, depth+1, stub_len);
        break;
      }
    }
  }
  // free everything
  free(sorted_freqs);
  free(freqs);
  for(i=0;i<trie->freq;i++) {
    free(strings[i]);
  }
  free(strings);
}

// get probabilities of of strings from trie
void get_probabilities(Trie *trie, char **strings, int *curr_string, 
  int curr_depth, int *freqs) {
  int i;
  // if end of string reached
  if(trie->chr == 0) {

    // record frequency of string
    freqs[*curr_string] = trie->freq;

    // iterate up back up, copying string into the strings array as you go
    Trie *head = trie->prev;
    strings[*curr_string][curr_depth-1] = '\0';
    for(i=curr_depth-2;i>=0;i--) {
      strings[*curr_string][i] = (char)(head->chr + ASCII2INT);
      head = head->prev;
    }

    // increment position in strings array
    *curr_string += 1;
    
  } 

  // if end of string not yet reached, recurse deeper
  else {
    for(i=0;i<NCHAR;i++) {
      if(trie->children[i] != NULL) {
        get_probabilities(trie->children[i], strings, curr_string, 
          curr_depth+1, freqs);
      }
    }
  }
}

// compare function for qsort
int compare (const void *a, const void *b) {
  return ( *(int*)b - *(int*)a );
}