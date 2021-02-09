/* Solution to comp10002 Assignment 2, 2019 semester 2.

   Authorship Declaration:

   (1) I certify that the program contained in this submission is completely
   my own individual work, except where explicitly noted by comments that
   provide details otherwise.  I understand that work that has been developed
   by another student, or by me in collaboration with other students,
   or by non-students as a result of request, solicitation, or payment,
   may not be submitted for assessment in this subject.  I understand that
   submitting for assessment work developed by or in collaboration with
   other students or non-students constitutes Academic Misconduct, and
   may be penalized by mark deductions, or by other penalties determined
   via the University of Melbourne Academic Honesty Policy, as described
   at https://academicintegrity.unimelb.edu.au.

   (2) I also certify that I have not provided a copy of this work in either
   softcopy or hardcopy or any other form to any other student, and nor will
   I do so until after the marks are released. I understand that providing
   my work to other students, regardless of my intention or any undertakings
   made to me by that other student, is also Academic Misconduct.

   (3) I further understand that providing a copy of the assignment
   specification to any form of code authoring or assignment tutoring
   service, or drawing the attention of others to such services and code
   that may have been made available via such a service, may be regarded
   as Student General Misconduct (interfering with the teaching activities
   of the University and/or inciting others to commit Academic Misconduct).
   I understand that an allegation of Student General Misconduct may arise
   regardless of whether or not I personally make use of such solutions
   or sought benefit from such actions.

   Signed by: Irgio Ghazy Basrewan 1086150
   Dated:     14/10/19

*/
/******************************************************************************/

/* Foundations Of Algorithms Assignment 2, Stage 2 */

/******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#define LOC_ARRAY_SIZE 2
#define MAX_ROUTE_PER_LINE 5
#define N_DIRECTIONS 4

#define ROUTE '*'
#define BLOCK '#'
#define START 'I'
#define END 'G'
#define SPACE ' '

#define STAGE0 "==STAGE 0======================================="
#define STAGE1 "==STAGE 1======================================="
#define STAGE2 "==STAGE 2======================================="
#define LINE_SEP "------------------------------------------------"
#define LINE_SEP_THICK "================================================"

#define STATUS_1 "Initial cell in the route is wrong!"
#define STATUS_2 "Goal cell in the route is wrong!"
#define STATUS_3 "There is an illegal move in this route!"
#define STATUS_4 "There is a block on this route!"
#define STATUS_5 "The route is valid!"
#define STATUS_6 "The route cannot be repaired!"

/******************************************************************************/

/* type definitions for list_t based on code by Alistair Moffat (2019), 
   modified to have data loc_t be an array type instead of a basic data type */

typedef int loc_t[LOC_ARRAY_SIZE];
typedef struct node node_t;

struct node {
	loc_t data;
    int counter;
	node_t *next;
};
typedef struct {
	node_t *head;
	node_t *foot;
} list_t;

/* struct to store all the data of the grid */

typedef struct {
    char *status, **grid;
    int n_rows, n_cols, n_blocks, n_stage2;
    loc_t start_point, end_point;
    list_t *block_points, *block_points_stage2, *route_list;
} grid_t;

/******************************************************************************/

/* function prototypes */

void process_data(grid_t *grid_data);
grid_t *create_grid_data();
void print_grid_data(grid_t *grid_data);
void print_route_data(grid_t *grid_data, list_t *route_list);
void print_stage2(grid_t *grid_data);
void free_grid_data(grid_t *grid_data);

void create_ascii_grid(grid_t *grid_data, list_t *route_list);
void print_ascii_grid(grid_t *grid_data);
void free_ascii_grid(grid_t *grid_data);

void repair_route(grid_t *grid_data);
void print_repaired_route(grid_t *grid_data);
void find_break(loc_t break_start, list_t *break_end_points, 
    grid_t *grid_data);
list_t *make_queue(loc_t break_start, loc_t break_end, int *break_count,
    list_t *break_end_points, grid_t *grid_data);
int valid_queue(grid_t *grid_data, list_t *queue_full, loc_t loc_array);
list_t *make_fragment(list_t *queue, loc_t break_end, int break_count);
void insert_fragment(grid_t *grid_data, list_t *route_fragment, 
    loc_t break_start, loc_t break_end);

void get_route_status(grid_t *grid_data);
int check_status_3(grid_t *grid_data);
int check_status_4(grid_t *grid_data);

list_t *make_empty_list(void);
list_t *insert_at_head(list_t *list, loc_t value, int counter);
list_t *insert_at_foot(list_t *list, loc_t value, int counter);
node_t *get_tail(node_t *head);
void free_list(list_t *list);

int is_in_list(node_t *list_head, loc_t loc_array);
void add_list_to_list(list_t *dest, list_t *src);
void get_adjacent_tiles(loc_t directions[N_DIRECTIONS], loc_t loc_array);

/******************************************************************************/

/* main program: where the functions are put together to get the final output */

int
main(int argc, char *argv[]) {
    /* creates variable to store grid data then processes stdin into it */
    grid_t *grid_data = create_grid_data();
    process_data(grid_data);
    create_ascii_grid(grid_data, grid_data->route_list);
    if (grid_data->status == 0) {
        get_route_status(grid_data);
    }

    /* stage 0 output: prints out the grid data and route data */
    print_grid_data(grid_data);
    print_route_data(grid_data, grid_data->route_list);

    /* stage 1 output: prints the grid then repairs & reprints it if required */
    printf("%s\n", STAGE1);
    print_ascii_grid(grid_data);
    if (strcmp(grid_data->status,STATUS_4) == 0) {
        repair_route(grid_data);
        print_repaired_route(grid_data);
        print_route_data(grid_data, grid_data->route_list);
    }
    
    /* stage 2 output: prints other block configurations if they exist */
    if (grid_data->n_stage2 > 1 && strcmp(grid_data->status,STATUS_3) != 0) {
        print_stage2(grid_data); 
    } else {
        printf("%s\n", LINE_SEP_THICK);
    }

    /* frees everything after completion */
    free_grid_data(grid_data);
	return 0;
}

/******************************************************************************/

/* initializes grid_data members that need to be pre-initialized or malloc-ed */

grid_t
*create_grid_data() {
    grid_t *grid_data = (grid_t*)malloc(sizeof(grid_t));
    assert(grid_data != NULL);
    grid_data->block_points = make_empty_list();
    grid_data->block_points_stage2 = make_empty_list();
    grid_data->route_list = make_empty_list();
    grid_data->n_blocks = 0;
    grid_data->n_stage2 = 1;
    grid_data->status = 0;
    return grid_data;
}

/******************************************************************************/

/* read in data from stdin into the grid_data struct variable */

void
process_data(grid_t *grid_data) {
    /* reads standard input (size, start, end) & uses dump to get rid of '$' */
    char dump, end_of_file = 0;
    scanf("%dx%d\n", &grid_data->n_rows, &grid_data->n_cols);
    scanf("[%d,%d]\n", &grid_data->start_point[0], &grid_data->start_point[1]);
    scanf("[%d,%d]\n", &grid_data->end_point[0], &grid_data->end_point[1]);
    /* reads in block data till '$' is reached */
    loc_t loc_array;
    while(scanf("[%d,%d]\n", &loc_array[0], &loc_array[1]) == 2) {
        insert_at_foot(grid_data->block_points, loc_array, 0);
        grid_data->n_blocks += 1;
    }

    /* checks status 1 to make sure start point is correct */
    scanf("%c\n", &dump);
    scanf("[%d,%d]->", &loc_array[0], &loc_array[1]);
    insert_at_foot(grid_data->route_list, loc_array, 0);
    if (loc_array[0] != grid_data->start_point[0] && 
    loc_array[1] != grid_data->start_point[1]) {
        grid_data->status = STATUS_1;
    }
    /* loops over route data until all read */
    while (scanf("[%d,%d]->", &loc_array[0], &loc_array[1]) == 2 || 
    scanf("\n[%d,%d]->", &loc_array[0], &loc_array[1]) == 2) {
        insert_at_foot(grid_data->route_list, loc_array, 0);
    }
    /* checks status 2 to make sure end point is correct */
    if (loc_array[0] != grid_data->end_point[0] && 
    loc_array[1] != grid_data->end_point[1]) {
        grid_data->status = STATUS_2;
    }

    /* stage 2 input: reads in more block data till end of file */
    scanf("%c\n", &dump);
    while (!end_of_file) {
        if (scanf("[%d,%d]\n", &loc_array[0], &loc_array[1]) == 2) {
            insert_at_foot(grid_data->block_points_stage2, loc_array, 
            grid_data->n_stage2);
        }
        else {
            if (scanf("%c\n", &dump) == EOF) {
                end_of_file = 1;
            } else {
                /* increases number of configurations whenever '$' is reached */
                grid_data->n_stage2 += 1;
            }
        }
    }
}

/******************************************************************************/

/* checks route status 3 & 4, or returns status 5 (valid) if both are false */

void
get_route_status(grid_t *grid_data) {
    if (check_status_3(grid_data)) {
        grid_data->status = STATUS_3;
    } else if (check_status_4(grid_data)) {
        grid_data->status = STATUS_4;
    } else {
        grid_data->status = STATUS_5;
    }
}

/* checks status 3 by making sure every route point is valid */

int
check_status_3(grid_t *grid_data) {
    loc_t loc_array, prev_loc_array;
    node_t *head = grid_data->route_list->head;
    loc_array[0] = head->data[0];
    loc_array[1] = head->data[1];
    head = head->next;
    prev_loc_array[0] = loc_array[0];
    prev_loc_array[1] = loc_array[1];

    /* checks if previous route goes outside the grid boundaries */
    if (prev_loc_array[0] >= grid_data->n_rows || 
    prev_loc_array[1] >= grid_data->n_cols) return 1;
    while (head != NULL) {
        loc_array[0] = head->data[0];
        loc_array[1] = head->data[1];
        head = head->next;
        /* checks if route goes more than one tile or goes diagonal */
        if ((abs(loc_array[0] - prev_loc_array[0]) > 1) || 
        (abs(loc_array[1] - prev_loc_array[1]) > 1) || 
        (abs(loc_array[0] - prev_loc_array[0]) >= 1 && 
        abs(loc_array[1] - prev_loc_array[1]) >= 1)) {
            return 1;
        }
        /* checks if route goes beyond the grid dimensions */
        if (0 > loc_array[0] || loc_array[0] >= grid_data->n_rows || 
        0 > loc_array[1] || loc_array[1] >= grid_data->n_cols) {
            return 1;
        }
        prev_loc_array[0] = loc_array[0];
        prev_loc_array[1] = loc_array[1];
    }
    return 0;
}

/* checks status 4 by making sure each route point isnt a block point */

int
check_status_4(grid_t *grid_data) {
    node_t *head = grid_data->route_list->head;
    while (head != NULL) {
        if (is_in_list(grid_data->block_points->head, head->data)) {
            return 1;
        }
        head = head->next;
    }
    return 0;
}

/******************************************************************************/

/* repairs route data by creating a queue of potenital paths, finding the 
    optimal one, and printing after inserting it into the route path list */

void
repair_route(grid_t *grid_data) {
    loc_t break_start, break_end;
    int break_count = 0;
    list_t *break_end_points=make_empty_list();
    /* find where the break in the route starts and all potential end points */
    find_break(break_start, break_end_points, grid_data);
    
    /* create the queue to find a viable path */
    list_t *queue = make_queue(break_start, break_end, &break_count, 
        break_end_points, grid_data);
    /* create route fragment and insert into route list if repair possible */
    if (strcmp(grid_data->status,STATUS_6) != 0) {
        list_t *route_fragment = make_fragment(queue, break_end, break_count);
        insert_fragment(grid_data, route_fragment, break_start, break_end);
        get_route_status(grid_data);
    }

    /* free everything related to route repair once finished */
    free_list(queue);
    free_list(break_end_points);
}

/* finds last point before break & and all non-blocked points after break */

void
find_break(loc_t break_start, list_t *break_end_points, grid_t *grid_data){
    loc_t loc_array;
    node_t *head = grid_data->route_list->head;
    int start_found = 0;
    loc_array[0] = head->data[0];
    loc_array[1] = head->data[1];
    head = head->next;

    /* compares every point in the route with every next point */
    while (head != NULL) {
        if (is_in_list(grid_data->block_points->head, head->data)) {
            /* if reach block, set route point as start of break  */
            if (!start_found) {
                break_start[0] = loc_array[0]; break_start[1] = loc_array[1];
                start_found = 1;
            }
        }
        /* add non-blocked points after break start to break end points list */
        else if (start_found) insert_at_foot(break_end_points, head->data, 0);
        loc_array[0] = head->data[0];
        loc_array[1] = head->data[1];
        head = head->next;
    }
}

/* creates the queue of potential paths to find route past blocks */

list_t
*make_queue(loc_t break_start, loc_t break_end, int *break_count,
    list_t *break_end_points, grid_t *grid_data) {
    list_t *queue = make_empty_list(), *queue_full = make_empty_list();
    int j, end_found = 0;
    /* adds start of break as first element in queue */
    insert_at_foot(queue, break_start, 0);
    insert_at_foot(queue_full, break_start, 0);
    
    /* goes through every point in the the queue */
    while (queue->head != NULL && !end_found) {
        int counter = queue->head->counter;
        /* get adjacent points to point in queue*/
        loc_t directions[N_DIRECTIONS];
        get_adjacent_tiles(directions, queue->head->data);
        queue->head = get_tail(queue->head);
        if (queue->head==NULL) {
            queue->foot = NULL;
        }
        /* checks which adjacent points are valid to be put into the queue */
        for (j = 0; j < N_DIRECTIONS; j++) {
            int valid = valid_queue(grid_data, queue_full, directions[j]);
            /* if valid queue, add to queue list */
            if (valid) {
                insert_at_foot(queue, directions[j], counter + 1);
                insert_at_foot(queue_full, directions[j], counter + 1);
                /* continue till no space left or point after break is found */
                node_t *head = break_end_points->head;
                while (head != NULL) {
                    if ((directions[j][0] == head->data[0]) 
                    && (directions[j][1] == head->data[1])) {
                        end_found = 1;
                        break_end[0] = head->data[0];
                        break_end[1] = head->data[1];
                        *break_count = counter + 1;
                    }
                    head = head->next;
                }
            }
            if (end_found) {
                break;
            }
        }
    }
    /* returns the full queue or indicates if a repair is not possible */
    if (end_found == 0) {
        print_repaired_route(grid_data);
        grid_data->status = STATUS_6;
        printf("%s\n", grid_data->status);
    }
    free_list(queue);
    return queue_full;
}

/* checks if a point in the grid is valid to be put into the queue */

int
valid_queue(grid_t *grid_data, list_t *queue_full, loc_t loc_array) {
    if ((0 > loc_array[0] || loc_array[0] >= grid_data->n_rows 
    || 0 > loc_array[1] || loc_array[1] >= grid_data->n_cols)) {
        /* if adjacent points are out of the grid, not valid */
        return 0;
    } else if (is_in_list(grid_data->block_points->head, loc_array)) {
        /* if adjacent points is a block, not valid */
        return 0;
    } else if (is_in_list(queue_full->head, loc_array)) {
         /* if adjacent point is a point already in the queue, not valid */
        return 0;
    }
    /* returns valid if passes all tests */
    return 1;
}

/* use queue to create route from point before break to point after break */

list_t
*make_fragment(list_t *queue, loc_t break_end, int break_count) {
    list_t *route_fragment = make_empty_list();
    loc_t loc_array_1, loc_array_2, directions[N_DIRECTIONS];
    /* insert last point from queue (point after break) into fragment */
    loc_array_1[0] = break_end[0];
    loc_array_1[1] = break_end[1];
    int counter = break_count, i, j;
    insert_at_head(route_fragment, loc_array_1, counter);
    
    /* from point with highest counter, get all points with 1 lower count */
    for (i = counter-1; i >= 0; i--) {
        list_t *potential_paths = make_empty_list();
        node_t *head = queue->head;
        while(head !=NULL) {
            loc_array_2[0] = head->data[0]; 
            loc_array_2[1] = head->data[1];
            int counter_2 = head->counter;
            head = head->next;
            if (counter_2 == i) {
                insert_at_foot(potential_paths, loc_array_2, counter_2);
            }
        }

        /* check each point prioritizing the order given in the assignment */
        int found = 0;
        get_adjacent_tiles(directions, loc_array_1);
        for (j = 0; j < N_DIRECTIONS; j++) {
            node_t *head = potential_paths->head;
            while(head != NULL) {
                loc_array_2[0] = head->data[0]; 
                loc_array_2[1] = head->data[1];
                int counter_2 = head->counter;
                head = head->next;
                if (directions[j][0] == loc_array_2[0] && 
                directions[j][1] == loc_array_2[1]) {
                    insert_at_head(route_fragment, loc_array_2, counter_2);
                    found = 1;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
        loc_array_1[0] = route_fragment->head->data[0]; 
        loc_array_1[1] = route_fragment->head->data[1];
        counter = route_fragment->head->counter;
        free_list(potential_paths);
        /* repeat till counter is 0, indicating we've reached start of break */
    }
    return route_fragment;
}

/* insert the route fragment in the route list stored in grid_data */

void
insert_fragment(grid_t *grid_data, list_t *route_fragment, 
    loc_t break_start, loc_t break_end) {
    list_t *route_before_break = make_empty_list();
    list_t *route_after_break = make_empty_list();
    node_t *head = grid_data->route_list->head;
    /* adds points before break into route_before_break list */
    while (!is_in_list(grid_data->block_points->head, head->next->data)) {
        insert_at_foot(route_before_break, head->data, 0);
        head = head->next;
    }
    head = head->next;
    /* don't record any points during break */
    while (head->data[0] != break_end[0] || head->data[1] != break_end[1]) {
        head = head->next;
    }
    head = head->next;
    /* add points after break into route_after_break list */
    while (head != NULL) {
        insert_at_foot(route_after_break, head->data, 0);
        head = head->next;
    }

    /* empties route list and adds route_before_break, then the 
       route_fragment, followed by route_after_break to get repaired route */
    free_list(grid_data->route_list);
    grid_data->route_list = make_empty_list();
    add_list_to_list(grid_data->route_list, route_before_break);
    add_list_to_list(grid_data->route_list, route_fragment);
    add_list_to_list(grid_data->route_list, route_after_break);
}

/* recreates ascii grid with new route and prints the ascii grid */

void
print_repaired_route(grid_t *grid_data) {
    printf("%s\n", LINE_SEP);
    free_ascii_grid(grid_data);
    create_ascii_grid(grid_data, grid_data->route_list);
    print_ascii_grid(grid_data);
    printf("%s\n", LINE_SEP);
}


/******************************************************************************/

/* prints the data stored in grid_t struct type grid_data */

void
print_grid_data(grid_t *grid_data) {
    printf("%s\n", STAGE0);
    printf("The grid has %d rows and %d columns.\n", 
        grid_data->n_rows, grid_data->n_cols);
    printf("The grid has %d block(s).\n", grid_data->n_blocks);
    printf("The initial cell in the grid is [%d,%d].\n", 
        grid_data->start_point[0], grid_data->start_point[1]);
    printf("The goal cell in the grid is [%d,%d].\n", 
        grid_data->end_point[0], grid_data->end_point[1]);
    printf("The proposed route in the grid is:\n");
}

/* prints the route stored in grid_data->route_list */

void
print_route_data(grid_t *grid_data, list_t *route_list) {
    int count = 0;
    node_t *head = route_list->head;
    while (head != NULL) {
        /* prints arrow, period, or newline depending on position */
        printf("[%d,%d]", head->data[0], head->data[1]);
        head = head->next;
        if (head != NULL) {
            printf("->");
        } else {
            printf(".");
        }
        count += 1;
        if (count == MAX_ROUTE_PER_LINE || head == NULL) {
            printf("\n");
            count = 0;
        }
    }
    printf("%s\n", grid_data->status);
}

/* frees the grid_data after done being used */

void
free_grid_data(grid_t *grid_data) {
    free_ascii_grid(grid_data);
    free_list(grid_data->block_points);
    free_list(grid_data->route_list);
    free_list(grid_data->block_points_stage2);
    free(grid_data);
    grid_data = NULL;
}

/******************************************************************************/

/* creates the ASCII grid and inputs all the significant points in it */

void
create_ascii_grid(grid_t *grid_data, list_t *route_list) {
    /* allocate space for each row and column */
    char **grid;
    grid = (char**)malloc(grid_data->n_rows*sizeof(char**));
    assert(grid != NULL);
    int i, j;
    for (i = 0; i < grid_data->n_rows; i++) {
        grid[i] = (char*)malloc(grid_data->n_cols*sizeof(char*));
        assert(grid[i] != NULL);
    }

    /* fill each index in the grid with a space */
    for (i = 0; i < grid_data->n_rows; i++) {
        for (j = 0; j < grid_data->n_cols; j++) {
            grid[i][j] = SPACE;
        }
    }
    /* insert the route locations into the grid as '*' */
    node_t *head = route_list->head, *blocks = grid_data->block_points->head;
    while (head != NULL) {
        grid[head->data[0]][head->data[1]] = ROUTE;
        head = head->next;
    }
    /* insert start, end, & block points in the grid as I,G,# respectively */
    grid[grid_data->start_point[0]][grid_data->start_point[1]] = START;
    grid[grid_data->end_point[0]][grid_data->end_point[1]] = END;
    while (blocks != NULL) {
        grid[blocks->data[0]][blocks->data[1]] = BLOCK;
        blocks = blocks->next;
    }
    grid_data->grid = grid;
}

/* prints a representation of the grid using ASCII characters */

void
print_ascii_grid(grid_t *grid_data) {
    int i,j, count = 0;
    /* print the column headings */
    printf(" ");
    for (i = 0; i < grid_data->n_cols; i++){
        printf("%d", count++);
        if (count == 10) {
            count = 0;
        }
    }
    count = 0;
    printf("\n");
    /* print the row heading followed by the row */
    for (i = 0; i < grid_data->n_rows; i++) {
        printf("%d", count++);
        for (j = 0; j < grid_data ->n_cols; j++) {
            printf("%c", grid_data->grid[i][j]);
        }
        if (count == 10) {
            count = 0;
        }
        printf("\n");
    }
}

/* frees the ascii grid after done being used */

void
free_ascii_grid(grid_t *grid_data) {
    int i;
    for (i = 0; i < grid_data->n_rows; i++) {
        free(grid_data->grid[i]);
        grid_data->grid[i] = NULL;
    }
    free(grid_data->grid);
    grid_data->grid = NULL;
}

/******************************************************************************/

/* prints the output for stage 2 */

void
print_stage2(grid_t *grid_data) {
    int i;
    printf("%s\n", STAGE2);
    /* loop over each set of blocks */
    for (i = 1; i < grid_data->n_stage2 + 1; i++) {
        /* reset the block points variable to insert new block points */
        free_list(grid_data->block_points);
        grid_data->block_points = make_empty_list();
        node_t *head = grid_data->block_points_stage2->head;
        while(head != NULL) {
            /* add new block points */
            int counter = head->counter;
            if (counter == i) {
                insert_at_foot(grid_data->block_points, head->data, 0);
            }
            head = head->next;
        }

        /* free and recreate the grid with the new blocks */
        free_ascii_grid(grid_data);
        create_ascii_grid(grid_data, grid_data->route_list);
        get_route_status(grid_data);
        print_ascii_grid(grid_data);
        /* repair and reprint repaired route if required */
        if (strcmp(grid_data->status,STATUS_4) == 0) {
            while(strcmp(grid_data->status,STATUS_4) == 0) {
                repair_route(grid_data);
            }
            if (strcmp(grid_data->status,STATUS_6) != 0) {
                print_repaired_route(grid_data);
                print_route_data(grid_data, grid_data->route_list);
            }
        }
        printf("%s\n", LINE_SEP_THICK);
    }
}

/******************************************************************************/

/* functions from listop.c by Alistair Moffat (2019), modified to work with
    data in the from of the loc_t array */

/* creates and returns a pointer to an empty list */

list_t 
*make_empty_list(void) {
    list_t *list = (list_t*)malloc(sizeof(*list));
	assert(list!=NULL);
	list->head = list->foot = NULL;
	return list;
}

/* goes through a list and frees each node */

void 
free_list(list_t *list) {
	node_t *curr, *prev;
	assert(list!=NULL);
	curr = list->head;
	while (curr) {
		prev = curr;
		curr = curr->next;
		free(prev);
	}
	free(list);
    list = NULL;
}

/* inserts the location array and counter value at the head of the list */

list_t 
*insert_at_head(list_t *list, loc_t value, int counter) {
    int i;
    node_t *new = (node_t*)malloc(sizeof(*new));
	assert(list!=NULL && new!=NULL);
    for (i = 0; i < LOC_ARRAY_SIZE; i++) {
        new->data[i] = value[i];
    }
    new->counter = counter;
	new->next = list->head;
	list->head = new;
	if (list->foot==NULL) {
        list->foot = new;
    }
	return list;
}

/* inserts the location array and counter value at the foot of the list */

list_t 
*insert_at_foot(list_t *list, loc_t value, int counter) {
	int i;
    node_t *new = (node_t*)malloc(sizeof(*new));
	assert(list!=NULL && new!=NULL);
	for (i = 0; i < LOC_ARRAY_SIZE; i++) {
        new->data[i] = value[i];
    }
    new->counter = counter;
	new->next = NULL;
	if (list->foot==NULL) {
        list->head = list->foot = new;
    } else {
		list->foot->next = new;
		list->foot = new;
	}
	return list;
}

/* get the tail of a list and free the old head */

node_t
*get_tail(node_t *head) {
	node_t *oldhead;
	assert(head!=NULL);
	oldhead = head;
	head = head->next;
	free(oldhead);
	return head;
}

/******************************************************************************/

/* miscellaneous functions used for general operations  */

/* checks if loc_array is an element inside list */

int
is_in_list(node_t *list_head, loc_t loc_array) {
    node_t *list = list_head;
    while (list != NULL) {
        if (loc_array[0] == list->data[0] && loc_array[1] == list->data[1]) {
            return 1;
        }
        list = list->next;
    }
    return 0;
}

/* gets the locations of points adjancent to the location in loc_array */

void
get_adjacent_tiles(loc_t directions[N_DIRECTIONS], loc_t loc_array) {
    directions[0][0] = loc_array[0] - 1;
    directions[0][1] = loc_array[1];
    directions[1][0] = loc_array[0] + 1;
    directions[1][1] = loc_array[1];
    directions[2][0] = loc_array[0];
    directions[2][1] = loc_array[1] - 1;
    directions[3][0] = loc_array[0];
    directions[3][1] = loc_array[1] + 1;
}

/* adds all the contents of a list to the foot of another list then frees it */

void
add_list_to_list(list_t *dest, list_t *src) {
    while(src->head != NULL) {
        insert_at_foot(dest, src->head->data, 0);
        src->head = get_tail(src->head);
    } 
    free_list(src);
}

/******************************************************************************/

/* algorithms are fun */