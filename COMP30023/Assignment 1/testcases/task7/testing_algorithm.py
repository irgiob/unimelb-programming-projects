from sys import argv

def base_convert(i, b):
	result = []
	while i > 0:
		result.insert(0, i % b)
		i = i // b
	if len(result) == 0:
		result.append(0)
	return result

with open(argv[1]) as reader:
	lines = reader.readlines()

processes = []
for line in lines:
	new = line[:-2].split()
	new[0] = int(new[0])
	new[1] = int(new[1])
	new[2] = int(new[2])
	processes.append(new)
#print(processes)

n = int(argv[1][11])**len(processes)

best_score = int(argv[2])
best_code = 0

for i in range(n):
	if (i % 1000000 == 0):
		print(i,"codes have been test")
	code = base_convert(i,int(argv[1][11]))
	code = [0] * (len(processes)-len(code)) + code
	#code = [0, 0, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4]
	clock = 0
	index = 0
	cpu = [0] * int(argv[1][11])
	#print(cpu, code)
	while index < len(processes) or max(cpu) < 0:
		while index < len(processes) and processes[index][0] == clock:
			cpu[code[index]] += processes[index][2]
			index += 1
		for q in range(len(cpu)):
			if cpu[q] > 0:
				cpu[q] -= 1
		clock += 1
	makespan = max(cpu) + clock
	#print(makespan)
	if makespan < best_score:
		best_score = makespan
		best_code = code
		print(code, makespan)
