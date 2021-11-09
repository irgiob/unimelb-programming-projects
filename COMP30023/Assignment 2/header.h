/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Header
 * structs and functions related to extracting and manipulating
 * the header of a DNS message packet
 */

#ifndef HEADER_H
#define HEADER_H

#define HEADER_SIZE 12
#define LENGTH_HEADER_SIZE 2

// sturct for a Header
typedef struct header
{
    short unsigned int ID;
    unsigned char QR : 1;
    unsigned char Opcode : 4;
    unsigned char AA : 1;
    unsigned char TC : 1;
    unsigned char RD : 1;
    unsigned char RA : 1;
    unsigned char Z : 3;
    unsigned char RCODE : 4;
    short unsigned int QDCOUNT;
    short unsigned int ANCOUNT;
    short unsigned int NSCOUNT;
    short unsigned int ARCOUNT;
} Header;

// read in header portion of DNS message from message buffer
Header *parse_header(char *buffer, int *incrementer);

// converts header struct back into an array of bytes
char *header_to_bytes(Header *header);

// print the header in a styled format
void print_header(Header *header);

#endif
