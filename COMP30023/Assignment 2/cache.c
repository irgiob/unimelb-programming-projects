/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Cache File
 * struct and functions related to storing, updating
 * and evicting a cache for DNS messages
 */

#include <string.h>
#include <time.h>
#include "cache.h"
#include "helper.h"

// searchs cache for entry with hostname, returns -1 if not found
int search_cache(Cache cache[], char *hostname)
{
    for (int i = 0; i < CACHE_SIZE; i++)
    {
        // if cache entry hostname matches, return index of cache entry
        if (cache[i].hostname != 0 &&
            strcmp(cache[i].hostname, hostname) == 0)
            return i;
    }
    return -1;
}

// adds a DNS response to cache
void add_to_cache(Cache cache[], DNS *message)
{
    // check if message/hostname already exists in cache
    for (int i = 0; i < CACHE_SIZE; i++)
    {
        // if already exits, must have expired, so replace
        if (cache[i].hostname != 0 &&
            strcmp(cache[i].hostname, message->question->qname) == 0)
        {
            replace_cache(cache, i, message, 1);
            return;
        }
    }

    // check if there is expired cache entry to be replaced
    for (int i = 0; i < CACHE_SIZE; i++)
    {
        // if expired, replace with new message
        if (cache[i].hostname != 0 &&
            difftime(cache[i].expiration, time(NULL)) < 0)
        {
            replace_cache(cache, i, message, 1);
            return;
        }
    }

    // if there is an empty spot, use that
    for (int i = 0; i < CACHE_SIZE; i++)
    {
        // if expired, replace with new message
        if (cache[i].hostname == 0)
        {
            replace_cache(cache, i, message, 0);
            return;
        }
    }

    // if no expired cache, check for oldest entry and replace that instead
    int oldest_index = 0;
    time_t oldest_date = cache[oldest_index].time_added;
    for (int i = 0; i < CACHE_SIZE; i++)
    {
        // if entry is older than current oldest, set that to new oldest
        if (cache[i].hostname != 0 &&
            difftime(cache[i].time_added, oldest_date) < 0)
        {
            oldest_date = cache[i].time_added;
            oldest_index = i;
        }
    }
    replace_cache(cache, oldest_index, message, 1);
    return;
}

// replace the cache entry at a specific index
void replace_cache(Cache cache[], int index, DNS *message, int is_eviction)
{
    // if index already has cached entry, log eviction and free previous cache
    if (is_eviction)
    {
        log_eviction(cache[index].hostname, message->question->qname);
        free_dns(cache[index].data);
    }

    // replace all cache struct fields with new DNS message
    cache[index].hostname = message->question->qname;
    cache[index].time_added = time(NULL);
    cache[index].expiration = time(NULL) + message->answer->TTL;
    cache[index].data = message;
}

//updates the ID and TTL of a cache entry
void update_cache_entry(Cache cache, DNS *message)
{
    // update ID
    cache.data->header->ID = message->header->ID;
    cache.data->original_buffer[2] =
        (cache.data->header->ID >> 8) & 0xFF;
    cache.data->original_buffer[3] =
        cache.data->header->ID & 0xFF;

    // update TTL
    unsigned long new_ttl = (unsigned long)
        difftime(cache.expiration, time(NULL));
    cache.data->answer->TTL = new_ttl;
    int ttl_i = HEADER_SIZE + LENGTH_HEADER_SIZE;
    while (cache.data->original_buffer[ttl_i] != 0)
        ttl_i += cache.data->original_buffer[ttl_i] + 1;
    ttl_i += 11;
    for (int i = 0; i < 4; i++)
        cache.data->original_buffer[ttl_i + i] =
            (new_ttl >> (24 - 8 * i)) & 0xFF;
}
