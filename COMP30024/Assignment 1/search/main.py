"""
COMP30024 Artificial Intelligence, Semester 1, 2021
Project Part A: Searching

This script contains the entry point to the program (the code in
`__main__.py` calls `main()`). Your solution starts here!
"""

import sys
import json
import time
from search.agent import Agent
from search.player import Player

BOARD_SIZE = 9


def main():

    player = Player("upper")
    print(player.action())

    # DEBUG = False
    # try:
    #     with open(sys.argv[1]) as file:
    #         data = json.load(file)
    #         agent = Agent(BOARD_SIZE, data)

    #         if "--debug" in sys.argv:
    #             DEBUG = True

    #         if DEBUG:
    #             agent.board.print()
    #             agent.run_search()
    #             while agent.perform_turn():
    #                 time.sleep(2)
    #                 agent.board.print()
    #             print("\n-------------Final board:-------------")
    #             agent.board.print()
    #         else:
    #             agent.run_search()
    #             while agent.perform_turn():
    #                 pass

    # except FileNotFoundError:
    #     print(f"File {sys.argv[1]} does not exist")
    #     sys.exit(1)
    # except IndexError:
    #     print(f"Please enter a file name")
    #     sys.exit(1)
