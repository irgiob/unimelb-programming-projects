class Board:
    # initialize board attributes
    def __init__(self, board_size=9):
        self.size = board_size
        self.board = self.__create_board(self.size)
        self.axial_directions = [
            (0, -1), (0, 1), (-1, 0), (1, 0), (-1, 1), (1, -1)]
        self.token_dict = {"upper": [], "lower": []}
        self.n_tokens_made = {"upper": 0, "lower": 0}

    # create hexagonal board
    def __create_board(self, size):
        assert(size % 2 == 1)
        board = [[[] for q in range(size)] for r in range(size)]
        # remove non-usuable spaces of array
        for r in range(size//2):
            for q in range(size//2-r):
                board[r][q] = None
                board[size-1-r][size-1-q] = None
        return board

    # convert from axial coordinates to array indices
    def axial_to_array(self, *argv):
        return [i + self.size//2 for i in argv]

    # convert from array indices to axial coordinates
    def array_to_axial(self, *argv):
        return [i - self.size//2 for i in argv]

    # returns the content of a hex
    def get_content(self, r, q, isAxial=True):
        if isAxial:
            r, q = self.axial_to_array(r, q)
        return self.board[r][q]

    # add new token onto board
    def throw(self, token, r, q, player, isAxial=True):
        if not self.__is_valid_throw(r, player):
            raise Exception("INVALID THROW ACTION TO", r, q)
        token.r, token.q = r, q
        if isAxial:
            r, q = self.axial_to_array(r, q)
        self.board[r][q].append(token)
        self.token_dict[token.player].append(token)
        self.n_tokens_made[player] += 1

    def slide(self, token, r_b, q_b, isAxial=True):
        if not self.__is_valid_slide(token, r_b, q_b):
            raise Exception("INVALID SLIDE ACTION FROM",
                            token.r, token.q, "TO", r_b, q_b)
        self.__move(token, r_b, q_b)

    def swing(self, token, r_b, q_b, isAxial=True):
        if not self.__is_valid_swing(token, r_b, q_b):
            raise Exception("INVALID SWING ACTION FROM",
                            token.r, token.q, "TO", r_b, q_b)
        self.__move(token, r_b, q_b)

    # moves a token on the board
    # private as there is no checking for valid moves
    # used by main action functions (slide and swing) instead
    def __move(self, token, r_b, q_b, isAxial=True):
        # reassign coordinates inside token object
        r_a, q_a = token.r, token.q
        token.r, token.q = r_b, q_b
        if isAxial:
            r_a, q_a, r_b, q_b = self.axial_to_array(
                r_a, q_a, r_b, q_b)

        # move the token
        self.board[r_a][q_a].remove(token)
        self.board[r_b][q_b].append(token)

    # checks if a throw is valid
    def __is_valid_throw(self, r, player):
        if self.n_tokens_made[player] >= self.size:
            return False
        if player == "lower":
            r *= -1
        if self.size//2 - r <= self.n_tokens_made[player]:
            return True
        return False

    # checks if slide is valid
    def __is_valid_slide(self, token, r_b, q_b):
        adjacent = self.get_adjacent(token.r, token.q)
        if [r_b, q_b] not in adjacent:
            return False
        return True

    # checks if swing is valid
    def __is_valid_swing(self, token, r_b, q_b):
        neighbours = self.get_neighbours(token.r, token.q)
        neighbours = [x for x in neighbours if x.player == token.player]
        is_valid = False
        for neighbour in neighbours:
            adjacent = self.get_adjacent(neighbour.r, neighbour.q)
            if [r_b, q_b] in adjacent:
                is_valid = True
        return is_valid

    # battle when multiple tokens on one hex
    def battle(self, r, q, isAxial=True):
        if isAxial:
            r, q = self.axial_to_array(r, q)
        if(len(self.board[r][q]) > 1):
            # get all dead tokens
            dead = []
            for win, lose in [('r', 's'), ('s', 'p'), ('p', 'r')]:
                temp = [x.htype for x in self.board[r][q]]
                if win in temp and lose in temp:
                    dead.append(lose)
            dead = [token for token in self.board[r][q] if token.htype in dead]
            # removes said tokens from each place its stored
            self.board[r][q] = [x for x in self.board[r][q] if x not in dead]
            self.token_dict["upper"] = [
                x for x in self.token_dict["upper"] if x not in dead]
            self.token_dict["lower"] = [
                x for x in self.token_dict["lower"] if x not in dead]

    # get adjacent hexes of specific hex as list of array indices
    def get_adjacent(self, r, q, isAxial=True):
        # convert to array coordinates
        if isAxial:
            r, q = self.axial_to_array(r, q)
        # add all adjacent coordinates
        adjacent_array = [(r+direction[0], q+direction[1])
                          for direction in self.axial_directions]
        # remove out of bounds coordinates
        adjacent_array = [x for x in adjacent_array if x[0]
                          >= 0 and x[0] < self.size]
        adjacent_array = [x for x in adjacent_array if x[1]
                          >= 0 and x[1] < self.size]
        adjacent_array = [x for x in adjacent_array
                          if self.board[x[0]][x[1]] != None]
        out = [(c[0], c[1]) for c in adjacent_array]
        if isAxial:
            out = [(self.array_to_axial(c[0], c[1])) for c in adjacent_array]
        return out

    # get neighbours of specific hex
    def get_neighbours(self, r, q, isAxial=True):
        # convert to array coordinates
        if isAxial:
            r, q = self.axial_to_array(r, q)
        # get adjacent coordinates
        adjacent = self.get_adjacent(r, q, isAxial=False)
        # add neighbours if adjacent hexes arent empty
        neighbours = []
        for cell in adjacent:
            if len(self.board[cell[0]][cell[1]]) > 0:
                for token in self.board[cell[0]][cell[1]]:
                    neighbours.append(token)
        return neighbours
