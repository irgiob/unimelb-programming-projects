/* * * * * * *
 * Functionality used accross the Assignment 1 program
 *
 * created for COMP20007 Design of Algorithms 2020
 * by Tobias Edwards <tobias.edwards@unimelb.edu.au>
 * editted by Irgio Basrewan <ibasrewan@student.unimelb.edu.au>
 */

#include <stdio.h>
#include <stdlib.h>

#include "util.h"

// Prints an error of the format "error: <error message>" and exits the
// program with a non-zero error code
void exit_with_error(char *error) {
  fprintf(stderr, "error: %s\n", error);
  exit(EXIT_FAILURE);
}