/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * DNS
 * structs and functions related to extracting and manipulating
 * the DNS message packet as a whole
 */

#ifndef DNS_H
#define DNS_H

#include "header.h"
#include "question.h"
#include "resource_record.h"

// struct for a DNS message
typedef struct dns
{
    int message_length;
    Header *header;
    Question *question;
    ResourceRecord *answer;
    char *AR;
    char *original_buffer;
} DNS;

// read in a DNS packet
DNS *parse_dns(int fd);

// print entire DNS packet in styled format
void print_dns(DNS *dns);

// free components of DNS struct and DNS object itself
void free_dns(DNS *message);

#endif
