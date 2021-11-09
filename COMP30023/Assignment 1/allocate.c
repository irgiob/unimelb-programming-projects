/* 
 * COMP30023 Computer Systems Project 1
 * Irgio Basrewan - 1086150
 * 
 * Main Program File (+ helpers)
 */

#include <stdio.h>
#include <stdlib.h>
#include <getopt.h>
#include "multi_processor.h"

/* get arguments function definitions */
void get_arguments(int argc, char *argv[], char **f, int *p, int *c);

/* main function */
int main(int argc, char *argv[])
{
    // initialize command line argument variables
    char *filename = NULL;
    int n_processors = 0, cflag = 0, n_processes = 0;
    get_arguments(argc, argv, &filename, &n_processors, &cflag);

    // get processes from input & run process simulation
    Process **processes = get_processes(filename, &n_processes);
    MultiProcessor *multi_processor = new_multi_processor(n_processors);
    run_processes(multi_processor, processes, n_processes, cflag);

    // free everything and exit
    free_multi_processor(multi_processor);
    free_process_array(processes, n_processes);
    return 0;
}

/* handle input parameters */
void get_arguments(int argc, char *argv[], char **f, int *p, int *c)
{
    int opt;
    while ((opt = getopt(argc, argv, ":f:p:c")) != -1)
    {
        switch (opt)
        {
        case 'f':
            *f = optarg;
            break;
        case 'p':
            *p = atoi(optarg);
            break;
        case 'c':
            *c = 1;
            break;
        case ':':
            printf("-f and -p both need values\n");
            exit(1);
        case '?':
            printf("unknown option: %c\n", optopt);
            exit(1);
        }
    }
    if (*f == NULL || *p == 0)
    {
        printf("-f and -p both are mandatory\n");
        exit(1);
    }
}