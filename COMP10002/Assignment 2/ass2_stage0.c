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
   Dated:     04/10/19

*/
/******************************************************************************/

/* Foundations Of Algorithms Assignment 2, Stage 0 */

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

#define GRID_SIZE 1
#define START_POINT 2
#define END_POINT 3
#define BLOCK_POINT 4 
#define ROUTE_DATA 5
#define STAGE2_INPUT 6

#define STAGE0 "==STAGE 0======================================="

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

typedef struct node node_t;
struct node {
	data_t data;
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
} grid_t;

/******************************************************************************/

/* function prototypes */

int mygetchar();
int get_line(char **curr_line);
void process_line(char *curr_line, int line_len, 
    int *line_type, grid_t *grid_data);
void add_block_data(char *curr_line, grid_t *grid_data);
void add_route_data(char *curr_line, int line_len, grid_t *grid_data);

void get_route_status(grid_t *grid_data);
int check_status_1(grid_t *grid_data);
int check_status_2(grid_t *grid_data);
int check_status_3(grid_t *grid_data);
int check_status_4(grid_t *grid_data);

void print_grid_data(grid_t *grid_data);
void print_route_data(grid_t *grid_data);
void free_grid_data(grid_t *grid_data);

list_t *make_empty_list(void);
int is_empty_list(list_t *list);
void free_list(list_t *list);
list_t *insert_at_foot(list_t *list, data_t value);
void get_head(list_t *list, int data_array[LOC_DATA_ARRAY_SIZE]);
list_t *get_tail(list_t *list);

/******************************************************************************/

/* main program: where the functions are put together to get the final output */

int main(int argc, char *argv[]) {
    /* initialization of type grid_t grid_data and its members*/
    grid_t *grid_data = (grid_t*)malloc(sizeof(grid_t));
    grid_data->curr_max_blocks = INITIAL_BLOCK_COUNT;
    grid_data->block_points = 
        (loc_t*)malloc(grid_data->curr_max_blocks*sizeof(loc_t));
    assert((grid_data != NULL) && (grid_data->block_points != NULL));
    grid_data->n_blocks = 0;
    grid_data->route_list = make_empty_list();
    /* read stdin line by line to load data into grid_data */
    char *curr_line = NULL;
    int line_len, line_type = GRID_SIZE;
    while ((line_len = get_line(&curr_line)) != EOF) {
        process_line(curr_line, line_len, &line_type, grid_data);
        free(curr_line);
        curr_line = NULL;
    }
    /* prints all necessary grid data then frees the grid */
    print_grid_data(grid_data);
    print_route_data(grid_data);
    get_route_status(grid_data);
    free_grid_data(grid_data);
    free_list(grid_data->route_list);
    grid_data->route_list = NULL;
	return 0;
}

/******************************************************************************/

/* this function is based on mygetline from the assignment 1 sample solution by 
    Alistar Moffar (2019). it has been modified to work with malloc-ed arrays */

int get_line(char **curr_line) {
    size_t curr_size = INITIAL_LINE_SIZE;
    *curr_line = (char *)malloc(curr_size*sizeof(*curr_line));
    assert(curr_line != NULL);
    int i = 0, c;
    /* adds char to malloc-ed array until a newline char is reached */
    while ((c=mygetchar()) != EOF) {
        /* extra space is allocated if required */
        if (i == curr_size) {
            curr_size *= 2;
            *curr_line = realloc(*curr_line, curr_size*sizeof(*curr_line));
            assert(*curr_line != NULL);
        }
        if (c == '\n') {
            (*curr_line)[i] = '\0';
            return i;
        }
        (*curr_line)[i++] = c;
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
                insert_at_foot(grid_data->route_list, temp_loc_array);
            /* free array and then restart process after the '->' */
            free(temp_str_array);
            temp_str_array = NULL;
            last_end = i + ARROW_LEN;
        }
    }
}

/******************************************************************************/

/* checks route status' one by one */

void get_route_status(grid_t *grid_data) {
    if (check_status_1(grid_data)) {
        grid_data->status = STATUS_1;
        printf("%s\n", grid_data->status);
        return;
    }
    else if (check_status_2(grid_data)) {
        grid_data->status = STATUS_2;
        printf("%s\n", grid_data->status);
        return;
    }
    else if (check_status_3(grid_data)) {
        grid_data->status = STATUS_3;
        printf("%s\n", grid_data->status);
        return;
    }
    else if (check_status_4(grid_data)) {
        grid_data->status = STATUS_4;
        printf("%s\n", grid_data->status);
        return;
    }
    /* if none of the checks are true, the route is valid (status 5) */
    else {
        grid_data->status = STATUS_5;
        printf("%s\n", grid_data->status);
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
        insert_at_foot(new_list, loc_array);
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
    insert_at_foot(new_list, loc_array);
    prev_loc_array[0] = loc_array[0];
    prev_loc_array[1] = loc_array[1];
    if (prev_loc_array[0] >= grid_data->n_rows || 
    prev_loc_array[1] >= grid_data->n_cols) {
        is_true = 1;
    }
    while (!is_empty_list(grid_data->route_list)) {
        get_head(grid_data->route_list, loc_array);
        grid_data->route_list = get_tail(grid_data->route_list);
        insert_at_foot(new_list, loc_array);
        /* checks if route goes more than one tile or goes diagonal */
        if ((abs(loc_array[0] - prev_loc_array[0]) > 1) || 
            (abs(loc_array[1] - prev_loc_array[1]) > 1) || 
            (abs(loc_array[0] - prev_loc_array[0]) >= 1 && 
            abs(loc_array[1] - prev_loc_array[1]) >= 1)) {
            is_true = 1;
        }
        /* checks if route goes beyond the grid dimensions */
        if (loc_array[0] >= grid_data->n_rows || 
        loc_array[1] >= grid_data->n_cols) {
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
        insert_at_foot(new_list, loc_array);
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

void print_route_data(grid_t *grid_data) {
    int loc_array[LOC_DATA_ARRAY_SIZE], count = 0;
    list_t *new_list=make_empty_list();
    while (!is_empty_list(grid_data->route_list)) {
        get_head(grid_data->route_list, loc_array);
        grid_data->route_list = get_tail(grid_data->route_list);
        printf("[%d,%d]", loc_array[0], loc_array[1]);
        insert_at_foot(new_list, loc_array);
        if (!is_empty_list(grid_data->route_list)) {
            printf("->");
        }
        else {
            printf(".");
        }
        count += 1;
        if (count == MAX_ROUTE_PER_LINE || 
        is_empty_list(grid_data->route_list)) {
            printf("\n");
            count = 0;
        }
    }
    free_list(grid_data->route_list);
    grid_data->route_list = new_list;
}

/* frees the grid_data after done being used */

void free_grid_data(grid_t *grid_data) {
    free(grid_data->block_points);
    grid_data->block_points = NULL;
    free(grid_data);
    grid_data = NULL;
}

/******************************************************************************/

/* functions from listop.c by Alistair Moffat (2019), modified to work with
    data_t as array data instead of int or char data */

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

list_t *insert_at_foot(list_t *list, data_t value) {
	node_t *new;
    int i;
	new = (node_t*)malloc(sizeof(*new));
	assert(list!=NULL && new!=NULL);
	for (i = 0; i < LOC_DATA_ARRAY_SIZE; i++) {
        new->data[i] = value[i];
    }
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

/******************************************************************************/

/* special getchar function that makes sure the input is unaffected by any
   DOS-format "return" characters */

int mygetchar() {
	int c;
	while ((c=getchar())=='\r') {
	}
	return c;
}

/******************************************************************************/

/* algorithms are fun */