/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Question
 * structs and functions related to extracting and manipulating
 * the Question(s) of a DNS message packet
 */

#ifndef QUESTION_H
#define QUESTION_H

// struct for DNS question
typedef struct question
{
    char *qname;
    short unsigned int qtype;
    short unsigned int qclass;
} Question;

// extract question portion of DNS message from message buffer
Question *parse_question(char *buffer, int *incrementer);

// print question in a styled format
void print_question(Question *question);

#endif
