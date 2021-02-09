/* * * * * * *
 * Main program for Assignment 2
 *
 * created for COMP20007 Design of Algorithms 2020
 * by Tobias Edwards <tobias.edwards@unimelb.edu.au>
 */

// DO NOT CHANGE THIS FILE

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "hash.h"
#include "text_analysis.h"

// We expect the command to have the form: PROG OPT
#define EXPECTED_OPTS 2

// Command line argument options
#define OPT_P1A 1
#define OPT_P1B 2
#define OPT_P2A 3
#define OPT_P2B 4
#define OPT_P2C 5

// Prints out the usage instructions and valid command line arguments for this
// program.
void print_usage(char *prog_name);

// Returns the command line option given to this program.
//
// If there are too many (> 1) or not enough (0) command line arguments
// provided an error is printed, along with the usage of the program.
int get_option(int argc, char **argv);

int main(int argc, char **argv) {
  int opt = get_option(argc, argv);

  if (opt == OPT_P1A) {
    problem_1_a();
  } else if (opt == OPT_P1B) {
    problem_1_b();
  } else if (opt == OPT_P2A) {
    problem_2_a();
  } else if (opt == OPT_P2B) {
    problem_2_b();
  } else if (opt == OPT_P2C) {
    problem_2_c();
  }

  return 0;
}

// Prints out the usage instructions and valid command line arguments for this
// program.
void print_usage(char *prog_name) {
  printf("usage: %s [option] < <input_file>\n", prog_name);
  printf("\n");
  printf("options:\n");
  printf("\tp1a \tTest the problem_1_a() function\n");
  printf("\tp1b \tTest the problem_1_b() function\n");
  printf("\tp2a \tTest the problem_2_a() function\n");
  printf("\tp2b \tTest the problem_2_b() function\n");
  printf("\tp2c \tTest the problem_2_c() function\n");
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
  if (strcmp(opt, "p1a") == 0) {
    return OPT_P1A;
  } else if (strcmp(opt, "p1b") == 0) {
    return OPT_P1B;
  } else if (strcmp(opt, "p2a") == 0) {
    return OPT_P2A;
  } else if (strcmp(opt, "p2b") == 0) {
    return OPT_P2B;
  } else if (strcmp(opt, "p2c") == 0) {
    return OPT_P2C;
  }

  fprintf(stderr, "error: unexpected command line argument \"%s\"\n", opt);
  print_usage(argv[0]);
  exit(EXIT_FAILURE);
}
