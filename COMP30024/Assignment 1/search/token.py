class Token:
    def __init__(self, htype, player, r, q):
        self.htype = htype.upper() if player == "upper" else htype
        self.player = player
        self.r = r
        self.q = q
        self.queue = []


    def __str__(self):
        return f"{self.htype}[{self.r},{self.q}]"

    def distance(self, r, q):
        z = -self.q - self.r
        z_t = -q - r
        return (abs(self.q - q) + abs(self.r - r) + abs(z - z_t)) / 2

    # Returns the symbols which the input symbol (wins,loses)
    def get_win_lose(self):
        symbol = self.htype.lower()
        if symbol == 'r':
            return 's', 'p'
        elif symbol == 's':
            return 'p', 'r'
        elif symbol == 'p':
            return 'r', 's'
        else:
            return "error"

    # Returns true if wins against a symbol
    def is_win(self, symbol):
        symbol = symbol.lower()
        if self.htype.lower() == 'r' and symbol == 's':
            return True
        if self.htype.lower() == 'p' and symbol == 'r':
            return True
        if self.htype.lower() == 's' and symbol == 'p':
            return True
        return False