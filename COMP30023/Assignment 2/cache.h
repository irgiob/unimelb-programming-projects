/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Cache File
 * struct and functions related to storing, updating
 * and evicting a cache for DNS messages
 */

#include "dns.h"
#include <time.h>

#ifndef CACHE_H
#define CACHE_H

#define CACHE_SIZE 5

// struct for a single cached message
typedef struct cache
{
    char *hostname;
    time_t time_added, expiration;
    DNS *data;
} Cache;

// returns index of cache for entry with hostname, or -1 if not found
int search_cache(Cache cache[], char *hostname);

// adds a DNS response to cache
void add_to_cache(Cache cache[], DNS *message);

// replace the cache entry at a specific index
void replace_cache(Cache cache[], int index, DNS *message, int is_eviction);

//updates the ID and TTL of a cache entry
void update_cache_entry(Cache cache, DNS *message);

#endif
