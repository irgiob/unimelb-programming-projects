/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Helper File
 * miscellaneous functions used by multiple packages
 */

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <string.h>
#include <arpa/inet.h>
#include <time.h>
#include "helper.h"

// extracts data the size of 2 bytes (16 bits) for a DNS message buffer
short unsigned int extract_two_byte(char *buffer, int *incrementer)
{
    // initialise variables
    int BUFFER_SIZE = 2;
    char lbuffer[BUFFER_SIZE];

    // copy the portion of the buffer to extract to the new array
    memcpy(&lbuffer, &buffer[*incrementer], BUFFER_SIZE);

    // convert bytes into proper format
    short unsigned int *data = (void *)lbuffer;
    *data = htons(*data);

    // increment the buffer incrementer and return the extracted value
    *incrementer += BUFFER_SIZE;
    return *data;
}

// log information whenever new DNS message is recieved
int log_activity(DNS *message, time_t expiration)
{
    FILE *log = fopen("dns_svr.log", "a");

    // get timestamp
    char timestamp[26];
    time_t current_time = time(NULL);
    strftime(timestamp, 26, "%FT%T%z", localtime(&current_time));

    // if message is cached, log the expiration date of the cache
    if (expiration != 0 && difftime(expiration, time(NULL)) >= 0)
    {
        char exp[26];
        strftime(exp, 26, "%FT%T%z", localtime(&expiration));
        fprintf(log, "%s %s expires at %s\n", timestamp,
                message->question->qname, exp);
        fflush(log);
    }

    // log requested info if request received
    if (message->header->QR == 0)
    {
        fprintf(log, "%s requested %s\n", timestamp, message->question->qname);
        fflush(log);

        // log unimplemented non-AAAA request received
        if (message->question->qtype != AAAA)
        {
            fprintf(log, "%s unimplemented request\n", timestamp);
            fflush(log);

            fclose(log);
            return -1;
        }
    }

    // log response if received
    if (message->header->QR == 1 && message->answer != NULL)
    {
        fprintf(log, "%s %s is at %s\n", timestamp,
                message->question->qname, message->answer->rddata);
        fflush(log);
    }

    fclose(log);
    return 0;
}

// log whenever eviction of a cache entry is done
int log_eviction(char *old_entry, char *new_entry)
{
    FILE *log = fopen("dns_svr.log", "a");

    // get timestamp
    char timestamp[26];
    time_t current_time = time(NULL);
    strftime(timestamp, 26, "%FT%T%z", localtime(&current_time));

    // print eviction
    fprintf(log, "%s replacing %s by %s\n", timestamp, old_entry, new_entry);
    fflush(log);

    fclose(log);
    return 0;
}

// prints a component of a DNS message in a styled format
void print_component(int component, int width, char *lead, char *trail)
{
    int n_digits = (component == 0) ? 1 : (floor(log10(component)) + 1);
    int leftpad, rightpad;
    leftpad = rightpad = (width - n_digits) / 2;
    if ((width % 2 + n_digits % 2) % 2 == 1)
        leftpad += 1;
    printf("%s%*s%d%*s%s", lead, leftpad, "", component, rightpad, "", trail);
}
