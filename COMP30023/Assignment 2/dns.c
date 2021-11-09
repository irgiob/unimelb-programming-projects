/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * DNS
 * structs and functions related to extracting and manipulating
 * the DNS message packet as a whole
 */

#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include "dns.h"

DNS *parse_dns(int fd)
{
    // initialise message
    DNS *message = (DNS *)malloc(sizeof(DNS));
    int incrementer = 0, buffer_size = 2, n;

    // read DNS message length
    char lbuffer[buffer_size];
    read(fd, &lbuffer, buffer_size);
    short unsigned int *mlength = (void *)lbuffer;
    *mlength = htons(*mlength);
    message->message_length = *mlength + buffer_size;

    // read rest of DNS message
    char *buffer = malloc(*mlength + buffer_size);
    buffer[0] = lbuffer[1];
    buffer[1] = lbuffer[0];
    incrementer += buffer_size;

    // continue running until entire message is read
    while (incrementer != *mlength + buffer_size)
    {
        n = read(fd, buffer + incrementer, *mlength);
        incrementer += n;
    }
    incrementer -= *mlength;
    message->original_buffer = buffer;

    // get DNS message header
    message->header = parse_header(buffer, &incrementer);

    // get DNS message question
    if (message->header->QDCOUNT == 1)
        message->question = parse_question(buffer, &incrementer);

    // get DNS
    if (message->header->QR == 1 &&
        message->header->ANCOUNT > 0 &&
        message->question->qtype == AAAA)
        message->answer = parse_answer(buffer, &incrementer);
    else
        message->answer = NULL;

    // get any additional records
    char *add_records = malloc(*mlength - incrementer);
    memcpy(add_records, &buffer[incrementer], *mlength - incrementer);
    message->AR = add_records;

    return message;
}

void print_dns(DNS *dns)
{
    print_header(dns->header);
    print_question(dns->question);
    if (dns->answer != NULL)
        print_answer(dns->answer);
}

void free_dns(DNS *message)
{
    free(message->header);
    free(message->question->qname);
    free(message->question);
    if (message->answer != NULL)
        free(message->answer);
    free(message->AR);
    free(message->original_buffer);
    free(message);
}
