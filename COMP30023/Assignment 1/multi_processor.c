/*
 * COMP30023 Computer Systems Project 1
 * Irgio Basrewan - 1086150
 * 
 * MultiProcessor struct and methods
 * holds all the CPUs together along with tracking and statistics variables
 * performs all the adding, processing, and completing of processes
 */

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "multi_processor.h"
#include "cpu_queue.h"

/* create a new multi-processor object */
MultiProcessor *new_multi_processor(int n_processors)
{
    MultiProcessor *mp = malloc(sizeof(*mp));
    mp->clock = mp->index = 0;
    mp->n_processors = n_processors;
    mp->overhead_avg = mp->overhead_max = mp->turnaround_avg = 0;

    mp->cpu_array = (CPUqueue **)malloc(sizeof(CPUqueue *) * n_processors);
    for (int i = 0; i < n_processors; i++)
        mp->cpu_array[i] = new_cpu_queue(i);

    return mp;
}

/* free a multi-processor */
void free_multi_processor(MultiProcessor *mp)
{
    for (int i = 0; i < mp->n_processors; i++)
        free_queue(mp->cpu_array[i]);
    free(mp->cpu_array);
    free(mp);
}

/* run multi-processor until all processes have been completed */
void run_processes(MultiProcessor *mp, Process **processes, int n_processes, int cflag)
{
    // initialize multiprocessor tracking variables and statistic variables
    CPUqueue **cpu_array = mp->cpu_array;
    int clock = mp->clock, index = mp->index, n_processors = mp->n_processors,
        next_process = processes[index]->time_started, n_finished = 0;
    double turnaround_avg = mp->turnaround_avg,
           overhead_avg = mp->overhead_avg, overhead_max = mp->overhead_max;

    // loop until all processes complete
    while (unfinished_process(processes, n_processes))
    {
        // STEP 1: add new processes at appropriate times
        while (clock == next_process)
        {
            // add process using either default or custom scheduling algorithm
            /*void (*add_new_process)(CPUqueue **, int, Process *);
            add_new_process = (!cflag) ? default_scheduler : custom_scheduler;
            add_new_process(cpu_array, n_processors, processes[index]);*/
            if (!cflag)
                default_scheduler(cpu_array, n_processors, processes[index]);
            else
                custom_scheduler(cpu_array, n_processors, processes, n_processes, index);

            // stop adding new processes once there are none left
            next_process = (++index >= n_processes) ? -1 : processes[index]->time_started;
        }
        // resort back to order by CPU ID
        qsort(cpu_array, n_processors, sizeof(CPUqueue *), compare_cpu_id);

        // STEP 2: if current proccess of a CPU changes, print that change
        for (int i = 0; i < n_processors; i++)
            if (cpu_array[i]->size > 0)
                check_run_change(cpu_array, i, clock);

        // STEP 3: decrement cpu time to represent one unit of cpu processing
        for (int i = 0; i < n_processors; i++)
            decrement_cpu(cpu_array, i, n_processors);

        // STEP 4: if a process is finished, print finish data and update stats
        for (int i = 0; i < n_processes; i++)
            if (processes[i]->time_left == 0 && processes[i]->n_children == 0)
            {
                int turnaround = finish_process(processes, n_processes, clock, i);
                double overhead = (double)turnaround / processes[i]->duration;
                update_statistics(turnaround, overhead, &turnaround_avg,
                                  &overhead_avg, &overhead_max, ++n_finished);
            }

        // STEP 5: increment cpu clock
        clock++;
    }

    // print statistics
    printf("Turnaround time %g\nTime overhead %g %g\nMakespan %d\n",
           ceil(turnaround_avg), round(overhead_max * 100) / 100,
           round(overhead_avg * 100) / 100, clock);
}

/* add a new process to its optimal CPU using default scheduling algorithm */
void default_scheduler(CPUqueue **cpu_array, int n_processors, Process *staged)
{
    // sort processors in order of least total execution time
    qsort(cpu_array, n_processors, sizeof(CPUqueue *), compare_exec_time);

    // for parallelisable processes, create new subprocceses
    if (staged->parallelisable)
    {
        int time_left = staged->time_left;
        int k = (time_left >= n_processors) ? n_processors : time_left;

        if (k != 1)
        {
            int time = (time_left + k - 1) / k + 1;
            staged->time_left = time * k;
            staged->n_children = k;

            for (int i = 0; i < k; i++)
            {
                Process *new = new_process(staged->time_started,
                                           staged->process_id, i,
                                           staged->duration, time, 0);
                new->parent = staged;
                cpu_insert_process(cpu_array[i], new);
            }
        }
        else
            cpu_insert_process(cpu_array[0], staged);
    }
    // otherwise just directly insert the process
    else
        cpu_insert_process(cpu_array[0], staged);
}

/* add a new process to its optimal CPU using custom scheduling algorithm */
void custom_scheduler(CPUqueue **cpu_array, int n_processors, Process **processes,
                      int n_processes, int index)
{
    // sort processors in order of least total execution time
    qsort(cpu_array, n_processors, sizeof(CPUqueue *), compare_exec_time);

    // for parallelisable processes, create new subprocceses
    if (processes[index]->parallelisable)
    {
        // only parallelises if multiple cpus are tied for lowest execution time
        // for most cases, the extra processing time to parallelise doesn't help
        int k = 0;
        for (int i = 0; i < n_processors; i++)
            if (cpu_array[i]->total_time_left - cpu_array[0]->total_time_left == 0)
                k++;
        k = (processes[index]->time_left >= k) ? k : processes[index]->time_left;

        if (k != 1)
        {
            int time = (processes[index]->time_left + k - 1) / k + 1;
            processes[index]->time_left = time * k;
            processes[index]->n_children = k;

            for (int i = 0; i < k; i++)
            {
                Process *new = new_process(processes[index]->time_started,
                                           processes[index]->process_id, i,
                                           processes[index]->duration, time, 0);
                new->parent = processes[index];

                cpu_insert_process(cpu_array[i], new);
            }
        }
        else
            cpu_insert_process(cpu_array[0], processes[index]);
    }
    else
    {
        // prioritizes placing new processes in cpus alread in use
        // aims to fill used cpus up to double the average process duration
        // this is to leave more cpus open for future potentially long processes
        double mul = 2, average_dur = 0;
        int i;

        // calculate the average duration of a process
        for (i = 0; i < n_processes; i++)
            average_dur += processes[i]->duration;
        average_dur = average_dur / n_processes;

        // find most used cpu that can add the process without going over the limit
        for (i = n_processors - 1; i >= 0; i--)
        {
            if ((double)cpu_array[i]->total_time_left + processes[index]->duration <
                average_dur * mul)
            {
                cpu_insert_process(cpu_array[i], processes[index]);
                break;
            }
        }

        // if all cpus are filled above the limit, add to least used cpu
        if (i < 0)
            cpu_insert_process(cpu_array[0], processes[index]);
    }
}

/* check if a CPU has changed the processing it is running */
void check_run_change(CPUqueue **cpu_array, int i, int clock)
{
    // if current process is different from previous, print change
    Process *process = current_process(cpu_array[i]);
    if (process != NULL && cpu_array[i]->last_id != process->process_id)
    {
        cpu_array[i]->last_id = process->process_id;
        printf("%d,RUNNING,pid=%d", clock, process->process_id);
        if (process->sub_id != -1)
            printf(".%d", process->sub_id);
        printf(",remaining_time=%d,cpu=%d\n",
               process->time_left, cpu_array[i]->id);
    }
}

/* simulate one unit of CPU time to represent processing taking place */
void decrement_cpu(CPUqueue **cpu_array, int i, int n_processors)
{
    if (cpu_array[i]->size > 0)
    {
        // decrement total time, process time, and parent process time
        cpu_array[i]->total_time_left--;
        cpu_array[i]->head->process->time_left--;
        if (cpu_array[i]->head->process->parent != NULL)
            cpu_array[i]->head->process->parent->time_left--;

        // if decrementing finishes a process, remove it from the queue
        if (cpu_array[i]->head->process->time_left <= 0)
        {
            Process *removed_process = remove_process(cpu_array[i]);
            if (removed_process->parent != NULL)
                removed_process->parent->n_children--;

            // free if subprocess
            if (removed_process->sub_id != -1)
                free(removed_process);
        }
    }
}

/* mark process as finished, print finish state, and return turnaround */
int finish_process(Process **processes, int n_processes, int clock, int i)
{
    int proc_left = total_queued(processes, n_processes, clock);
    printf("%d,FINISHED,pid=%d,proc_remaining=%d\n",
           clock + 1, processes[i]->process_id, proc_left);

    // marks a particular process as complete
    processes[i]->time_left = -1;

    // calculate and update statistics
    int turnaround = clock - processes[i]->time_started + 1;
    return turnaround;
}

/* update overall average turnaround, average overhead, and max overhead */
void update_statistics(int t, double o, double *t_a, double *o_a,
                       double *o_m, int n_f)
{
    *t_a = (*t_a * (n_f - 1) + t) / n_f;
    *o_a = (*o_a * (n_f - 1) + o) / n_f;
    if (o > *o_m)
        *o_m = o;
}