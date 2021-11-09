/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Main DNS Server File
 * Handles DNS requests
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <pthread.h>
#include "server.h"
#include "dns.h"
#include "helper.h"
#include "cache.h"

#define SERVER_PORT 8053
#define VERBOSE 0
#define MAX_SERVER_QUEUE 100
#define CACHE
#define NONBLOCKING

pthread_mutex_t lock;

typedef struct request_arguemnts
{
    int sockfd;
    char *external_host_name;
    int external_host_port;
    Cache *cache;
} RequestArgs;

void *handle_request(void *ra);
void send_error_response(int socket, DNS *message);

int main(int argc, char *argv[])
{
    // initialise server socket, response cache, and mutex lock
    int sockfd, newsockfd;
    sockfd = create_server_socket(SERVER_PORT);
    Cache cache[CACHE_SIZE] = {0};
    if (pthread_mutex_init(&lock, NULL) != 0)
    {
        fprintf(stderr, "mutex init failed\n");
        exit(EXIT_FAILURE);
    }

    // initialise external host name and port from command line arguments
    if (argc != 3)
    {
        fprintf(stderr, "missing command line args <hostname> and <port>\n");
        exit(EXIT_FAILURE);
    }
    char *external_host_name = argv[1];
    int external_host_port = atoi(argv[2]);

    /* Listen on socket, define max. number of queued requests */
    check(listen(sockfd, MAX_SERVER_QUEUE), "listen failed");
    while (1)
    {
        // accept, handle, and close an incoming request
        newsockfd = check(accept(sockfd, NULL, NULL),
                          "accept connection failed");

        // create new request arguments object with newsockfd
        RequestArgs request_arguemnts = {newsockfd, external_host_name,
                                         external_host_port, cache};

        // handle request on new thread
        pthread_t tid;
        pthread_create(&tid, NULL, handle_request, &request_arguemnts);
    }

    // do any needed cleanup
    pthread_exit(NULL);
    pthread_mutex_destroy(&lock);
    close(sockfd);
    return 0;
}

void *handle_request(void *ra)
{
    // convert void pointer into request arguments object
    RequestArgs request_arguemnts = *(RequestArgs *)ra;

    // read in query (and optionally print)
    DNS *message = parse_dns(request_arguemnts.sockfd);
    if (VERBOSE)
        print_dns(message);

    // if requesting non-AAAA address, send response with rcode 4 and exit
    if (log_activity(message, 0) == -1)
    {
        send_error_response(request_arguemnts.sockfd, message);
        free_dns(message);
        close(request_arguemnts.sockfd);
        return NULL;
    }

    // if requested URL is in cache, send cached response
    pthread_mutex_lock(&lock);
    int cache_index = search_cache(request_arguemnts.cache,
                                   message->question->qname);
    pthread_mutex_unlock(&lock);
    if (cache_index != -1)
    {
        // get cache (and optionally print, but print may have outdated TTL)
        Cache cached_response = request_arguemnts.cache[cache_index];
        if (VERBOSE)
            print_dns(cached_response.data);

        // send cached message if not expired
        if (difftime(cached_response.expiration, time(NULL)) >= 0)
        {
            // update the cache entry with new ID and TTL
            pthread_mutex_lock(&lock);
            update_cache_entry(cached_response, message);
            pthread_mutex_unlock(&lock);

            // log information about cache
            log_activity(cached_response.data, cached_response.expiration);

            // send cached message as response
            write(request_arguemnts.sockfd,
                  cached_response.data->original_buffer,
                  cached_response.data->message_length);

            free_dns(message);
            close(request_arguemnts.sockfd);
            return NULL;
        }
    }

    // get address from external server (and optionally print)
    DNS *response = send_query(request_arguemnts.external_host_port,
                               request_arguemnts.external_host_name,
                               message->original_buffer,
                               message->message_length);
    if (VERBOSE)
        print_dns(response);

    // add response to cache if answer is not empty
    pthread_mutex_lock(&lock);
    if (response->answer != NULL)
        add_to_cache(request_arguemnts.cache, response);
    pthread_mutex_unlock(&lock);

    // log information about response
    log_activity(response, 0);

    // send response back to client
    write(request_arguemnts.sockfd,
          response->original_buffer,
          response->message_length);

    // free query, and response if it was not added to the cache
    if (response->answer == NULL)
        free_dns(response);
    free_dns(message);
    close(request_arguemnts.sockfd);
    return NULL;
}

void send_error_response(int socket, DNS *message)
{
    // create new response header struct with rcode4
    Header error_header = {message->header->ID, 1, 0, 0, 0,
                           message->header->RD, 1, 0, 4, 0, 0, 0, 0};

    // convert header struct into byte array for sending
    char response[HEADER_SIZE + LENGTH_HEADER_SIZE];
    response[0] = 0;
    response[1] = HEADER_SIZE;
    char *temp = header_to_bytes(&error_header);
    memcpy(response + LENGTH_HEADER_SIZE, temp, HEADER_SIZE);

    // send response back to client
    write(socket, response, HEADER_SIZE + LENGTH_HEADER_SIZE);
    free(temp);
}
