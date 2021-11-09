import os
import sys

"""
multi_tester.py
This is used to test two AI instances on a large scale
run using: python multi_tester.py <number of tests> <AI one> <AI two>

Running this file returns the statistics of win, losses, draws, and errors
"""

trials = int(sys.argv[1]) // 2

p1 = p2 = draw = error = 0
print("Upper : p1 (" + sys.argv[2] +
      ") , Lower: p2 (" + sys.argv[3] + ")")
for i in range(trials):
    a = os.popen(
        f'python3 -m referee {sys.argv[2]} {sys.argv[3]} -v0').read()
    if 'winner' in a and 'upper' in a:
        p1 += 1
    elif 'winner' in a and 'lower' in a:
        p2 += 1
    elif 'draw' in a:
        draw += 1
    else:
        error += 1
print("P1:", p1, "P2:", p2, "Draw:", draw, "Error", error)

print("Upper : p2 (" + sys.argv[3] +
      ") , Lower: p1 (" + sys.argv[2] + ")")
for i in range(trials):
    a = os.popen(
        f'python3 -m referee {sys.argv[3]} {sys.argv[2]} -v0').read()
    if 'winner' in a and 'upper' in a:
        p2 += 1
    elif 'winner' in a and 'lower' in a:
        p1 += 1
    elif 'draw' in a:
        draw += 1
    else:
        error += 1
print("P1:", p1, "P2:", p2, "Draw:", draw, "Error", error)
