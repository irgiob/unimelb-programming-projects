"""
Driver program to instantiate two Player classes and begin a game
between them.
"""

from referee.log import config, print, comment, _print
from referee.game import play, IllegalActionException
from referee.player import PlayerWrapper
from referee.player import ResourceLimitException, set_space_line
from referee.options import get_options


def main():
    # Parse command-line options into a namespace for use throughout this
    # program
    options = get_options()

    # Create a star-log for controlling the format of output from within this
    # program
    config(level=options.verbosity, ansi=options.use_colour)
    comment("all messages printed by the referee after this begin with *")
    comment("(any other lines of output must be from your Player class).")
    comment()

    try:
        # Import player classes
        p1 = PlayerWrapper(
            "player 1",
            options.player1_loc,
            time_limit=options.time,
            space_limit=options.space,
        )
        p2 = PlayerWrapper(
            "player 2",
            options.player2_loc,
            time_limit=options.time,
            space_limit=options.space,
        )

        # We'll start measuring space usage from now, after all
        # library imports should be finished:
        set_space_line()

        # Play the game!
        result = play(
            [p1, p2],
            delay=options.delay,
            print_state=(options.verbosity > 1),
            use_debugboard=(options.verbosity > 2),
            use_colour=options.use_colour,
            use_unicode=options.use_unicode,
            log_filename=options.logfile,
        )
        # Display the final result of the game to the user.
        comment("game over!", depth=-1)
        print(result)

    # In case the game ends in an abnormal way, print a clean error
    # message for the user (rather than a trace).
    except KeyboardInterrupt:
        _print()  # (end the line)
        comment("bye!")
    except IllegalActionException as e:
        comment("game error!", depth=-1)
        print("error: invalid action!")
        comment(e)
    except ResourceLimitException as e:
        comment("game error!", depth=-1)
        print("error: resource limit exceeded!")
        comment(e)
    # If it's another kind of error then it might be coming from the player
    # itself? Then, a traceback will be more helpful. Don't handle this.
