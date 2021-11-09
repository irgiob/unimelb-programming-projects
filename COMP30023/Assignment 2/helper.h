/*
 * COMP30023 Computer Systems Project 2
 * Irgio Basrewan - 1086150 
 * 
 * Helper File
 * miscellaneous functions used by multiple packages
 */

#include "dns.h"
#include "cache.h"

#ifndef HELPER_H
#define HELPER_H

// extracts data the size of 2 bytes (16 bits) for a DNS message buffer
short unsigned int extract_two_byte(char *buffer, int *incrementer);

// log information whenever new DNS message is recieved
int log_activity(DNS *message, time_t expiration);

// log whenever eviction of a cache entry is done
int log_eviction(char *old_entry, char *new_entry);

// prints a component of a DNS message in a styled format
void print_component(int component, int width, char *lead, char *trail);

#endif
