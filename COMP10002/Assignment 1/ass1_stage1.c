/* Solution to comp10002 Assignment 1, 2019 semester 2.

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
   Dated:     16/09/2019

*/

/*****************************************************/

/* COMP10002 Foundations of Algorithms: Assignment 1, Stage 1 */

/*****************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_CHAR 999999
#define MAX_WORD_PER_LINE 300
#define MAX_WORD_LENGTH 100
#define DEFAULT_MARGIN 4
#define DEFAULT_LINE_LIMIT 50

#define SHOW_RULER 0
#define RULER "0----5---10---15---20---25---30---35---40---45---50---55---60\n"

/*****************************************************/

/* Function Prototypes */

void read_text(char input[], int *n_chars);
void text_to_3d_array(char input[], 
    char text_data[][MAX_WORD_PER_LINE][MAX_WORD_LENGTH], int n_chars);
void print_formatted(char text_data[][MAX_WORD_PER_LINE][MAX_WORD_LENGTH], 
    int n_lines, int margin, int width);
    
int line_counter(char input[], int n_chars);
int char_count(char word_array[]);
int mygetchar();

/*****************************************************/

/* Main Function: controls the main actions of the function */

int main(int argc, char *argv[]) {
    int n_lines, n_chars, margin = DEFAULT_MARGIN, width = DEFAULT_LINE_LIMIT;
    char input[MAX_CHAR];
    read_text(input, &n_chars);
    n_lines = line_counter(input, n_chars);
    char text_data[n_lines][MAX_WORD_PER_LINE][MAX_WORD_LENGTH];
    text_to_3d_array(input, text_data, n_chars);
    if (SHOW_RULER) {printf(RULER);}
    print_formatted(text_data, n_lines, margin, width);
    if (SHOW_RULER) {printf(RULER);}
    return 0;
}

/*****************************************************/

/* read_texts: reads input from stdin to 1d char array */

void read_text(char input[], int *n_chars) {
    char ch; int i = 0;
    while ((ch = mygetchar()) != EOF) {
        input[i++] = ch;
        *n_chars += 1;
    }
}

/*****************************************************/

/* text_to_3d_array: convert 1d char array to 3d array of lines, words, chars */

void text_to_3d_array(char input[], 
char text_data[][MAX_WORD_PER_LINE][MAX_WORD_LENGTH], int n_chars) {
    int t, i = 0, j = 0, k = 0, new_word = 1, command_line = 0;
    for (t = 0; t < n_chars; t++) {
        if (input[t] == '.') {
            command_line = 1;
        }
        while (input[t] != '\n') {
            /* increments & adds character to array if not space or tab */
            if (input[t] != ' ' && input[t] != '\t' ) {
                text_data[i][j][k] = input[t];
                /* adds ~ to differentiate real commands from not real ones */
                if (command_line) {
                    k += 1;
                    text_data[i][j][k] = '~';
                    command_line = 0;
                }
                k += 1;
                new_word = 0;
            }
            /* increments second layer if end of word */
            else {
                if (!new_word) {
                    j += 1; k = 0;
                    new_word = 1;
                }
            }
            t += 1;
            command_line = 0;
        }
        /* increments first layer if end of line */
        new_word = 1;
        i += 1; j = 0; k= 0;
    }
}

/*****************************************************/

/* print_formatted: outputs 3D array based on width & margin specifications */

void print_formatted(char text_data[][MAX_WORD_PER_LINE][MAX_WORD_LENGTH], 
int n_lines, int margin, int width) {
    int line, new_line = 1, line_end = 0, curr_line_len = 0;
    for (line = 0; line < n_lines; line++) {
        int word = 0;
        /* ignores lines starting with '.~' */
        if (!(text_data[line][0][0] == '.' && text_data[line][0][1] == '~')) {
            while (text_data[line][word][0] != '\0') {
                /* margin & width formatting */
                if (line_end) {
                    printf("\n");
                    line_end = 0;
                }
                if (new_line) {
                    int i;
                    for (i = 1; i < margin; i++) {
                        printf(" ");
                    }
                    curr_line_len = 0;
                    new_line = 0;
                }
                /* special case handling for words longer than width */
                if (char_count(text_data[line][word]) > DEFAULT_LINE_LIMIT) {
                    int i;
                    printf("\n");
                    for (i = 0; i < margin; i++) {
                        printf(" ");
                    }
                    printf("%s", text_data[line][word]);
                    word += 1;
                    new_line = 1;
                    line_end = 1;
                }
                /* prints word if it fits within the assigned width */
                else if ((curr_line_len + 
                char_count(text_data[line][word])) <= width) {
                    printf(" ");
                    printf("%s", text_data[line][word]);
                    curr_line_len += char_count(text_data[line][word]) + 1;
                    word += 1;
                } 
                /* restarts printing from last word if it did not fit */
                else {
                    new_line = 1;
                    line_end = 1;
                }
            }
        }
    }
    printf("\n");
}

/*****************************************************/

/* Helper Functions */

/* line_counter: counts lines from text based on newline characters */

int line_counter(char input[], int n_chars) {
    int i, count = 0;
    for (i = 0; i < n_chars; i++) {
        if (input[i] == '\n') {
            count += 1;
        }
    }
    return count;
}

/* char_count: counts characters of a word */

int char_count(char word_array[]) {
    int count = 0, i = 0;
    while (word_array[i++] != '\0') {
        count += 1;
    }
    return count;
}

/*  mygetchar: modified getchar function to handle PC formatting 
    This function was supplied from Alistair Moffat (2019)  */

int mygetchar() {
	int c;
	while ((c=getchar())=='\r') {
		}
	return c;
}

/*****************************************************/

/* algorithms are fun */