from search.board import Board
from search.util import print_slide, print_swing
from search.search_algorithm import Search_Algorithm
from search.token import Token
from search.action import Action


class Agent:
    # create player agent
    def __init__(self, size, data):
        self.board = Board(size)
        self.game_over = False

        for token_type in data:
            for token in data[token_type]:
                new_token = Token(token[0], token_type, token[1], token[2])
                self.board.throw(new_token)

        self.turn = 0
        self.route_dict = {}
        self.search_algo = Search_Algorithm(self.board)
        self.actions = []

    # run a turn of the game (move all tokens), returns false if the game is complete
    def perform_turn(self):
        self.turn += 1

        # Updates current route dict
        temp = list(self.route_dict).copy()
        for tokens in temp:
            if tokens not in self.board.token_dict["upper"]:
                del self.route_dict[tokens]

        self.__generate_actions()

        # Do all of the actions
        for action in self.actions:
            action_type, token, r, q = action.action_type, action.token, action.r, action.q
            action.do(self.board, self.turn)
        self.actions = []

        # Battles if tokens overlaps
        for token in self.board.token_dict["upper"]:
            self.board.battle(token.r, token.q, isAxial=True)

        # Checks if the game is complete
        if self.board.token_dict["upper"] == [] or self.board.token_dict["lower"] == []:
            return False
        return True

    # Runs BFS on each token and update the token_dict

    def run_search(self, player="upper"):
        for token in self.board.token_dict[player]:
            self.route_dict[token] = self.search_algo.a_star(token)

    # Generate random move for a token 
    def __random_cell(self, token):
        win, lose = token.get_win_lose()
        arr = self.board.get_adjacent(token.r, token.q)
        for cell in arr:
            if win not in self.board.get_content(cell[0], cell[1]) and lose not in self.board.get_content(
                cell[0], cell[1]) and not self.__get_similar_route(cell[0],cell[1]):
                return cell
        return arr[0]

    # Returns the token that encouters the same route as the current token
    def __get_similar_route(self, r, q):
        for action in self.actions:
            if action.r == r and action.q == q:
                return action.token
        return None

    # Generate appropriate actions from routes
    def __generate_actions(self):
        # Generate appropriate moves
        print(self.route_dict)
        for (token, route) in self.route_dict.items():
            action = "SLIDE"
            win, lose = token.get_win_lose()
            # Completed a route, look for another one
            if len(route) <= 1:
                if win in [x.htype for x in self.board.token_dict["lower"]]:
                    self.route_dict[token] = self.search_algo.a_star(token)
                else:
                    self.actions.append(
                    Action(action, token, self.__random_cell(token)))
            # Valid route exists for that token
            else:
                current_cell = route.pop(0)
                next_cell = route[0]
                # Swing action
                if (self.board.is_same_player(token, next_cell[0], next_cell[1])) and len(route) > 1:
                    swing_target = route[1]
                    if self.__get_similar_route(swing_target[0], swing_target[1]) == None:
                        leaped = route.pop(0)
                        next_cell = route[0]
                        action = "SWING"

                # If another token is going to the same cell
                if (self.__get_similar_route(next_cell[0], next_cell[1])):
                    slide_cells = []
                    swing_cells = []
                    adj_next = self.board.get_adjacent(next_cell[0], next_cell[1])

                    # Get alternative cells
                    for cells in self.board.get_adjacent(current_cell[0], current_cell[1]):
                        if cells in adj_next:
                            # Get adjacent to goal through swing
                            if self.board.is_same_player(token, cells[0], cells[1]):
                                for item in self.board.get_adjacent(cells[0], cells[1]):
                                    if (item in adj_next) and (self.__get_similar_route(item[0], item[1]) == None) and item != current_cell:
                                        swing_cells.append(item)
                            # Get adjacent token thorugh slide
                            else:
                                if self.__get_similar_route(cells[0],cells[1]) == None:
                                    slide_cells.append(cells)

                    if len(swing_cells) > 0:
                        next_cell = swing_cells[0]
                        action = "SWING"
                        self.route_dict[token][0] = next_cell
                    elif len(slide_cells) > 0:
                        next_cell = slide_cells[0]
                        action = "SLIDE"
                        self.route_dict[token][0] = next_cell
                    else:
                        next_cell = self.__random_cell(token)
                        action = "SLIDE"
                        self.route_dict[token] = [next_cell] + route
                    
                self.actions.append(Action(action, token, next_cell))

