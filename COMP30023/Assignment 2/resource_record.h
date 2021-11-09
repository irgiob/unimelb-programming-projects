/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Resource Record
 * structs and functions related to extracting and manipulating
 * the answer (Resource Record) of a DNS message packet
 */

#include <arpa/inet.h>

#ifndef RESOURCE_RECORD_H
#define RESOURCE_RECORD_H

#define AAAA 28

// struct for resourc record
typedef struct resourerecord
{
    short unsigned int name;
    short unsigned int type;
    short unsigned int class;
    long unsigned int TTL;
    short unsigned int rdlength;
    char rddata[INET6_ADDRSTRLEN];
} ResourceRecord;

// extract answer portion of DNS message from message buffer
ResourceRecord *parse_answer(char *buffer, int *incrementer);

// print answer in a styled format
void print_answer(ResourceRecord *answer);

#endif
