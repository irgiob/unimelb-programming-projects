from search.board import Board
from search.action import ActionSerializer
import random

BOARD_SIZE = 9
TOKENS_AVAILABLE = 9

class Player:

    def __init__(self, player):
        self.player = player # Either upper or lower
        self.board = Board(BOARD_SIZE)
        self.opponent = "lower" if self.player == "upper" else "upper"
        self.turn = 0
        self.tokens_left = TOKENS_AVAILABLE
        self.allowed_hexes = self.__get_allowed_hexes()


    def action(self):
        # Returns an action
        # Upper is allowed top 3 to throw - axial rows 2 ,3, 4
        # Lower is allowed bottom 4 - axial rows -1, -2, -3, -4
        throw = self.__process_throw()
        if throw != None:
            return throw


    def update(self, opponent_action, player_action):

        # Converts input into action and does it to the board
        actionSerializer = ActionSerializer()
        actionSerializer.serialize(player_action, self.player, self.board).do(self.board, self.turn)
        actionSerializer.serialize(opponent_action, self.opponent, self.board).do(self.board, self.turn)

        self.turn += 1


    # Returns throw action if condition supports, or else returns None
    def __process_throw(self):
        
        # There is no tokens on the board, randomly throw anything anywhere
        if self.board.board_dict == {}:
            i = random.randint(0, len(self.allowed_hexes) -1)
            return ("THROW", 's', self.allowed_hexes[i])

        # There is opponent tokens that we could not beat       
        for opp_token in self.board.token_dict[self.opponent]:

            can_win = False
            for my_token in self.board.token_dict[self.player]:
                can_win = my_token.is_win(opp_token.htype)
            
            if not can_win:
                # Throw winning token as close as possible
                opp_token = self.board.token_dict[self.opponent][0]
                opp_win, opp_lose = opp_token.get_win_lose()

                # Get closest distance valid coordinate
                min_dist = BOARD_SIZE + 1 # Largest euclidean distance
                min_coor = self.allowed_hexes[0]
                for (r,q) in self.allowed_hexes:
                    if opp_token.distance(r, q) < min_dist:
                        min_coor = (r, q)

                return("THROW", opp_lose, min_coor)
        
        return None


    # Get hexes that are allowed to throw tokens to
    def __get_allowed_hexes(self):

        allowed_hexes = []
        allowed_rows = []
        largest = (BOARD_SIZE - 1) // 2
        if self.player == "upper":
            allowed_rows = range(largest-2, largest+1)  
        else:
            allowed_rows = range(-(largest-3), -(largest+1))

        # Upper is allowed top 3 to throw - axial rows 2 ,3, 4
        # Lower is allowed bottom 4 - axial rows -1, -2, -3, -4
        for r in allowed_rows:
            for q in range(-largest,largest):
                if self.board.get_content(r,q) != None:
                    allowed_hexes.append((r,q))

        return allowed_hexes

