/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Server File
 * functions related to sockets and the server
 * 
 * Note: The code in this module is based on material provided by the 
 * staff of the Computer Systems Subject at the University of Melbourne
 */

#include "dns.h"

#ifndef SERVER_H
#define SERVER_H

// Create and return a socket bound to the given port
int create_server_socket(const int port);

// Create and return a socket bound to the given port and server
int create_client_socket(const int port, const char *server_name,
                         struct sockaddr_in *serv_addr);

// forward query to external server and return parsed response from said server
DNS *send_query(int port, char *server, char *message, int mlength);

// checks a function for an error
int check(int out, const char *error_message);

#endif
