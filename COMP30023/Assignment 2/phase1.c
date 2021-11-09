/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * PHASE 1 File
 * processes raw DNS messages
 */

#include "helper.h"
#include "dns.h"

int main(int argc, char *argv[])
{
    // parse DNS message from standard input
    DNS *message = parse_dns(0);

    // log any required information then free the message
    log_activity(message, 0);

    // free message
    free_dns(message);
    return 0;
}
