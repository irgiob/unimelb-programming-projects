/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Resource Record
 * structs and functions related to extracting and manipulating
 * the answer (Resource Record) of a DNS message packet
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <arpa/inet.h>
#include "resource_record.h"
#include "helper.h"

// extract answer portion of DNS message from message buffer
ResourceRecord *parse_answer(char *buffer, int *incrementer)
{
    //get name and type of answer
    unsigned short int name = extract_two_byte(buffer, incrementer);
    unsigned short int type = extract_two_byte(buffer, incrementer);

    // return NULL if response is not a IPv6 address
    if (type != AAAA)
        return NULL;

    // initialize answer and assign values for name and type
    ResourceRecord *answer = (ResourceRecord *)malloc(sizeof(ResourceRecord));
    answer->name = name;
    answer->type = type;

    // get class
    answer->class = extract_two_byte(buffer, incrementer);

    // get TTL (time-to-live) of response
    int BUFFER_SIZE = 4;
    char lbuffer[BUFFER_SIZE];
    memcpy(&lbuffer, &buffer[*incrementer], BUFFER_SIZE);
    long unsigned int *data = (void *)lbuffer;
    *data = htonl(*data);
    *incrementer += BUFFER_SIZE;
    answer->TTL = *data;

    // get rdlength (length of the following rddata)
    answer->rdlength = extract_two_byte(buffer, incrementer);

    // get IP address of resource
    char *ipbuffer_bytes = malloc(answer->rdlength);
    memcpy(ipbuffer_bytes, &buffer[*incrementer], answer->rdlength);
    char ipbuffer_string[INET6_ADDRSTRLEN];
    inet_ntop(AF_INET6, ipbuffer_bytes, ipbuffer_string, INET6_ADDRSTRLEN);
    strcpy(answer->rddata, ipbuffer_string);
    *incrementer += answer->rdlength;

    // free buffer and return answer
    free(ipbuffer_bytes);
    return answer;
}

// print answer in a styled format
void print_answer(ResourceRecord *answer)
{
    int leftpad, rightpad, width = 47;
    leftpad = rightpad = (47 - strlen(answer->rddata)) / 2;
    if ((width % 2 + strlen(answer->rddata) % 2) % 2 == 1)
        leftpad += 1;
    printf("+--+--+--+--+--+--+--ANSWER+--+--+--+--+--+--+--+\n");
    print_component(answer->name, width, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(answer->type, width, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(answer->class, width, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(answer->TTL, width, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(answer->rdlength, width, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    printf("|%*s%s%*s|\n", leftpad, "", answer->rddata, rightpad, "");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
}
