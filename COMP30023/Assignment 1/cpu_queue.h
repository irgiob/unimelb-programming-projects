/* 
 * COMP30023 Computer Systems Project 1
 * Irgio Basrewan - 1086150
 * 
 * CPU Queue struct and methods
 * uses a Linked List Priority Queue for scheduling cpu processes
 */

#ifndef CPU_QUEUE_H
#define CPU_QUEUE_H
#include "process.h"

// struct definitions
typedef struct node Node;
struct node
{
    Node *next;
    Process *process;
};

typedef struct cpu_queue CPUqueue;
struct cpu_queue
{
    Node *head;
    int id, last_id, total_time_left, size;
};

// create new scheduling queue for CPU
CPUqueue *new_cpu_queue(int id);

// destroy and free memory of queue
void free_queue(CPUqueue *queue);

// get the process currently running on the CPU
Process *current_process(CPUqueue *queue);

// remove the process at the top of the queue
Process *remove_process(CPUqueue *queue);

// add new process to the CPU scheduling queue
void cpu_insert_process(CPUqueue *queue, Process *process);

// print full CPU queue to standard output
void print_cpu_queue(int id, CPUqueue *queue, int clock);

// function to compare cpu queues id (default order)
int compare_cpu_id(const void *v1, const void *v2);

// function to compare cpu queues by total execution time and id
int compare_exec_time(const void *v1, const void *v2);

#endif