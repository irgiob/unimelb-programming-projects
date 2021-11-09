/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Question File
 * miscellaneous functions used by multiple packages
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "helper.h"
#include "question.h"

// extract question portion of DNS message from message buffer
Question *parse_question(char *buffer, int *incrementer)
{
    // initialize question
    Question *question = (Question *)malloc(sizeof(Question));

    // get qname length
    int qname_length = 0;
    while (buffer[*incrementer] != 0)
    {
        qname_length += buffer[*incrementer] + 1;
        *incrementer += buffer[*incrementer] + 1;
    }

    // get qname
    *incrementer -= qname_length;
    int track = 0;
    char *qname = malloc(qname_length);
    while (1)
    {
        int section_length = buffer[*incrementer];
        for (int j = *incrementer + 1; j <= *incrementer + section_length; j++)
            qname[track++] = buffer[j];
        *incrementer += buffer[*incrementer] + 1;
        if (buffer[*incrementer] == 0)
            break;
        qname[track++] = '.';
    }
    qname[qname_length - 1] = '\0';
    question->qname = qname;
    *incrementer += 1;

    //get qtype and qclass
    question->qtype = extract_two_byte(buffer, incrementer);
    question->qclass = extract_two_byte(buffer, incrementer);

    // return question
    return question;
}

// print question in a styled format
void print_question(Question *question)
{
    int leftpad, rightpad, width = 47;
    leftpad = rightpad = (47 - strlen(question->qname)) / 2;
    if ((width % 2 + strlen(question->qname) % 2) % 2 == 1)
        leftpad += 1;
    printf("+--+--+--+--+--+--+-QUESTION--+--+--+--+--+--+--+\n");
    printf("|%*s%s%*s|\n", leftpad, "", question->qname, rightpad, "");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(question->qtype, width, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
    print_component(question->qclass, width, "|", "|\n");
    printf("+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+--+\n");
}
