/*
 * COMP30023 Computer Systems Project 1
 * Irgio Basrewan - 1086150
 * 
 * MultiProcessor struct and methods
 * holds all the CPUs together along with tracking and statistics variables
 * performs all the adding, processing, and completing of processes
 */

#ifndef MULTI_PROCESSOR_H
#define MULTI_PROCESSOR_H
#include "cpu_queue.h"

// struct definition
typedef struct multi_processor MultiProcessor;
struct multi_processor
{
    CPUqueue **cpu_array;
    int clock, index, n_processors;
    double turnaround_avg, overhead_avg, overhead_max;
};

// create a new multi-processor object
MultiProcessor *new_multi_processor(int n_processors);

// free a multi-processor
void free_multi_processor(MultiProcessor *mp);

// run multi-processor until all processes have been completed
void run_processes(MultiProcessor *mp, Process **processes, int n_processes, int cflag);

// add a new process to its optimal CPU
void default_scheduler(CPUqueue **cpu_array, int n_processors, Process *staged);

// add a new process to its optimal CPU using custom scheduling algorithm
void custom_scheduler(CPUqueue **cpu_array, int n_processors, Process **processes,
                      int n_processes, int index);

// check if a CPU has changed the processing it is running
void check_run_change(CPUqueue **cpu_array, int i, int clock);

// simulate one unit of CPU time to represent processing taking place
void decrement_cpu(CPUqueue **cpu_array, int i, int n_processors);

// mark process as finished, print finish state, and return turnaround
int finish_process(Process **processes, int n_processes, int clock, int i);

// update overall average turnaround, average overhead, and max overhead
void update_statistics(int t, double o, double *t_a, double *o_a, double *o_m, int n_f);

#endif