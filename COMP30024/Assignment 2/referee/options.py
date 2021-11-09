"""
Provide a command-line argument parsing function using argparse
(resulting in the following help message):

-----------------------------------------------------------------------------
usage: referee [-h] [-V] [-d [delay]] [-s [space_limit]] [-t [time_limit]]
               [-D | -v [{0,1,2,3}]] [-l [LOGFILE]] [-c | -C] [-u | -a]
               upper lower

conduct a game of RoPaSci 360 between 2 Player classes.

player package/class specifications (positional args):

  The first 2 arguments are 'package specifications'. These specify which
  Python package/module to import and search for a class named 'Player' (to
  instantiate for each player in the game). When we test your programs this
  will just be your top-level package (i.e. 'your_team_name').

  If you want to play games with another player class from another package
  (e.g. while you develop your player), you can use any absolute module name
  (as used with import statements, e.g. 'your_team_name.player2') or relative
  path (to a file or directory containing the Python module, e.g. 'your_team_
  name/player3' or 'your_team_name/players/player4.py').

  Either way, the referee will attempt to import the specified package/module
  and then load a class named 'Player'. If you want the referee to look for a
  class with some other name you can put the alternative class name after a
  colon symbol ':' (e.g. 'your_team_name:DifferentPlayer').

  upper                 location of Upper's Player class (e.g. package name)
  lower                 location of Lower's Player class (e.g. package name)

optional arguments:
  -h, --help            show this message.
  -V, --version         show program's version number and exit
  -d [delay], --delay [delay]
                        how long (float, seconds) to wait between game
                        turns. 0: no delay; negative: wait for user input.
  -s [space_limit], --space [space_limit]
                        limit on memory space (float, MB) for each player.
  -t [time_limit], --time [time_limit]
                        limit on CPU time (float, seconds) for each player.
  -D, --debug           switch to printing the debug board (with
                        coordinates) (equivalent to -v or -v3).
  -v [{0,1,2,3}], --verbosity [{0,1,2,3}]
                        control the level of output (not including output
                        from players). 0: no output except result; 1:
                        commentary, but no board display; 2: (default)
                        commentary and board display; 3: (equivalent to -D)
                        larger board showing coordinates.
  -l [LOGFILE], --logfile [LOGFILE]
                        if you supply this flag the referee will create a
                        log of all game actions in a text file named LOGFILE
                        (default: game.log).
  -c, --colour          force colour display using ANSI control sequences
                        (default behaviour is automatic based on system).
  -C, --colourless      force NO colour display (see -c).
  -u, --unicode         force pretty display using unicode characters
                        (default behaviour is automatic based on system).
  -a, --ascii           force basic display using only ASCII characters (see
                        -u).
-----------------------------------------------------------------------------
"""

import sys
import argparse
from referee.game import GAME_NAME, COLOURS, NUM_PLAYERS

# Program information:
PROGRAM = "referee"
VERSION = "2021.0.1"
DESCRIP = (
    f"conduct a game of {GAME_NAME} between {NUM_PLAYERS} Player classes."
)

WELCOME = f"""******************************************************************
welcome to {GAME_NAME} referee version {VERSION}.

{DESCRIP}

run `python -m referee --help` for additional usage information.
******************************************************************"""

# default values (to use if flag is not provided)
# and missing values (to use if flag is provided, but with no value)

DELAY_DEFAULT = 0  # signifying no delay
DELAY_NOVALUE = 0.5  # seconds (between turns)

SPACE_LIMIT_DEFAULT = 0  # signifying no limit
SPACE_LIMIT_NOVALUE = 100.0  # MB (each)
TIME_LIMIT_DEFAULT = 0  # signifying no limit
TIME_LIMIT_NOVALUE = 60.0  # seconds (each)

VERBOSITY_LEVELS = 4
VERBOSITY_DEFAULT = 2  # normal level, normal board
VERBOSITY_NOVALUE = 3  # highest level, debug board

LOGFILE_DEFAULT = None
LOGFILE_NOVALUE = "game.log"

PKG_SPEC_HELP = """
The first {} arguments are 'package specifications'. These specify which
Python package/module to import and search for a class named 'Player' (to
instantiate for each player in the game). When we test your programs this
will just be your top-level package (i.e. 'your_team_name').

If you want to play games with another player class from another package
(e.g. while you develop your player), you can use any absolute module name
(as used with import statements, e.g. 'your_team_name.player2') or relative
path (to a file or directory containing the Python module, e.g. 'your_team_
name/player3' or 'your_team_name/players/player4.py').

Either way, the referee will attempt to import the specified package/module
and then load a class named 'Player'. If you want the referee to look for a
class with some other name you can put the alternative class name after a
colon symbol ':' (e.g. 'your_team_name:DifferentPlayer').
""".format(
    NUM_PLAYERS
)


def get_options():
    """Parse and return command-line arguments."""

    parser = argparse.ArgumentParser(
        prog=PROGRAM,
        description=DESCRIP,
        add_help=False,  # <-- we will add it back to the optional group.
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    # positional arguments used for player package specifications:
    positionals = parser.add_argument_group(
        title="player package/class specifications (positional args)",
        description=PKG_SPEC_HELP,
    )
    for num, col in enumerate(COLOURS, 1):
        Col = col.title()
        positionals.add_argument(
            f"player{num}_loc",
            metavar=col,
            action=PackageSpecAction,
            help=f"location of {Col}'s Player class (e.g. package name)",
        )

    # optional arguments used for configuration:
    optionals = parser.add_argument_group(title="optional arguments")
    optionals.add_argument(
        "-h",
        "--help",
        action="help",
        help="show this message.",
    )
    optionals.add_argument(
        "-V",
        "--version",
        action="version",
        version=VERSION,
    )

    optionals.add_argument(
        "-d",
        "--delay",
        metavar="delay",
        type=float,
        nargs="?",
        default=DELAY_DEFAULT,  # if the flag is not present
        const=DELAY_NOVALUE,  # if the flag is present with no value
        help="how long (float, seconds) to wait between game turns. 0: "
        "no delay; negative: wait for user input.",
    )

    optionals.add_argument(
        "-s",
        "--space",
        metavar="space_limit",
        type=float,
        nargs="?",
        default=SPACE_LIMIT_DEFAULT,
        const=SPACE_LIMIT_NOVALUE,
        help="limit on memory space (float, MB) for each player.",
    )
    optionals.add_argument(
        "-t",
        "--time",
        metavar="time_limit",
        type=float,
        nargs="?",
        default=TIME_LIMIT_DEFAULT,
        const=TIME_LIMIT_NOVALUE,
        help="limit on CPU time (float, seconds) for each player.",
    )

    verbosity_group = optionals.add_mutually_exclusive_group()
    verbosity_group.add_argument(
        "-D",
        "--debug",
        action="store_true",
        help="switch to printing the debug board (with coordinates) "
        "(equivalent to -v or -v3).",
    )
    verbosity_group.add_argument(
        "-v",
        "--verbosity",
        type=int,
        choices=range(0, VERBOSITY_LEVELS),
        nargs="?",
        default=VERBOSITY_DEFAULT,
        const=VERBOSITY_NOVALUE,
        help="control the level of output (not including output from "
        "players). 0: no output except result; 1: commentary, but no"
        " board display; 2: (default) commentary and board display; "
        "3: (equivalent to -D) larger board showing coordinates.",
    )

    optionals.add_argument(
        "-l",
        "--logfile",
        type=str,
        nargs="?",
        default=LOGFILE_DEFAULT,
        const=LOGFILE_NOVALUE,
        metavar="LOGFILE",
        help="if you supply this flag the referee will create a log of "
        "all game actions in a text file named %(metavar)s "
        "(default: %(const)s).",
    )

    colour_group = optionals.add_mutually_exclusive_group()
    colour_group.add_argument(
        "-c",
        "--colour",
        action="store_true",
        help="force colour display using ANSI control sequences "
        "(default behaviour is automatic based on system).",
    )
    colour_group.add_argument(
        "-C",
        "--colourless",
        action="store_true",
        help="force NO colour display (see -c).",
    )

    unicode_group = optionals.add_mutually_exclusive_group()
    unicode_group.add_argument(
        "-u",
        "--unicode",
        action="store_true",
        help="force pretty display using unicode characters "
        "(default behaviour is automatic based on system).",
    )
    unicode_group.add_argument(
        "-a",
        "--ascii",
        action="store_true",
        help="force basic display using only ASCII characters (see -u).",
    )

    args = parser.parse_args()

    # post-processing to combine mutually exclusive options
    # debug => verbosity 3
    if args.debug:
        args.verbosity = 3
    del args.debug
    # colour, colourless => force colour(less), else auto-detect
    if args.colour:
        args.use_colour = True
    elif args.colourless:
        args.use_colour = False
    else:
        args.use_colour = sys.stdout.isatty() and sys.platform != "win32"
    del args.colour, args.colourless
    # unicode, ascii => force display mode unicode or ascii, else auto-detect
    if args.unicode:
        args.use_unicode = True
    elif args.ascii:
        args.use_unicode = False
    else:
        args.use_unicode = False  # was: (sys.platform != 'win32')
    del args.unicode, args.ascii

    # done!
    if args.verbosity > 0:
        print(WELCOME)
    return args


class PackageSpecAction(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        pkg_spec = values

        # detect alternative class:
        if ":" in pkg_spec:
            pkg, cls = pkg_spec.split(":", maxsplit=1)
        else:
            pkg = pkg_spec
            cls = "Player"

        # try to convert path to module name
        mod = pkg.strip("/\\").replace("/", ".").replace("\\", ".")
        if mod.endswith(".py"):  # NOTE: Assumes submodule is not named `py`.
            mod = mod[:-3]

        # save the result in the arguments namespace as a tuple
        setattr(namespace, self.dest, (mod, cls))
