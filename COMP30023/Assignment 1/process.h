/* 
 * COMP30023 Computer Systems Project 1
 * Irgio Basrewan - 1086150
 * 
 * Process struct and methods
 * holds data about a specific process or subprocess
 * thats manipulated by the processor
 */

#ifndef PROCESS_H
#define PROCESS_H

// struct definition
typedef struct process Process;
struct process
{
    // main process attributes
    int time_started, process_id, duration, time_left, parallelisable;

    // subprocess attributes
    int sub_id, n_children;
    Process *parent;
};

// create new process
Process *new_process(int time_started, int process_id, int sub_id,
                     int duration, int time_left, int p);

// convert list of processes in text file to array of Process structures
Process **get_processes(char *filename, int *n_processes);

// print list of processes to standard output
void print_processes(Process **processes, int n_lines);

// compares two processes to check which should have priority execution
int process_comparator(const void *v1, const void *v2);

// get the number of processes currently in a cpu queue
int total_queued(Process **processes, int n_processes, int clock);

// checks how many processes haven't been makrked as finish
int unfinished_process(Process **processes, int n_processes);

// frees array of processes
void free_process_array(Process **processes, int n_processes);

#endif