"""
Provide a class to maintain the state of an evolving game, including
validation of actions, detection of draws, and optionally maintaining
a game log.

NOTE:
This board representation is designed to be used internally by the referee
for the purposes of validating actions and displaying the result of the game.
Each player is expected to store its own internal representation of the board
for use in informing decisions about which action to choose each turn. Please
don't look to this module as an example of a useful board representation for
these purposes; you should think carefully about how to design your own data
structures for representing the state of a game.
"""

import sys
import time
import logging
import collections

from referee.log import comment

# Game-specific constants for use in other modules:

GAME_NAME = "RoPaSci 360"
COLOURS = "upper", "lower"
NUM_PLAYERS = 2

# # #
# Generic play function:
#


def play(
    players,
    delay=0,
    print_state=True,
    use_debugboard=False,
    use_colour=False,
    use_unicode=False,
    log_filename=None,
    out_function=comment,
):
    """
    Coordinate a game, return a string describing the result.

    Arguments:
    * players        -- A list of Player wrappers supporting init, action
                        and update methods.
    * delay          -- Time in seconds to wait between turns, or negative
                        to wait for user input.
    * print_state    -- If True, print a picture of the board after each
                        update.
    * use_debugboard -- If True, use a larger board during updates (if
                        print_state is also True).
    * use_colour     -- Use ANSI colour codes for output.
    * use_unicode    -- Use unicode symbols for output.
    * log_filename   -- If not None, log all game actions to this path.
    * out_function   -- Use this function (instead of default 'comment')
                        for all output messages.
    """
    # Configure behaviour of this function depending on parameters:
    if delay > 0:

        def wait():
            time.sleep(delay)

    elif delay < 0:

        def wait():
            comment("(press enter to continue)", end="")
            input()

    else:

        def wait():
            pass

    if print_state:

        def display_state(game):
            comment("displaying game info:")
            comment(
                _RENDER(
                    game,
                    use_debugboard=use_debugboard,
                    use_colour=use_colour,
                    use_unicode=use_unicode,
                ),
                depth=1,
            )

    else:

        def display_state(game):
            pass

    # Set up a new game and initialise the players (constructing the
    # Player classes including running their .__init__() methods).
    game = Game(log_filename=log_filename)
    comment("initialising players", depth=-1)
    for player, colour in zip(players, COLOURS):
        # NOTE: `player` here is actually a player wrapper. Your program
        # should still implement a method called `__init__()`, not one
        # called `init()`:
        player.init(colour)

    # Display the initial state of the game.
    comment("game start!", depth=-1)
    display_state(game)

    # Repeat the following until the game ends
    # SIMULTANEOUS PLAY VERSION:
    # all players choose an action, then the board and players get updates:
    turn = 1
    player_1, player_2 = players
    while not game.over():
        comment(f"Turn {turn}", depth=-1)

        # Ask both players for their next action (calling .action() methods)
        action_1 = player_1.action()
        action_2 = player_2.action()

        # Validate both actions and apply them to the game if they are
        # allowed. Display the resulting game state
        game.update(action_1, action_2)
        display_state(game)

        # Notify both players of the actions (via .update() methods)
        player_1.update(opponent_action=action_2, player_action=action_1)
        player_2.update(opponent_action=action_1, player_action=action_2)

        # Next turn!
        turn += 1
        wait()

    # After that loop, the game has ended (one way or another!)
    result = game.end()
    return result


# # #
# Game rules implementation
#


# all hexes
_HEX_RANGE = range(-4, +4 + 1)
_ORD_HEXES = [
    (r, q) for r in _HEX_RANGE for q in _HEX_RANGE if -r - q in _HEX_RANGE
]
_SET_HEXES = frozenset(_ORD_HEXES)

# nearby hexes
_HEX_STEPS = [(1, -1), (1, 0), (0, 1), (-1, 1), (-1, 0), (0, -1)]


def _ADJACENT(x):
    rx, qx = x
    return _SET_HEXES & {(rx + ry, qx + qy) for ry, qy in _HEX_STEPS}


# rock-paper-scissors mechanic
_BEATS_WHAT = {"r": "s", "p": "r", "s": "p"}
_WHAT_BEATS = {"r": "p", "p": "s", "s": "r"}


def _BATTLE(symbols):
    types = {s.lower() for s in symbols}
    if len(types) == 1:
        # no fights
        return symbols
    if len(types) == 3:
        # everyone dies
        return []
    # else there are two, only some die:
    for t in types:
        # those who are not defeated stay
        symbols = [s for s in symbols if s.lower() != _BEATS_WHAT[t]]
    return symbols


# draw conditions
_MAX_TURNS = 360  # per player


class IllegalActionException(Exception):
    """If this action is illegal based on the current board state."""


class Game:
    """
    Represent the evolving state of a game. Main useful methods
    are __init__, update, over, end, and __str__.
    """

    def __init__(self, log_filename=None):
        # initialise game board state, and both players with zero throws
        self.board = {x: [] for x in _ORD_HEXES}
        self.throws = {"upper": 0, "lower": 0}

        # also keep track of some other state variables for win/draw
        # detection (number of turns, state history)
        self.nturns = 0
        self.history = collections.Counter({self._snap(): 1})
        self.result = None

        if log_filename is not None:
            self.logger = logging.getLogger(name=log_filename)
            handler = logging.FileHandler(log_filename, mode="w")
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)
        else:
            self.logger = logging.getLogger()  # logger with no handlers

    def update(self, upper_action, lower_action):
        """
        Submit an action to the game for validation and application.
        If the action is not allowed, raise an InvalidActionException with
        a message describing allowed actions.
        Otherwise, apply the action to the game state.
        """
        # validate the actions:
        for action, c in [(upper_action, "upper"), (lower_action, "lower")]:
            actions = list(self._available_actions(c))
            if action not in actions:
                self.logger.info(f"error: {c}: illegal action {action!r}")
                available_actions_list_str = "\n* ".join(
                    [f"{a!r} - {_FORMAT_ACTION(a)}" for a in actions]
                )
                # NOTE: The game instance _could_ potentially be recovered
                # but pursue a simpler implementation that just exits now
                raise IllegalActionException(
                    f"{c} player's action, {action!r}, is not well-"
                    "formed or not available. See specification and "
                    "game rules for details, or consider currently "
                    "available actions:\n"
                    f"* {available_actions_list_str}"
                )
        # otherwise, apply the actions:
        battles = []
        atype, *aargs = upper_action
        if atype == "THROW":
            s, x = aargs
            self.board[x].append(s.upper())
            self.throws["upper"] += 1
            battles.append(x)
        else:
            x, y = aargs
            # remove ONE UPPER-CASE SYMBOL from self.board[x] (all the same)
            s = self.board[x][0].upper()
            self.board[x].remove(s)
            self.board[y].append(s)
            # add it to self.board[y]
            battles.append(y)
        atype, *aargs = lower_action
        if atype == "THROW":
            s, x = aargs
            self.board[x].append(s.lower())
            self.throws["lower"] += 1
            battles.append(x)
        else:
            x, y = aargs
            # remove ONE LOWER-CASE SYMBOL from self.board[x] (all the same)
            s = self.board[x][0].lower()
            self.board[x].remove(s)
            self.board[y].append(s)
            # add it to self.board[y]
            battles.append(y)
        # resolve hexes with new tokens:
        for x in battles:
            # TODO: include summary of battles in output?
            self.board[x] = _BATTLE(self.board[x])

        self._turn_detect_end()
        # TODO:
        # return a sanitised version of the action to avoid action injection?

        # Log the action (if logging is enabled)
        self.logger.info(
            f"turn {self.nturns}: upper: {_FORMAT_ACTION(upper_action)}"
        )
        self.logger.info(
            f"turn {self.nturns}: lower: {_FORMAT_ACTION(lower_action)}"
        )

    def _available_actions(self, colour):
        """
        A generator of currently-available actions for a particular player
        (assists validation).
        """
        throws = self.throws[colour]
        isplayer = str.islower if colour == "lower" else str.isupper
        if throws < 9:
            sign = -1 if colour == "lower" else 1
            throw_zone = (
                (r, q) for r, q in _SET_HEXES if sign * r >= 4 - throws
            )
            for x in throw_zone:
                for s in "rps":
                    yield "THROW", s, x
        occupied = {x for x, s in self.board.items() if any(map(isplayer, s))}
        for x in occupied:
            adjacent_x = _ADJACENT(x)
            for y in adjacent_x:
                yield "SLIDE", x, y
                if y in occupied:
                    opposite_y = _ADJACENT(y) - adjacent_x - {x}
                    for z in opposite_y:
                        yield "SWING", x, z

    def _turn_detect_end(self):
        """
        Register that a turn has passed: Update turn counts and detect
        termination conditions.
        """
        # register turn
        self.nturns += 1
        state = self._snap()
        self.history[state] += 1

        # analyse remaining tokens
        up_throws = 9 - self.throws["upper"]
        up_tokens = [
            s.lower() for x in self.board.values() for s in x if s.isupper()
        ]
        up_symset = set(up_tokens)
        lo_throws = 9 - self.throws["lower"]
        lo_tokens = [
            s for x in self.board.values() for s in x if s.islower()
        ]
        lo_symset = set(lo_tokens)
        up_invinc = [
            s for s in up_symset
            if (lo_throws == 0) and (_WHAT_BEATS[s] not in lo_symset)
        ]
        lo_invinc = [
            s for s in lo_symset
            if (up_throws == 0) and (_WHAT_BEATS[s] not in up_symset)
        ] 
        up_notoks = (up_throws == 0) and (len(up_tokens) == 0)
        lo_notoks = (lo_throws == 0) and (len(lo_tokens) == 0)
        up_onetok = (up_throws == 0) and (len(up_tokens) == 1)
        lo_onetok = (lo_throws == 0) and (len(lo_tokens) == 1)

        # condition 1: one player has no remaining throws or tokens
        if up_notoks and lo_notoks:
            self.result = "draw: no remaining tokens or throws"
            return
        if up_notoks:
            self.result = "winner: lower"
            return
        if lo_notoks:
            self.result = "winner: upper"
            return

        # condition 2: both players have an invincible token
        if up_invinc and lo_invinc:
            self.result = "draw: both players have an invincible token"
            return

        # condition 3: one player has an invincible token, the other has
        #              only one token remaining (not invincible by 2)
        if up_invinc and lo_onetok:
            self.result = "winner: upper"
            return
        if lo_invinc and up_onetok:
            self.result = "winner: lower"
            return

        # condition 4: the same state has occurred for a 3rd time
        if self.history[state] >= 3:
            self.result = "draw: same game state occurred for 3rd time"
            return

        # condition 5: the players have had their 360th turn without end
        if self.nturns >= _MAX_TURNS:
            self.result = "draw: maximum number of turns reached"
            return

        # no conditions met, game continues
        return

    def _snap(self):
        """
        Capture the current board state in a hashable way
        (for repeated-state checking)
        """
        return (
            # same symbols/players tokens in the same positions
            tuple(
                (x, tuple(sorted(ts))) for x, ts in self.board.items() if ts
            ),
            # with the same number of throws remaining for each player
            self.throws["upper"],
            self.throws["lower"],
        )

    def over(self):
        """
        True iff the game has terminated.
        """
        return self.result is not None

    def end(self):
        """
        Conclude the game, extracting a string describing result (win or draw)
        This method should always be called to conclude a game so that this
        class has a chance to close the logfile, too.
        If the game is not over this is a no-op.
        """
        self.logger.info(self.result)
        return self.result


# # #
# Game display
#


def _RENDER(
    game,
    message="",
    use_debugboard=False,
    use_colour=False,
    use_unicode=False,
):
    """
    Create and return a representation of board for printing.
    """
    if use_debugboard:
        board_template = _BOARD_TEMPLATE_DEBUG
    else:
        board_template = _BOARD_TEMPLATE_SMALL
    # and should we use colour?
    if use_colour:
        _colour = _COLOUR_ANSI
    else:
        _colour = _NO_COLOUR
    # and should we use 😂 ?
    if use_unicode:
        _symbol_map = {
            "R": "💎 ",
            "r": "👊 ",
            "S": "✂️  ",
            "s": "✌️  ",
            "P": "📄 ",
            "p": "🖐  ",
        }
    # construct the contents of the cells:
    cells = []
    overflows = []
    for x in _ORD_HEXES:
        symbols = game.board[x]
        if len(symbols) == 0:
            cell = "     "
        elif use_unicode:
            if len(symbols) == 1:
                cell = f" {_symbol_map[symbols[0]]} "
            else:
                cell = f" {_symbol_map[symbols[0]]}+"
                overflows.append(f"{x}: {symbols}")
        else:
            if len(symbols) == 1:
                cell = f" ({symbols[0]}) "
            elif len(symbols) == 2:
                cell = f"({symbols[0]}){symbols[1]})"
            else:  # len(symbols) >= 3
                cell = f"({symbols[0]}){len(symbols)})"
                overflows.append(f"{x}: {symbols}")
        cells.append(_colour(cell))
    return board_template.format(
        message,
        *cells,
        str(game.throws["upper"]).center(5),
        str(game.throws["lower"]).center(5),
        (
            "overflown hexes:\n+ " + "\n+ ".join(overflows)
            if overflows
            else ""
        ),
    )


def _COLOUR_ANSI(s):
    t = ""
    for a in s:
        if a.islower():
            # magenta and bold
            t += "\033[1m" "\033[35m" + a + "\033[0m"
        elif a.isupper():
            # just bold
            t += "\033[1m" + a + "\033[0m"
        else:
            # normal
            t += a
    return t


def _NO_COLOUR(s):
    return s


_BOARD_TEMPLATE_SMALL = """{00:}
throws:        .-'-._.-'-._.-'-._.-'-._.-'-.
 upper        |{57:}|{58:}|{59:}|{60:}|{61:}|
 {62:}      .-'-._.-'-._.-'-._.-'-._.-'-._.-'-.
 lower     |{51:}|{52:}|{53:}|{54:}|{55:}|{56:}|
 {63:}   .-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-.
        |{44:}|{45:}|{46:}|{47:}|{48:}|{49:}|{50:}|
      .-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-.
     |{36:}|{37:}|{38:}|{39:}|{40:}|{41:}|{42:}|{43:}|
   .-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-.
  |{27:}|{28:}|{29:}|{30:}|{31:}|{32:}|{33:}|{34:}|{35:}|
  '-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'
     |{19:}|{20:}|{21:}|{22:}|{23:}|{24:}|{25:}|{26:}|
     '-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'
        |{12:}|{13:}|{14:}|{15:}|{16:}|{17:}|{18:}|
        '-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'
           |{06:}|{07:}|{08:}|{09:}|{10:}|{11:}|
           '-._.-'-._.-'-._.-'-._.-'-._.-'-._.-'
              |{01:}|{02:}|{03:}|{04:}|{05:}|
              '-._.-'-._.-'-._.-'-._.-'-._.-'
{64:}"""


_BOARD_TEMPLATE_DEBUG = """{00:}
throws:' `-.      ,-' `-._,-' `-._,-' `-._,-' `-._,-' `-.
    | upper |    | {57:} | {58:} | {59:} | {60:} | {61:} |
    | {62:} |    |  4,-4 |  4,-3 |  4,-2 |  4,-1 |  4, 0 |
 ,-' `-._,-'  ,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-.
| lower |    | {51:} | {52:} | {53:} | {54:} | {55:} | {56:} |
| {63:} |    |  3,-4 |  3,-3 |  3,-2 |  3,-1 |  3, 0 |  3, 1 |
 `-._,-'  ,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-.
         | {44:} | {45:} | {46:} | {47:} | {48:} | {49:} | {50:} |
         |  2,-4 |  2,-3 |  2,-2 |  2,-1 |  2, 0 |  2, 1 |  2, 2 |
      ,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-.
     | {36:} | {37:} | {38:} | {39:} | {40:} | {41:} | {42:} | {43:} |
     |  1,-4 |  1,-3 |  1,-2 |  1,-1 |  1, 0 |  1, 1 |  1, 2 |  1, 3 |
  ,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-.
 | {27:} | {28:} | {29:} | {30:} | {31:} | {32:} | {33:} | {34:} | {35:} |
 |  0,-4 |  0,-3 |  0,-2 |  0,-1 |  0, 0 |  0, 1 |  0, 2 |  0, 3 |  0, 4 |
  `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-'
     | {19:} | {20:} | {21:} | {22:} | {23:} | {24:} | {25:} | {26:} |
     | -1,-3 | -1,-2 | -1,-1 | -1, 0 | -1, 1 | -1, 2 | -1, 3 | -1, 4 |
      `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-'
         | {12:} | {13:} | {14:} | {15:} | {16:} | {17:} | {18:} |
         | -2,-2 | -2,-1 | -2, 0 | -2, 1 | -2, 2 | -2, 3 | -2, 4 |
          `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-'
             | {06:} | {07:} | {08:} | {09:} | {10:} | {11:} |
             | -3,-1 | -3, 0 | -3, 1 | -3, 2 | -3, 3 | -3, 4 |
              `-._,-' `-._,-' `-._,-' `-._,-' `-._,-' `-._,-'   key:' `-.
                 | {01:} | {02:} | {03:} | {04:} | {05:} |       | (sym) |
                 | -4, 0 | -4, 1 | -4, 2 | -4, 3 | -4, 4 |       |  r, q |
                  `-._,-' `-._,-' `-._,-' `-._,-' `-._,-'         `-._,-'
{64:}"""


def _FORMAT_ACTION(action):
    atype, *aargs = action
    if atype == "THROW":
        return "THROW symbol {} to {}".format(*aargs)
    else:  # atype == "SLIDE" or "SWING":
        return "{} from {} to {}".format(atype, *aargs)
