/* * * * * * *
 * Park Ranger module for Assignment 1
 *
 * created for COMP20007 Design of Algorithms 2020
 * template by Tobias Edwards <tobias.edwards@unimelb.edu.au>
 * implementation by Irgio Basrewan <ibasrewan@student.unimelb.edu.au>
 */

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "parkranger.h"
#include "util.h"
#include "deque.h"

// This function must read in a ski slope map and determine whether or not
// it is possible for the park ranger to trim all of the trees on the ski slope
// in a single run starting from the top of the mountain.
//
// The ski slope map is provided via stdin in the following format:
//
//   n m
//   from to
//   from to
//   ...
//   from to
//
// Here n denotes the number of trees that need trimming, which are labelled
// {1, ..., n}. The integer m denotes the number "reachable pairs" of trees.
// There are exactly m lines which follow, each containing a (from, to) pair
// which indicates that tree `to` is directly reachable from tree `from`.
// `from` and `to` are integers in the range {0, ..., n}, where {1, ..., n}
// denote the trees and 0 denotes the top of the mountain.
//
// For example the following input represents a ski slope with 3 trees and
// 4 reachable pairs of trees.
//
// input:            map:          0
//   3 4                          / \
//   0 1                         /  2
//   0 2                        / /
//   2 1                        1
//   1 3                          \
//                                 3
//
// In this example your program should return `true` as there is a way to trim
// all trees in a single run. This run is (0, 2, 1, 3).
//
// Your function should must:
//  - Read in this data from stdin
//  - Store this data in an appropriate data structure
//  - Run the algorithm you have designed to solve this problem
//  - Do any clean up required (e.g., free allocated memory)
//  - Return `true` or `false` (included in the stdbool.h library)
//
// For full marks your algorithm must run in O(n + m) time.
bool is_single_run_possible() {
  // step 1. read in number of trees & edges - O(1)
  int num_trees, num_edges;
  scanf("%d %d",&num_trees, &num_edges);

  // step 2. read and process STDIN into adjacency list - O(n+m)
  Deque **adj_list = create_adjacency_list(num_trees);

  // step 3. topological sort using DFS - O(n+m)
  Deque *top_sort = topological_sort(adj_list, num_trees);

  //Step 4. Iterate through adj_list to see if each edge exists - O(m)
  bool is_possible = is_straight_path(adj_list, top_sort, num_trees);

  // step 5. free everything - O(n)
  free_deque(top_sort);
  free_adjacency_list(adj_list, num_trees);
  
return is_possible;
}

// reads and processes STDIN into an adjacency list - O(n+m)
Deque **create_adjacency_list(int num_trees) {
  int i, out_node, in_node;
  Deque **adj_list = malloc((num_trees+1)*sizeof(Deque*));

  for(i=0;i<=num_trees;i++) {
    adj_list[i] = new_deque();
  }

  while(scanf("%d %d", &out_node, &in_node) != EOF) {
    deque_insert(adj_list[out_node], in_node);
  }

  return adj_list;
}

// frees the deque of each index of the list then frees the list itself - O(n)
void free_adjacency_list(Deque **adj_list, int num_trees) {
  int i;
  for(i=0;i<=num_trees;i++){
    free_deque(adj_list[i]);
  }
  free(adj_list);
}

// linearises the graph using a DFS algorithm - O(n+m)
Deque *topological_sort(Deque **adj_list, int num_trees) {
  // creates deques to store current stack and popped stack
  Deque *out_deque = new_deque();
  Deque *top_sort = new_deque();

  // visit index to track whether a node has been visited or not
  int *visit_index = calloc(num_trees + 1,sizeof(int)), v = 0;
  
  deque_push(out_deque, v);
  while(deque_size(out_deque) != 0) {
    v = out_deque->top->data;
    Node *curr = adj_list[v]->top;

    // adds a neighbor of the current stack's top node if unvisited
    while(curr != NULL){
      if(visit_index[curr->data] == 0) {
        // sets the node to visited
        visit_index[curr->data] = 1;
        deque_push(out_deque,curr->data);
        break;
      }
      curr = curr->next;
    }

    // removes the top node if no more unvisited neighbors
    if(curr == NULL) {
      v = deque_pop(out_deque);
      deque_push(top_sort, v);
    }
  }

  // frees the current stack and visit index, then returns the sorted graph
  free_deque(out_deque);
  free(visit_index);
  return top_sort;
}

// checks whether there is a path between each node in the sorted graph - O(m)
bool is_straight_path(Deque **adj_list, Deque *top_sort, int num_trees) {
  // returns false if the linearized graph does not include every node
  if(deque_size(top_sort) != num_trees+1) {
    return false;
  } else {
    Node *curr = top_sort->top;
    while(curr->next != NULL) {
      bool edge_exists = false;
      Node *tree = adj_list[curr->data]->top;

      // iterates through adjacency list to make sure each edge exists
      while(tree != NULL) {
        if(curr->next->data == tree->data) {
          edge_exists = true;
          break;
        }
        tree = tree->next;
      }

      // returns false if any consecutive nodes dont have an edge between them
      if(!edge_exists) {
        return false;
      }
      curr = curr->next;
    }
  }

  // returns true otherwise
  return true;
}