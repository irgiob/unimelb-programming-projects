CFLAGS=-Wall -Wno-comment -std=c99

all: allocate debug

allocate: allocate.o multi_processor.o cpu_queue.o process.o
	gcc $(CFLAGS) -o allocate allocate.o multi_processor.o cpu_queue.o process.o -lm

debug: allocate.o multi_processor.o cpu_queue.o process.o
	gcc $(CFLAGS) -o debug -fsanitize=address allocate.o multi_processor.o cpu_queue.o process.o -lm

allocate.o: allocate.c multi_processor.c multi_processor.h
	gcc $(CFLAGS) -c allocate.c

multi_processor.o: multi_processor.c multi_processor.h cpu_queue.c cpu_queue.h
	gcc $(CFLAGS) -c multi_processor.c

cpu_queue.o: cpu_queue.c cpu_queue.h process.c process.h
	gcc $(CFLAGS) -c cpu_queue.c

process.o: process.c process.h
	gcc $(CFLAGS) -c process.c

clean:
	rm -f allocate debug allocate.o multi_processor.o cpu_queue.o process.o