/* 
 * COMP30023 Computer Systems Project 1
 * Irgio Basrewan - 1086150
 * 
 * Process struct and methods
 * holds data about a specific process or subprocess
 * thats manipulated by the processor
 */

#include <stdlib.h>
#include <stdio.h>
#include "process.h"

/* create new process */
Process *new_process(int time_started, int process_id, int sub_id,
                     int duration, int time_left, int p)
{
    Process *process = malloc(sizeof(*process));

    process->time_started = time_started;
    process->process_id = process_id;
    process->sub_id = sub_id;
    process->duration = duration;
    process->time_left = time_left;
    process->parallelisable = p;
    process->parent = NULL;
    process->n_children = 0;

    return process;
}

/* convert list of processes in text file to array of Process structures */
Process **get_processes(char *filename, int *n_processes)
{
    // initialize variables
    int time_started, process_id, time_left;
    char parallelisable;
    int count = 0, r;
    FILE *file = fopen(filename, "r");

    // allocate array based on how many processes in text file
    Process **processes = (Process **)malloc(sizeof(Process *) * count);
    if (processes == NULL)
    {
        fclose(file);
        exit(1);
    }

    if (file)
    {
        // for each line in text file, create new Process and add to array
        while ((r = fscanf(file, "%d %d %d %c\n",
                           &time_started,
                           &process_id,
                           &time_left,
                           &parallelisable)) != EOF)
        {
            processes = (Process **)realloc(processes, sizeof(Process *) * ++count);

            int p = (parallelisable == 'p') ? 1 : 0;
            processes[count - 1] = new_process(time_started, process_id, -1,
                                               time_left, time_left, p);
        }
        fclose(file);

        // sort and return list of processes and number of processes
        *n_processes = count;
        qsort(processes, count, sizeof(Process *), process_comparator);
        return processes;
    }
    else
    {
        printf("INVALID FILENAME\n");
        exit(1);
    }
}

/* function to compare processes by time and id */
int process_comparator(const void *v1, const void *v2)
{
    const Process *p1 = *(Process **)v1, *p2 = *(Process **)v2;

    if (p1->time_started != p2->time_started)
        return p1->time_started - p2->time_started;
    else if (p1->duration != p2->duration)
        return p1->duration - p2->duration;
    else
        return p1->process_id - p2->process_id;
}

/* print list of processes to standard output */
void print_processes(Process **processes, int n_lines)
{
    for (int i = 0; i < n_lines; i++)
    {
        printf("Time Started: %-8d"
               "Process ID: %-8d"
               "Duration %-8d"
               "Time Left %-8d"
               "Parallelisable: %-8d\n",
               processes[i]->time_started,
               processes[i]->process_id,
               processes[i]->duration,
               processes[i]->time_left,
               processes[i]->parallelisable);
    }
}

/* get the number of processes currently in a cpu queue */
int total_queued(Process **processes, int n_processes, int clock)
{
    int total = 0;
    for (int i = 0; i < n_processes; i++)
    {
        if (processes[i]->time_started <= clock &&
            processes[i]->time_left > 0)
            total++;
    }
    return total;
}

/* checks how many processes haven't been makrked as finish */
int unfinished_process(Process **processes, int n_processes)
{
    int count = 0;
    for (int i = 0; i < n_processes; i++)
    {
        if (processes[i]->time_left > 0)
            count++;
    }
    return count;
}

/* frees array of processes */
void free_process_array(Process **processes, int n_processes)
{
    for (int i = 0; i < n_processes; i++)
        free(processes[i]);
    free(processes);
}