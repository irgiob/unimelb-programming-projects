import enum
from search.util import print_swing, print_slide

# Using enum class create enumerations
class type(enum.Enum):
    Swing = "SWING"
    Slide = "SLIDE"

class Action:

    def __init__(self, action_type, token, destination):
        self.action_type = action_type
        self.token = token
        self.r = destination[0]
        self.q = destination[1]

    def __str__(self):
        return f"Action: {self.action_type}, {self.token}, dest=[{self.r},{self.q}]"

    def do(self, board, turn):
        # Does the action to the board
        if self.action_type == 'SLIDE':
            print_slide(turn, self.token.r, self.token.q, self.r, self.q)
            board.move(self.token, self.r, self.q)
        elif self.action_type == 'SWING':
            print_swing(turn, self.token.r, self.token.q,  self.r, self.q)
            board.move(self.token,  self.r, self.q)
        elif self.action_type == "THROW":
            board.throw(self.token)

from search.token import Token

# Action factory
class ActionSerializer:
    def serialize(self, action, player, board):

        if input[0] == "THROW":
            (action_type, token_type, (r, q)) = action
            # Create new token
            token = Token(token_type, player, r, q)
            return Action(action_type, token, (r,q))
        else:
            (action_type, (ra, qa), (rb, qb)) = action
            
            # Locate token
            content = board.get_content(ra, qa)
            if len(content) > 0:
                token = content[0]
                return Action(action_type, token, rb, qb)
            return None