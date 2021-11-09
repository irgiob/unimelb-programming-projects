class Token:
    def __init__(self, htype, player, r, q):
        self.htype = htype.lower()
        self.player = player.lower()
        self.r = r
        self.q = q

    def __str__(self):
        return f"{self.htype}[{self.r},{self.q}]"

    def distance(self, r, q):
        z = -self.q - self.r
        z_t = -q - r
        return (abs(self.q - q) + abs(self.r - r) + abs(z - z_t)) / 2
