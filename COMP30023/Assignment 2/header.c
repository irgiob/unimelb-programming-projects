/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Header
 * structs and functions related to extracting and manipulating
 * the header of a DNS message packet
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "header.h"
#include "helper.h"

// read in header portion of DNS message from message buffer
Header *parse_header(char *buffer, int *incrementer)
{
    // initialize variables
    Header *header = (Header *)malloc(sizeof(Header));

    // get all components of the header
    header->ID = extract_two_byte(buffer, incrementer);
    header->QR = (unsigned char)((buffer[*incrementer] >> 7) & 1);
    header->Opcode = (unsigned char)((buffer[*incrementer] >> 3) & 15);
    header->AA = (unsigned char)((buffer[*incrementer] >> 2) & 1);
    header->TC = (unsigned char)((buffer[*incrementer] >> 1) & 1);
    header->RD = (unsigned char)(buffer[(*incrementer)++] & 1);
    header->RA = (unsigned char)((buffer[*incrementer] >> 7) & 1);
    header->Z = (unsigned char)((buffer[*incrementer] >> 4) & 7);
    header->RCODE = (unsigned char)(buffer[(*incrementer)++] & 15);
    header->QDCOUNT = extract_two_byte(buffer, incrementer);
    header->ANCOUNT = extract_two_byte(buffer, incrementer);
    header->NSCOUNT = extract_two_byte(buffer, incrementer);
    header->ARCOUNT = extract_two_byte(buffer, incrementer);

    // return header
    return header;
}

// converts header struct back into an array of bytes
char *header_to_bytes(Header *header)
{
    char *buffer = (char *)malloc(HEADER_SIZE);
    memset(buffer, 0, HEADER_SIZE);
    buffer[0] = (header->ID >> 8) & 0xFF;
    buffer[1] = header->ID & 0xFF;
    buffer[2] |= header->QR << 7;
    buffer[2] |= header->Opcode << 3;
    buffer[2] |= header->AA << 2;
    buffer[2] |= header->TC << 1;
    buffer[2] |= header->RD;
    buffer[3] |= header->RA << 7;
    buffer[3] |= header->Z << 3;
    buffer[3] |= header->RCODE;
    buffer[4] = (header->QDCOUNT >> 8) & 0xFF;
    buffer[5] = header->QDCOUNT & 0xFF;
    buffer[6] = (header->ANCOUNT >> 8) & 0xFF;
    buffer[7] = header->ANCOUNT & 0xFF;
    buffer[8] = (header->NSCOUNT >> 8) & 0xFF;
    buffer[9] = header->NSCOUNT & 0xFF;
    buffer[10] = (header->ARCOUNT >> 8) & 0xFF;
    buffer[11] = header->ARCOUNT & 0xFF;
    return buffer;
}

// print the header in a styled format
void print_header(Header *header)
{
    printf("+--+--+--+--+--+--+--HEADER+--+--+--+--+--+--+--+\n");
    print_component(header->ID, 47, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(header->QR, 2, "|", "");
    print_component(header->Opcode, 11, "|", "");
    print_component(header->AA, 2, "|", "");
    print_component(header->TC, 2, "|", "");
    print_component(header->RD, 2, "|", "");
    print_component(header->RA, 2, "|", "");
    print_component(header->Z, 8, "|", "");
    print_component(header->RCODE, 11, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(header->QDCOUNT, 47, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(header->ANCOUNT, 47, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(header->NSCOUNT, 47, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(header->ARCOUNT, 47, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
}
