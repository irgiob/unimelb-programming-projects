/* 
 * COMP30023 Computer Systems Project 1
 * Irgio Basrewan - 1086150
 * 
 * CPU Queue struct and methods
 * uses a Linked List Priority Queue for scheduling cpu processes
 */

#include <stdlib.h>
#include <stdio.h>
#include "cpu_queue.h"
#include "process.h"

/* create new node */
Node *new_node()
{
    Node *node = malloc(sizeof(*node));
    return node;
}

/* create new scheduling queue for CPU */
CPUqueue *new_cpu_queue(int id)
{
    CPUqueue *queue = malloc(sizeof(*queue));

    queue->head = NULL;
    queue->id = id;
    queue->last_id = -1;
    queue->size = 0;
    queue->total_time_left = 0;

    return queue;
}

/* destroy and free memory of queue */
void free_queue(CPUqueue *queue)
{
    Node *node = queue->head;
    Node *next;
    while (node)
    {
        next = node->next;
        free(node);
        node = next;
    }
    free(queue);
}

/* get the process currently running on the CPU */
Process *current_process(CPUqueue *queue)
{
    if (queue->size > 0)
        return queue->head->process;
    else
        return NULL;
}

/* remove the process at the top of the queue */
Process *remove_process(CPUqueue *queue)
{
    if (queue->size > 0)
    {
        Node *temp = queue->head;
        queue->head = queue->head->next;
        queue->size--;
        Process *process = temp->process;
        free(temp);
        return process;
    }
    else
        return NULL;
}

/* add new process to the CPU scheduling queue */
void cpu_insert_process(CPUqueue *queue, Process *process)
{
    Node *node = new_node();
    node->process = process;
    queue->size++;
    queue->total_time_left += process->time_left;

    node->next = queue->head;

    if (queue->head == NULL)
    {
        queue->head = node;
    }
    else if (queue->head->process->time_left > node->process->time_left)
    {
        node->next = queue->head;
        queue->head = node;
    }
    else
    {
        Node *head = queue->head;
        while (head->next != NULL &&
               head->next->process->time_left <= node->process->time_left)
        {
            head = head->next;
        }
        node->next = head->next;
        head->next = node;
    }
}

/* print full CPU queue to standard output */
void print_cpu_queue(int id, CPUqueue *queue, int clock)
{
    printf("CPU %d QUEUE AT TIME %d\n", id, clock);
    Node *head = queue->head;
    if (head != NULL)
    {

        while (head != NULL)
        {
            printf("ID: %d | TIME LEFT: %d\n",
                   head->process->process_id,
                   head->process->time_left);
            head = head->next;
        }
    }
    printf("TOTAL TIME LEFT: %d\n\n", queue->total_time_left);
}

/* function to compare cpu by total execution time and id */
int compare_exec_time(const void *v1, const void *v2)
{
    const CPUqueue *p1 = *(CPUqueue **)v1, *p2 = *(CPUqueue **)v2;

    if (p1->total_time_left != p2->total_time_left)
        return p1->total_time_left - p2->total_time_left;
    else
        return p1->id - p2->id;
}

/* function to compare cpu id (default order) */
int compare_cpu_id(const void *v1, const void *v2)
{
    const CPUqueue *p1 = *(CPUqueue **)v1, *p2 = *(CPUqueue **)v2;
    return p1->id - p2->id;
}