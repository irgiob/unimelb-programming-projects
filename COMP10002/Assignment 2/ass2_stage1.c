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
   Dated:     10/10/19

*/
/******************************************************************************/

/* Foundations Of Algorithms Assignment 2, Stage 1 */

/******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#define DEBUG 0
#define INITIAL_LINE_SIZE 5
#define INITIAL_BLOCK_COUNT 2
#define LOC_DATA_ARRAY_SIZE 2
#define ARROW_LEN 2
#define LOC_STR_MIN_LEN 5
#define MAX_ROUTE_PER_LINE 5
#define N_DIRECTIONS 4

#define GRID_SIZE 1
#define START_POINT 2
#define END_POINT 3
#define BLOCK_POINT 4 
#define ROUTE_DATA 5
#define STAGE2_INPUT 6
#define BREAK_POINT 7

#define ROUTE '*'
#define BLOCK '#'
#define START 'I'
#define END 'G'
#define SPACE ' '

#define STAGE0 "==STAGE 0======================================="
#define STAGE1 "==STAGE 1======================================="
#define LINE_SEP "------------------------------------------------"
#define LINE_SEP_THICK "================================================"

#define STATUS_1 "Initial cell in the route is wrong!"
#define STATUS_2 "Goal cell in the route is wrong!"
#define STATUS_3 "There is an illegal move in this route!"
#define STATUS_4 "There is a block on this route!"
#define STATUS_5 "The route is valid!"

/******************************************************************************/

/* type definitions for list_t based on code by Alistair Moffat (2019), 
    modified to have data_t be an array type instead of char or int type */

typedef int data_t[LOC_DATA_ARRAY_SIZE];
typedef data_t loc_t;
typedef char **ascii_grid_t;

typedef struct node node_t;
struct node {
	data_t data;
    int counter;
	node_t *next;
};
typedef struct {
	node_t *head;
	node_t *foot;
} list_t;

/* struct to store all the data of the grid */

typedef struct {
    char *status;
    int n_rows, n_cols, n_blocks;
    size_t curr_max_blocks;
    loc_t start_point;
    loc_t end_point;
    loc_t *block_points;
    list_t *route_list;
    ascii_grid_t grid;
} grid_t;

/******************************************************************************/

/* function prototypes */

int mygetchar();
grid_t *create_grid_data();
int get_line(char **curr_line);
void process_line(char *curr_line, int line_len, 
    int *line_type, grid_t *grid_data);
void add_block_data(char *curr_line, grid_t *grid_data);
void add_route_data(char *curr_line, int line_len, grid_t *grid_data);
void create_grid(grid_t *grid_data, list_t *route_list);

void repair_route(grid_t *grid_data);
void find_break(loc_t break_start, list_t *break_end_points, grid_t *grid_data);
list_t *make_queue(loc_t break_start, list_t *break_end_points, grid_t *grid_data);
void get_adjacent_tiles(loc_t directions[N_DIRECTIONS], loc_t loc_array);
list_t *make_route_fragment (list_t *queue, loc_t start_point);
void insert_route_fragment(grid_t *grid_data, list_t *route_fragment, loc_t break_start, loc_t break_end);
void print_repaired_route(grid_t *grid_data);

void get_route_status(grid_t *grid_data);
int check_status_1(grid_t *grid_data);
int check_status_2(grid_t *grid_data);
int check_status_3(grid_t *grid_data);
int check_status_4(grid_t *grid_data);

void print_ascii_grid(grid_t *grid_data);
void print_output(grid_t *grid_data);
void print_grid_data(grid_t *grid_data);
void print_route_data(grid_t *grid_data, list_t *route_list);
void free_grid_data(grid_t *grid_data);

list_t *make_empty_list(void);
int is_empty_list(list_t *list);
void free_list(list_t *list);
list_t *insert_at_head(list_t *list, data_t value, int counter);
list_t *insert_at_foot(list_t *list, data_t value, int counter);
void get_head(list_t *list, int data_array[LOC_DATA_ARRAY_SIZE]);
int get_queue_count(list_t *list);
list_t *get_tail(list_t *list);
list_t *reverse_list(list_t *list);

/******************************************************************************/

/* main program: where the functions are put together to get the final output */

int main(int argc, char *argv[]) {
    /* initialization of type grid_t grid_data and its members*/
    grid_t *grid_data = create_grid_data();
    /* read stdin line by line to load data into grid_data */
    char *curr_line = NULL;
    int line_len, line_type = GRID_SIZE;
    while ((line_len = get_line(&curr_line)) != EOF) {
        process_line(curr_line, line_len, &line_type, grid_data);
        free(curr_line);
        curr_line = NULL;
    }
    /* create ascii grid and identify status of the route */
    create_grid(grid_data, grid_data->route_list);
    get_route_status(grid_data);
    /* prints all necessary grid data */
    print_output(grid_data);
    /* repairs & reprints route if required then free */
    if (grid_data->status == STATUS_4) repair_route(grid_data);
    printf("%s\n", LINE_SEP_THICK);
    free_grid_data(grid_data);
	return 0;
}

/******************************************************************************/

/* creates an inital grid_data grid_t */

grid_t *create_grid_data() {
    grid_t *grid_data = (grid_t*)malloc(sizeof(grid_t));
    grid_data->curr_max_blocks = INITIAL_BLOCK_COUNT;
    grid_data->block_points = 
        (loc_t*)malloc(grid_data->curr_max_blocks*sizeof(loc_t));
    assert((grid_data != NULL) && (grid_data->block_points != NULL));
    grid_data->n_blocks = 0;
    grid_data->route_list = make_empty_list();
    return grid_data;
}

/******************************************************************************/

/* this function is based on mygetline from the assignment 1 sample solution by 
    Alistar Moffar (2019). it has been modified to work with malloc-ed arrays */

int get_line(char **curr_line) {
    size_t curr_size = INITIAL_LINE_SIZE;
    *curr_line = (char *)malloc(curr_size*sizeof(*curr_line));
    assert(curr_line != NULL);
    int i = 0, ch;
    /* adds char to malloc-ed array until a newline char is reached */
    while (((ch=mygetchar())) != EOF) {
        /* extra space is allocated if required */
        if (i == curr_size) {
            curr_size *= 2;
            *curr_line = realloc(*curr_line, curr_size*sizeof(*curr_line));
            assert(*curr_line != NULL);
        }
        if (ch == '\n' || ch == '\r') {
            (*curr_line)[i] = '\0';
            return i;
        }
        (*curr_line)[i++] = ch;
    }
    if (i>0) {
		(*curr_line)[i] = '\0';
		return i;
	} else {
		return EOF;
	}
}

/******************************************************************************/

/* processes a string array based on the type of line it is*/

void process_line(char *curr_line, int line_len, 
int *line_type, grid_t *grid_data) {
    if (DEBUG) printf("%s %d %d %zu\n", curr_line, line_len, 
        *line_type, grid_data->curr_max_blocks);
    /* scans for grid dimensions if line indicates grid size*/
    if (*line_type == GRID_SIZE) {
        sscanf(curr_line, "%dx%d", &grid_data->n_rows, &grid_data->n_cols);
        *line_type = START_POINT;
    }
    /* scans for start point if line indicates start point */
    else if (*line_type == START_POINT) {
        sscanf(curr_line, "[%d,%d]", &grid_data->start_point[0], 
            &grid_data->start_point[1]);
        *line_type = END_POINT;
    }
    /* scans for end point if line indicates end point */
    else if (*line_type == END_POINT) {
        sscanf(curr_line, "[%d,%d]", &grid_data->end_point[0], 
            &grid_data->end_point[1]);
        *line_type = BLOCK_POINT;
    }
    /* adds block points until a '$' is reached */
    else if (*line_type == BLOCK_POINT) {
        if (strcmp(curr_line, "$") == 0) {
            *line_type = ROUTE_DATA;
            return;
        }
        add_block_data(curr_line, grid_data);
    }
    /* adds route points until a '$' is reached */
    else if (*line_type == ROUTE_DATA) {
        if (strcmp(curr_line, "$") == 0) {
            *line_type = STAGE2_INPUT;
            return;
        }
        add_route_data(curr_line, line_len, grid_data);
    }
}

/******************************************************************************/

/* adds block locations to grid_data and allocates more space if required */

void add_block_data(char *curr_line, grid_t *grid_data) {
    if (grid_data->n_blocks == grid_data->curr_max_blocks) {
        grid_data->curr_max_blocks *= 2;
        grid_data->block_points = realloc(grid_data->block_points, 
            grid_data->curr_max_blocks*sizeof(loc_t));
        assert(grid_data->block_points != NULL);
    }
    sscanf(curr_line, "[%d,%d]", 
        &grid_data->block_points[grid_data->n_blocks][0], 
        &grid_data->block_points[grid_data->n_blocks][1]);
    grid_data->n_blocks += 1;
}

/* adds routes using list operation functions */

void add_route_data(char *curr_line, int line_len, grid_t *grid_data) {
    int temp_loc_array[LOC_DATA_ARRAY_SIZE];
    char *temp_str_array;
    int i, last_end = 0;
    for (i=0; i < line_len; i++) {
        /* if start of arrow or end of routes, scan that section of the line 
            of coordinates into an array and add that array to the list */
        if ((curr_line[i] == '-') || (i == line_len-1 && 
        (i - last_end >= LOC_STR_MIN_LEN-1))) {
            if (i == line_len - 1) i += 1;
            temp_str_array = (char *)malloc((i-last_end+1)*sizeof(char));
            assert(temp_str_array != NULL);
            strncpy(temp_str_array, curr_line+last_end, (i-last_end));
            sscanf(temp_str_array, "[%d,%d]", &temp_loc_array[0], 
                &temp_loc_array[1]);
            grid_data->route_list = 
                insert_at_foot(grid_data->route_list, temp_loc_array, 0);
            /* free array and then restart process after the '->' */
            free(temp_str_array);
            temp_str_array = NULL;
            last_end = i + ARROW_LEN;
        }
    }
}
/******************************************************************************/

/* repairs route data by creating a queue of potenital paths, finding the 
    optimal one, and printing after inserting it into the route path list */

void repair_route(grid_t *grid_data) {
    loc_t break_start;
    list_t *break_end_points=make_empty_list();
    find_break(break_start, break_end_points, grid_data);
    list_t *queue = make_queue(break_start, break_end_points, grid_data);
    queue = reverse_list(queue);
    loc_t break_end;
    get_head(queue, break_end);
    list_t *route_fragment = make_route_fragment(queue, break_start);
    insert_route_fragment(grid_data, route_fragment, break_start, break_end);
    free_list(queue);
    print_repaired_route(grid_data);
    print_route_data(grid_data, grid_data->route_list);
}

/* finds last place before any breaks & and first place after the last break */

void find_break(loc_t break_start, list_t *break_end_points, grid_t *grid_data){
    int loc_array[LOC_DATA_ARRAY_SIZE], prev_loc_array[LOC_DATA_ARRAY_SIZE];
    list_t *new_list=make_empty_list();
    int search_type = START_POINT, i;
    get_head(grid_data->route_list, loc_array);
    grid_data->route_list = get_tail(grid_data->route_list);
    insert_at_foot(new_list, loc_array, 0);
    prev_loc_array[0] = loc_array[0];
    prev_loc_array[1] = loc_array[1];
    /* compares every point in the route with every previous point */
    while (!is_empty_list(grid_data->route_list)) {
        int is_block = 0;
        get_head(grid_data->route_list, loc_array);
        grid_data->route_list = get_tail(grid_data->route_list);
        insert_at_foot(new_list, loc_array, 0);
        for (i = 0; i < grid_data->n_blocks; i++) {
            if ((loc_array[0] == grid_data->block_points[i][0]) && 
            (loc_array[1] == grid_data->block_points[i][1])) {
                /* if reach block, set prev route point as start of break  */
                if (search_type == START_POINT) {
                    break_start[0] = prev_loc_array[0];
                    break_start[1] = prev_loc_array[1];
                    search_type = END_POINT;
                    is_block = 1;
                }
                /* if start of break already found, all future non-blocked
                    points in the route are added to break end points list */
                else if (search_type == END_POINT) {
                    is_block = 1;
                }
            }
        }
        if (search_type == END_POINT && !is_block)  {
            insert_at_foot(break_end_points, loc_array, 0);
        }
        prev_loc_array[0] = loc_array[0];
        prev_loc_array[1] = loc_array[1];
    }
    free_list(grid_data->route_list);
    grid_data->route_list = new_list;
}

/* creates the queue of potential paths to find route past blocks */

list_t *make_queue(loc_t break_start, list_t *break_end_points, 
grid_t *grid_data) {
    list_t *queue = make_empty_list();
    list_t *queue_full = make_empty_list();
    loc_t loc_array;
    int i, j, end_found = 0;
    int count_n = 0;
    /* adds start of break as first element in queue */
    insert_at_foot(queue, break_start, 0);
    insert_at_foot(queue_full, break_start, 0);
    /* goes through every point in the the queue */
    while (!is_empty_list(queue) && !end_found) {
        get_head(queue, loc_array);
        int counter = get_queue_count(queue);
        queue = get_tail(queue);
        /* get adjacent points to point in queue*/
        loc_t directions[N_DIRECTIONS];
        get_adjacent_tiles(directions, loc_array);
        /* checks which adjacent points art valid to be put into the queue */
        for (j = 0; j < N_DIRECTIONS; j++) {
            int valid_queue = 1;
            /* if adjacent points are out of the grid, not valid */
            if ((0 > directions[j][0] || directions[j][0] >= grid_data->n_rows 
            || 0 > directions[j][1] || directions[j][1] >= grid_data->n_cols)) {
                valid_queue = 0;
            }
            /* if adjacent points his a block, not valid */
            for (i = 0; i < grid_data->n_blocks; i++) {
                if (((directions[j][0] == grid_data->block_points[i][0]) 
                && (directions[j][1] == grid_data->block_points[i][1]))) {
                    valid_queue = 0;
                    break;
                }
            }
            /* if adjacent point is a point already in the queue, not valid */
            list_t *temp_list = make_empty_list();
            while (!is_empty_list(queue_full)) {
                get_head(queue_full, loc_array);
                int chech_counter = get_queue_count(queue_full);
                queue_full = get_tail(queue_full);
                insert_at_foot(temp_list, loc_array, chech_counter);
                if (valid_queue == 1 && (directions[j][0] == loc_array[0]) 
                && (directions[j][1] == loc_array[1])) {
                    valid_queue = 0;
                }
            } 
            free_list(queue_full);
            queue_full = temp_list;
            /* if valid queue, add to queue list */
            if (valid_queue) {
                insert_at_foot(queue, directions[j], counter + 1);
                insert_at_foot(queue_full, directions[j], counter + 1);
                if (DEBUG) printf("([%d,%d], %d)", directions[j][0], 
                    directions[j][1], counter + 1);
                count_n += 1;
                list_t *new_temp_list = make_empty_list();
                while (!is_empty_list(break_end_points)) {
                    get_head(break_end_points, loc_array);
                    break_end_points = get_tail(break_end_points);
                    insert_at_foot(new_temp_list, loc_array, 0);
                    /* add queues till no space left or 
                        point after break is found */
                    if ((directions[j][0] == loc_array[0]) 
                    && (directions[j][1] == loc_array[1])) {
                        end_found = 1;
                    }
                } 
                *break_end_points = *new_temp_list;   
            }
            if (end_found) {
                break;
            }
        }
    }
    if (end_found == 0) {
        print_repaired_route(grid_data);
        printf("The route cannot be repaired!\n");
        printf("%s\n", LINE_SEP_THICK);
        exit(EXIT_FAILURE);
    }
    else {
        return queue_full;
    }
}

/* gets the locations of points adjancent to the location in loc_array */

void get_adjacent_tiles(loc_t directions[N_DIRECTIONS], loc_t loc_array) {
    int i;
    loc_t above = {loc_array[0] - 1, loc_array[1]};
    loc_t below = {loc_array[0] + 1, loc_array[1]};
    loc_t left = {loc_array[0], loc_array[1] - 1};
    loc_t right = {loc_array[0], loc_array[1] + 1};
    for (i = 0; i < LOC_DATA_ARRAY_SIZE; i++) {
        directions[0][i] = above[i];
        directions[1][i] = below[i];
        directions[2][i] = left[i];
        directions[3][i] = right[i];
    }
}

/* use queue to create route from point before break to point after break */

list_t *make_route_fragment (list_t *queue, loc_t start_point) {
    list_t *route_fragment = make_empty_list();
    loc_t loc_array_1, loc_array_2;
    int end_of_fragment = 0;
    /* insert last point from queue (point after break) into fragment */
    get_head(queue, loc_array_1);
    int counter = get_queue_count(queue);
    insert_at_head(route_fragment, loc_array_1, counter);
    queue = get_tail(queue);
    queue = reverse_list(queue);
    /* for current head of fragment, compare all in queue until valid found */
    while (!is_empty_list(queue)) {
        list_t *temp_list=make_empty_list();
        get_head(route_fragment, loc_array_1);
        counter = get_queue_count(route_fragment);
        while (!end_of_fragment) {
            get_head(queue, loc_array_2);
            int counter_2 = get_queue_count(queue);
            insert_at_foot(temp_list,loc_array_2, counter_2);
            /* queue element must have one less count than fragment element */
            if (counter - counter_2 == 1) {
                /* queue element must be adjacent to fragment element */
                if (abs(loc_array_1[0] - loc_array_2[0]) == 1 ^ 
                abs(loc_array_1[1] - loc_array_2[1]) == 1) {
                    if (abs(loc_array_1[0] - loc_array_2[0]) <= 1 && 
                    abs(loc_array_1[1] - loc_array_2[1]) <= 1) {
                        /* gets first valid element in queue 
                            until point before break is reached */
                        insert_at_head(route_fragment, loc_array_2, counter_2);
                        if (loc_array_2[0] == start_point[0] && 
                        loc_array_2[1] == start_point[1]) {
                            end_of_fragment = 1;
                        }
                        break;
                    }
                }
            }
            queue = get_tail(queue);
        }
        free_list(queue);
        queue = temp_list;
    }
    return route_fragment;
}

/* insert the route fragment in the route list stored in grid_data */

void insert_route_fragment(grid_t *grid_data, list_t *route_fragment, 
loc_t break_start, loc_t break_end) {
    list_t *route_before_break = make_empty_list();
    list_t *route_after_break = make_empty_list();
    loc_t loc_array;
    int list_type = START_POINT;
    while (!is_empty_list(grid_data->route_list)) {
        get_head(grid_data->route_list, loc_array);
        grid_data->route_list = get_tail(grid_data->route_list);
        /* adds points before break into route_before_break list */
        if (list_type == START_POINT) {
            if (loc_array[0] == break_start[0] && 
            loc_array[1] == break_start[1]) {
                list_type = BREAK_POINT;
            }
            else {
                insert_at_foot(route_before_break, loc_array, 0);
            }
        }
        /* don't record any points during break */
        else if (list_type == BREAK_POINT && loc_array[0] == break_end[0] 
        && loc_array[1] == break_end[1]) {
            list_type = END_POINT;
        }
        /* add points after break into route_after_break list */
        else if (list_type == END_POINT) {
            insert_at_foot(route_after_break, loc_array, 0);
        }
    }
    /* empties the route list and adds route_before_break, then the 
        route_fragment, followed by route_after_break to get repaired route */
    free(grid_data->route_list);
    grid_data->route_list = make_empty_list();
    while(!is_empty_list(route_before_break)) {
        get_head(route_before_break, loc_array);
        route_before_break = get_tail(route_before_break);
        insert_at_foot(grid_data->route_list, loc_array, 0);
    }
    while(!is_empty_list(route_fragment)) {
        get_head(route_fragment, loc_array);
        route_fragment = get_tail(route_fragment);
        insert_at_foot(grid_data->route_list, loc_array, 0);
    }
    while(!is_empty_list(route_after_break)) {
        get_head(route_after_break, loc_array);
        route_after_break = get_tail(route_after_break);
        insert_at_foot(grid_data->route_list, loc_array, 0);
    }
}

/* prints the repaired route in the grid with path and route status */

void print_repaired_route(grid_t *grid_data) {
    printf("%s\n", LINE_SEP);
    create_grid(grid_data, grid_data->route_list);
    print_ascii_grid(grid_data);
    printf("%s\n", LINE_SEP);
    get_route_status(grid_data);
}

/******************************************************************************/

/* checks route status' one by one */

void get_route_status(grid_t *grid_data) {
    if (check_status_1(grid_data)) {
        grid_data->status = STATUS_1;
        return;
    }
    else if (check_status_2(grid_data)) {
        grid_data->status = STATUS_2;
        return;
    }
    else if (check_status_3(grid_data)) {
        grid_data->status = STATUS_3;
        return;
    }
    else if (check_status_4(grid_data)) {
        grid_data->status = STATUS_4;
        return;
    }
    /* if none of the checks are true, the route is valid (status 5) */
    else {
        grid_data->status = STATUS_5;
    }
}

/* checks status 1 by getting the head of the list and comparing it to
    starting point in the grid data */

int check_status_1(grid_t *grid_data) {
    int loc_array[LOC_DATA_ARRAY_SIZE], i, is_true = 0;
    get_head(grid_data->route_list, loc_array);
    for (i = 0; i < LOC_DATA_ARRAY_SIZE; i++) {
        if (loc_array[i] != grid_data->start_point[i]) {
            is_true = 1;
        }
    }
    return is_true;
}

/* checks status 2 by going through the whole list till the end is reached 
    then compares that last head to the end point in the grid data */

int check_status_2(grid_t *grid_data) {
    int loc_array[LOC_DATA_ARRAY_SIZE], i, is_true = 0;
    list_t *new_list=make_empty_list();
    while (!is_empty_list(grid_data->route_list)) {
        get_head(grid_data->route_list, loc_array);
        grid_data->route_list = get_tail(grid_data->route_list);
        insert_at_foot(new_list, loc_array, 0);
        if (is_empty_list(grid_data->route_list)) {
            for (i = 0; i < LOC_DATA_ARRAY_SIZE; i++) {
                if (loc_array[i] != grid_data->end_point[i]) {
                    is_true = 1;
                }
            }
        }
    }
    free_list(grid_data->route_list);
    grid_data->route_list = new_list;
    return is_true;
}

/* checks status 3 by making sure every route point is valid */

int check_status_3(grid_t *grid_data) {
    int loc_array[LOC_DATA_ARRAY_SIZE], prev_loc_array[LOC_DATA_ARRAY_SIZE];
    int is_true = 0;
    list_t *new_list=make_empty_list();
    get_head(grid_data->route_list, loc_array);
    grid_data->route_list = get_tail(grid_data->route_list);
    insert_at_foot(new_list, loc_array, 0);
    prev_loc_array[0] = loc_array[0];
    prev_loc_array[1] = loc_array[1];
    if (prev_loc_array[0] >= grid_data->n_rows || 
    prev_loc_array[1] >= grid_data->n_cols) {
        is_true = 1;
    }
    while (!is_empty_list(grid_data->route_list)) {
        get_head(grid_data->route_list, loc_array);
        grid_data->route_list = get_tail(grid_data->route_list);
        insert_at_foot(new_list, loc_array, 0);
        /* checks if route goes more than one tile or goes diagonal */
        if ((abs(loc_array[0] - prev_loc_array[0]) > 1) || 
            (abs(loc_array[1] - prev_loc_array[1]) > 1) || 
            (abs(loc_array[0] - prev_loc_array[0]) >= 1 && 
            abs(loc_array[1] - prev_loc_array[1]) >= 1)) {
            is_true = 1;
        }
        /* checks if route goes beyond the grid dimensions */
        if (0 > loc_array[0] || loc_array[0] >= grid_data->n_rows || 
        0 > loc_array[1] || loc_array[1] >= grid_data->n_cols) {
            is_true = 1;
        }
        prev_loc_array[0] = loc_array[0];
        prev_loc_array[1] = loc_array[1];
    }
    free_list(grid_data->route_list);
    grid_data->route_list = new_list;
    return is_true;
}

/* checks status 4 by making sure each route point isnt a block point */

int check_status_4(grid_t *grid_data) {
    int loc_array[LOC_DATA_ARRAY_SIZE], is_true = 0, i;
    list_t *new_list=make_empty_list();
    while (!is_empty_list(grid_data->route_list)) {
        get_head(grid_data->route_list, loc_array);
        grid_data->route_list = get_tail(grid_data->route_list);
        insert_at_foot(new_list, loc_array, 0);
        for (i = 0; i < grid_data->n_blocks; i++) {
            if ((loc_array[0] == grid_data->block_points[i][0]) && 
            (loc_array[1] == grid_data->block_points[i][1])) {
                is_true = 1;
            }
        }
    }
    free_list(grid_data->route_list);
    grid_data->route_list = new_list;
    return is_true;
}

/******************************************************************************/

/* generalized printing function to print all forms of output */

void print_output(grid_t *grid_data) {
    print_grid_data(grid_data);
    print_route_data(grid_data, grid_data->route_list);
    printf("%s\n", STAGE1);
    print_ascii_grid(grid_data);
}

/* prints the data stored in grid_t struct type grid_data */

void print_grid_data(grid_t *grid_data) {
    printf("%s\n", STAGE0);
    printf("The grid has %d rows and %d columns.\n", 
        grid_data->n_rows, grid_data->n_cols);
    printf("The grid has %d block(s).\n", 
        grid_data->n_blocks);
    printf("The initial cell in the grid is [%d,%d].\n", 
        grid_data->start_point[0], grid_data->start_point[1]);
    printf("The goal cell in the grid is [%d,%d].\n", 
        grid_data->end_point[0], grid_data->end_point[1]);
    printf("The proposed route in the grid is:\n");
}

/* prints the route stored in grid_data->route_list */

void print_route_data(grid_t *grid_data, list_t *route_list) {
    int loc_array[LOC_DATA_ARRAY_SIZE], count = 0;
    list_t *new_list=make_empty_list();
    while (!is_empty_list(route_list)) {
        get_head(route_list, loc_array);
        route_list = get_tail(route_list);
        printf("[%d,%d]", loc_array[0], loc_array[1]);
        insert_at_foot(new_list, loc_array, 0);
        if (!is_empty_list(route_list)) {
            printf("->");
        }
        else {
            printf(".");
        }
        count += 1;
        if (count == MAX_ROUTE_PER_LINE || 
        is_empty_list(route_list)) {
            printf("\n");
            count = 0;
        }
    }
    printf("%s\n", grid_data->status);
    free_list(grid_data->route_list);
    grid_data->route_list = new_list;
}

/* frees the grid_data after done being used */

void free_grid_data(grid_t *grid_data) {
    free(grid_data->block_points);
    grid_data->block_points = NULL;
    int i;
    for (i = 0; i < grid_data->n_rows; i++) {
        free(grid_data->grid[i]);
        grid_data->grid[i] = NULL;
    }
    free(grid_data->grid);
    grid_data->grid = NULL;
    free_list(grid_data->route_list);
    grid_data->route_list = NULL;
    free(grid_data);
    grid_data = NULL;
}

/******************************************************************************/

/* creates the ASCII grid and inputs all the significant points in it */

void create_grid(grid_t *grid_data, list_t *route_list) {
    /* allocate space for each row and column */
    ascii_grid_t grid;
    grid = (char**)malloc(grid_data->n_rows*sizeof(*grid));
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
    int loc_array[LOC_DATA_ARRAY_SIZE];
    list_t *new_list=make_empty_list();
    while (!is_empty_list(route_list)) {
        get_head(route_list, loc_array);
        route_list = get_tail(route_list);
        insert_at_foot(new_list, loc_array, 0);
        grid[loc_array[0]][loc_array[1]] = ROUTE;
    }
    free_list(grid_data->route_list);
    grid_data->route_list = new_list;
    /* insert start, end, & block points in the grid as I,G,# respectively */
    grid[grid_data->start_point[0]][grid_data->start_point[1]] = START;
    grid[grid_data->end_point[0]][grid_data->end_point[1]] = END;
    for (i = 0; i < grid_data->n_blocks; i++) {
        grid[grid_data->block_points[i][0]][grid_data->block_points[i][1]] 
            = BLOCK;
    }
    grid_data->grid = grid;
}

/* prints a representation of the grid using ASCII characters */

void print_ascii_grid(grid_t *grid_data) {
    int i,j, count = 0;
    printf(" ");
    for (i = 0; i < grid_data->n_cols; i++){
        printf("%d", count);
        if (count == 9) count = 0;
        count++;
    }
    count = 0;
    printf("\n");
    for (i = 0; i < grid_data->n_rows; i++) {
        printf("%d", count);
        for (j = 0; j < grid_data ->n_cols; j++) {
            printf("%c", grid_data->grid[i][j]);
        }
        if (count == 9) count = 0;
        count++;
        printf("\n");
    }

}

/******************************************************************************/

/* functions from listop.c by Alistair Moffat (2019), modified to work with
    data_t as array data. exception is reverse_list which is original code */

list_t *make_empty_list(void) {
	list_t *list;
	list = (list_t*)malloc(sizeof(*list));
	assert(list!=NULL);
	list->head = list->foot = NULL;
	return list;
}

int is_empty_list(list_t *list) {
	assert(list!=NULL);
	return list->head==NULL;
}

void free_list(list_t *list) {
	node_t *curr, *prev;
	assert(list!=NULL);
	curr = list->head;
	while (curr) {
		prev = curr;
		curr = curr->next;
		free(prev);
	}
	free(list);
}

list_t *insert_at_head(list_t *list, data_t value, int counter) {
	node_t *new;
    int i;
	new = (node_t*)malloc(sizeof(*new));
	assert(list!=NULL && new!=NULL);
    for (i = 0; i < LOC_DATA_ARRAY_SIZE; i++) {
	    new->data[i] = value[i];
    }
    new->counter = counter;
	new->next = list->head;
	list->head = new;
	if (list->foot==NULL) {
		/* this is the first insertion into the list */
		list->foot = new;
	}
	return list;
}

list_t *insert_at_foot(list_t *list, data_t value, int counter) {
	node_t *new;
    int i;
	new = (node_t*)malloc(sizeof(*new));
	assert(list!=NULL && new!=NULL);
	for (i = 0; i < LOC_DATA_ARRAY_SIZE; i++) {
        new->data[i] = value[i];
    }
    new->counter = counter;
	new->next = NULL;
	if (list->foot==NULL) {
		/* this is the first insertion into the list */
		list->head = list->foot = new;
	} else {
		list->foot->next = new;
		list->foot = new;
	}
	return list;
}

void get_head(list_t *list, int data_array[LOC_DATA_ARRAY_SIZE]) {
	assert(list!=NULL && list->head!=NULL);
	int i;
    for (i = 0; i < LOC_DATA_ARRAY_SIZE; i++) {
        data_array[i] = list->head->data[i];
    }
}

int get_queue_count(list_t *list) {
	assert(list!=NULL && list->head!=NULL);
	return list->head->counter;
}

list_t *get_tail(list_t *list) {
	node_t *oldhead;
	assert(list!=NULL && list->head!=NULL);
	oldhead = list->head;
	list->head = list->head->next;
	if (list->head==NULL) {
		/* the only list node just got deleted */
		list->foot = NULL;
	}
	free(oldhead);
	return list;
}

list_t *reverse_list(list_t *list) {
    list_t *temp_list=make_empty_list();
    loc_t loc_array;
    while (!is_empty_list(list)) {
        get_head(list, loc_array);
        int count = get_queue_count(list);
        list = get_tail(list);
        insert_at_head(temp_list, loc_array, count);
    }
    free_list(list);
    list = NULL;
    return temp_list;
}

/******************************************************************************/

/* getchar function that is unaffected by any DOS-format "return" characters */

int mygetchar() {
	int c;
	while ((c=getchar())=='\r') {
		}
	return c;
}

/******************************************************************************/

/* algorithms are fun */