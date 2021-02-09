/* * * * * * *
 * Main program for Assignment 1
 *
 * created for COMP20007 Design of Algorithms 2020
 * by Tobias Edwards <tobias.edwards@unimelb.edu.au>
 */

// DO NOT CHANGE THIS FILE

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "deque.h"
#include "parkranger.h"
#include "util.h"

// We expect the command to have the form: PROG -OPT
#define EXPECTED_OPTS 2

// Command line argument options
#define OPT_ITERATIVE  1
#define OPT_RECURSIVE  2
#define OPT_SPLIT      3
#define OPT_PARKRANGER 4

// Prints out the usage instructions and valid command line arguments for this
// program.
void print_usage(char *prog_name);

// Returns the command line option given to this program.
//
// If there are too many (> 1) or not enough (0) command line arguments
// provided an error is printed, along with the usage of the program.
int get_option(int argc, char **argv);

// Read integers from stdin, one per line, into a Deque and then return this
// Deque. Integers are inserted at the bottom of the Deque so tha the first
// integer read is the top of the Deque and the final element is the bottom of
// the Deque.
Deque *read_deque();

// Test a Deque reverse function by reading integers from stdin into a Deque,
// reversing the Deque using the specified function and printing the contents.
// The Deque is freed before this function returns.
void test_reverse(void (*reverse)(Deque *));

// Test the split_deque function by reading the critical value k from stdin
// followed by some number of integers (possibly none). These integers are
// inserted at the bottom of the deque, and then split_deque is called. The
// Deque is then printed and freed.
void test_split();

// Test the is_single_run_possible() function from the parkranger module.
// This function doesn't read anything from stdin, as this is handled by the
// function we are testing. This function will print one of the two options:
//   the trees on the ski slope CAN be trimmed in one run
// or,
//   the trees on the ski slope CANNOT be trimmed in one run
void test_parkranger();

int main(int argc, char **argv) {
  int opt = get_option(argc, argv);

  if (opt == OPT_ITERATIVE) {
    test_reverse(iterative_reverse);
  } else if (opt == OPT_RECURSIVE) {
    test_reverse(recursive_reverse);
  } else if (opt == OPT_SPLIT) {
    test_split();
  } else if (opt == OPT_PARKRANGER) {
    test_parkranger();
  }

  return 0;
}

// Prints out the usage instructions and valid command line arguments for this
// program.
void print_usage(char *prog_name) {
  printf("usage: %s [option] < <input_file>\n", prog_name);
  printf("\n");
  printf("options:\n");
  printf("\tp2a \tTest the Deque iterative_reverse() function\n");
  printf("\tp2b \tTest the Deque recursive_reverse() function\n");
  printf("\tp2c \tTest the Deque split() function\n");
  printf("\tp3a \tTest the is_single_run_possible() function\n");
}

// Returns the command line option given to this program.
//
// If there are too many (> 1) or not enough (0) command line arguments
// provided an error is printed, along with the usage of the program.
int get_option(int argc, char **argv) {
  char *opt;

  // Confirm that there are the correct number of command line arguments
  if (argc < EXPECTED_OPTS) {
    print_usage(argv[0]);
    exit(EXIT_SUCCESS);
  } else if (argc > EXPECTED_OPTS) {
    fprintf(stderr, "error: expected exactly one command line argument\n");
    print_usage(argv[0]);
    exit(EXIT_FAILURE);
  }

  // Use strcmp to determine whether a valid command line option was provided
  opt = argv[1];
  if (strcmp(opt, "p2a") == 0) {
    return OPT_ITERATIVE;
  } else if (strcmp(opt, "p2b") == 0) {
    return OPT_RECURSIVE;
  } else if (strcmp(opt, "p2c") == 0) {
    return OPT_SPLIT;
  } else if (strcmp(opt, "p3a") == 0) {
    return OPT_PARKRANGER;
  }

  fprintf(stderr, "error: unexpected command line argument \"%s\"\n", opt);
  print_usage(argv[0]);
  exit(EXIT_FAILURE);
}

// Read integers from stdin, one per line, into a Deque and then return this
// Deque. Integers are inserted at the bottom of the Deque so tha the first
// integer read is the top of the Deque and the final element is the bottom of
// the Deque.
Deque *read_deque() {
  int x;
  Deque *deque = new_deque();

  while (scanf("%d", &x) == 1) {
    deque_insert(deque, (Data) x);
  }

  return deque;
}

// Test a Deque reverse function by reading integers from stdin into a Deque,
// reversing the Deque using the specified function and printing the contents.
// The Deque is freed before this function returns.
void test_reverse(void (*reverse)(Deque *)) {
  Deque *deque = read_deque();
  printf("read %d elements into the deque\n", deque_size(deque));

  printf("original deque: ");
  print_deque(deque);

  reverse(deque);

  printf("reversed deque: ");
  print_deque(deque);

  free_deque(deque);
  printf("successfully freed the deque\n");
}

// Test the split_deque function by reading the critical value k from stdin
// followed by some number of integers (possibly none). These integers are
// inserted at the bottom of the deque, and then split_deque is called. The
// Deque is then printed and freed.
void test_split() {
  // The critical value k
  int k;
  Deque *deque;

  // If we can't read the critical value then the input is invalid.
  if (scanf("%d\n", &k) == 0) {
    exit_with_error("couldn't read critical value");
  }
  printf("read critical value k = %d\n", k);

  deque = read_deque();
  printf("read %d elements into the deque\n", deque_size(deque));

  printf("original deque: ");
  print_deque(deque);

  split_deque(deque, k);

  printf("split deque: ");
  print_deque(deque);

  free_deque(deque);
  printf("successfully freed the deque\n");
}

// Test the is_single_run_possible() function from the parkranger module.
// This function doesn't read anything from stdin, as this is handled by the
// function we are testing. This function will print one of the two options:
//   the trees on the ski slope CAN be trimmed in one run
// or,
//   the trees on the ski slope CANNOT be trimmed in one run
void test_parkranger() {
  bool possible = is_single_run_possible();
  if (possible) {
    printf("the trees on the ski slope CAN be trimmed in one run\n");
  } else {
    printf("the trees on the ski slope CANNOT be trimmed in one run\n");
  }
}
