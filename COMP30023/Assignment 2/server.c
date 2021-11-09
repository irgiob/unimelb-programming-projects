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

#include <fcntl.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include "server.h"

// Create and return a socket bound to the given port
int create_server_socket(const int port)
{
    int sockfd;
    struct sockaddr_in serv_addr;

    // Create socket
    sockfd = check(socket(PF_INET, SOCK_STREAM, 0), "create socket failed");

    // Create listen address for given port number (in network byte order)
    // for all IP addresses of this machine
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;
    serv_addr.sin_port = htons(port);

    // Reuse port if possible
    int re = 1;
    check(setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &re, sizeof(int)),
          "Could not reopen socket");

    // Bind address to socket
    check(bind(sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)),
          "bind address to socket failed");

    return sockfd;
}

// Create and return a socket bound to the given port and server
int create_client_socket(const int port, const char *server_name,
                         struct sockaddr_in *serv_addr)
{
    int sockfd;
    struct hostent *server;

    server = gethostbyname(server_name);
    if (!server)
    {
        fprintf(stderr, "ERROR, no such host\n");
        exit(EXIT_FAILURE);
    }
    bzero((char *)serv_addr, sizeof(serv_addr));
    serv_addr->sin_family = AF_INET;
    bcopy(server->h_addr_list[0], (char *)&serv_addr->sin_addr.s_addr,
          server->h_length);
    serv_addr->sin_port = htons(port);

    // Create socket
    sockfd = check(socket(PF_INET, SOCK_STREAM, 0), "create socket failed");

    return sockfd;
}

// forward query to external server and return parsed response from said server
DNS *send_query(int port, char *server, char *message, int mlength)
{
    // setup connection to external DNS server
    struct sockaddr_in serv_addr;
    int sockfd = create_client_socket(port, server, &serv_addr), n;

    // connect to said external server
    check(connect(sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)),
          "connection failed");

    // send DNS query
    n = check(write(sockfd, message, mlength),
              "receive response from external server failed");

    // parse the response
    DNS *response = parse_dns(sockfd);

    // close connection and return response
    close(sockfd);
    return response;
}

// checks a function for an error
int check(int out, const char *error_message)
{
    if (out < 0)
    {
        perror(error_message);
        exit(EXIT_FAILURE);
    }
    return out;
}
