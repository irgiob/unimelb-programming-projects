"""
Helper module, simplifying configurable-verbosity logging with uniform
formatting accross multiple parts of a program.
"""

import sys


# save the default print function
_print = print


class StarLog:
    """
    Convenience functions for logging configurable-verbosity messages with
    a consistent prefix.

    Parameters
    ----------

    * level (=1) determines which messages to print. calls to `log` with
        higher level are ignored.
    * file (=sys.stdout) where to send the output.
    * timefn (=None) callable returns string timestamp to accompany each log
        message, or None for no timestamps.
    * star (='*') the string used as a line prefix for all lines.
    * pad  (='  ') the string used to indent at each each depth level.
    * ansi (=False) True iff ANSI control codes should be allowed in
        clearing the terminal.
    """

    def __init__(
        self,
        level=1,
        file=sys.stdout,
        timefn=None,
        star="*",
        pad="  ",
        ansi=False,
    ):
        self.level = level
        self.timefn = timefn
        self.star = star
        self.pad = pad
        self.kwargs = {"file": file, "flush": True}
        if ansi:
            self.clear = "\033[H\033[2J"  # ANSI code to clear the terminal
        else:
            self.clear = ""

    def log(self, *args, level=None, depth=0, clear=False, **kwargs):
        """
        Log a message if warranted by this log's verbosity level setting.
        """
        # skip messages that are too verbose
        if level is not None and level > self.level:
            return
        # combine the message components
        sep = kwargs.get("sep", " ")
        msg = sep.join(map(str, args))
        # skip empty messages
        if not msg:
            return
        # output each line of message
        if depth >= 0:
            start = self.star + depth * self.pad
        else:
            start = self.star * (1 - depth)
        if clear:
            start = self.clear + start
        if self.timefn is not None:
            start += sep + f"[{self.timefn()}]"
        for line in msg.splitlines():
            _print(start, line, **kwargs, **self.kwargs)

    # shortcuts
    def print(self, *args, **kwargs):
        """Shortcut to log at level 0 (always)."""
        self.log(*args, level=0, **kwargs)

    def comment(self, *args, **kwargs):
        """Shortcut to log at level 1 (commentary/info)."""
        self.log(*args, level=1, **kwargs)

    def debug(self, *args, **kwargs):
        """Shortcut to log at level 2 (debug)."""
        self.log(*args, level=2, **kwargs)


"""
Allow global use of a single configurable starlog
"""


_DEFAULT_STARLOG = StarLog()


def config(**kwargs):
    """
    Configure the default, module-level logger. This will control the
    default parameters for all calls through the module-level functions.
    For isolated instances, create and maintain your own StarLog instance.

    Parameters
    ----------

    * level (=1) determines which messages to print. calls to `log` with
        higher level are ignored.
    * file (=sys.stdout) where to send the output.
    * timefn (=None) callable returns string timestamp to accompany each log
        message, or None for no timestamps.
    * star (='*') the string used as a line prefix for all lines.
    * pad  (='  ') the string used to indent at each each depth level.
    * ansi (=False) True iff ANSI control codes should be allowed in
        clearning the terminal.
    """
    global _DEFAULT_STARLOG
    _DEFAULT_STARLOG = StarLog(**kwargs)


def log(*args, **kwargs):
    """
    See StarLog.log.
    """
    _DEFAULT_STARLOG.log(*args, **kwargs)


def print(*args, **kwargs):
    """Shortcut to log at level 0 (always)."""
    log(*args, level=0, **kwargs)


def comment(*args, **kwargs):
    """Shortcut to log at level 1 (commentary/info)."""
    log(*args, level=1, **kwargs)


def debug(*args, **kwargs):
    """Shortcut to log at level 2 (debug)."""
    log(*args, level=2, **kwargs)
