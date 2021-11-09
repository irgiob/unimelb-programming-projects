from search.util import print_board


class Board:
    # initialize board attributes
    def __init__(self, board_size):
        self.size = board_size
        self.board = self.__create_board(self.size)
        self.board_dict = {}
        self.axial_directions = [
            (0, -1), (0, 1), (-1, 0), (1, 0), (-1, 1), (1, -1)]
        self.token_dict = {"upper": [], "lower": [], "block": []}

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

    # prints board to std out
    def print(self):
        output = {}
        for key in self.board_dict:
            key_new = tuple(self.__array_to_axial(key[0], key[1]))
            output[key_new] = ','.join(self.board_dict[key])
        print_board(output)

    # convert from axial coordinates to array indices
    def __axial_to_array(self, *argv):
        return [i + self.size//2 for i in argv]

    # convert from array indices to axial coordinates
    def __array_to_axial(self, *argv):
        return [i - self.size//2 for i in argv]

    # add new token onto board
    def throw(self, token):
        r, q = self.__axial_to_array(token.r, token.q)
        self.board[r][q].append(token)
        # block string for output only
        htype = "/////" if token.htype == "" else token.htype
        if (r, q) in self.board_dict:
            self.board_dict[(r, q)].append(htype)
        else:
            self.board_dict[(r, q)] = [htype]
        
        self.token_dict[token.player].append(token)

    # battle when multiple tokens on one hex
    def battle(self, r, q, isAxial=True):
        if isAxial:
            r, q = self.__axial_to_array(r, q)
        if(len(self.board[r][q]) > 1):
            for win, lose in [('r', 's'), ('s', 'p'), ('p', 'r')]:
                temp = [x.htype.lower() for x in self.board[r][q]]
                if win in temp and lose in temp:
                    self.board[r][q] = self.remove_all_token(
                        self.board[r][q], lose)
                    self.board_dict[(r, q)] = self.remove_all_dict(
                        r, q, lose)

    # get adjacent hexes of specific hex as list of array indices
    # removes none and block adjacent hexes

    def get_adjacent(self, r, q, isAxial=True):
        # convert to array coordinates
        if isAxial:
            r, q = self.__axial_to_array(r, q)
        # add all adjacent coordinates
        adjacent_array = [(r+direction[0], q+direction[1])
                          for direction in self.axial_directions]
        adjacent_array = [x for x in adjacent_array if x[0]
                          >= 0 and x[0] < self.size]
        adjacent_array = [x for x in adjacent_array if x[1]
                          >= 0 and x[1] < self.size]
        adjacent_array = [
            x for x in adjacent_array if self.board[x[0]][x[1]] != None]
        adjacent_array = [x for x in adjacent_array if '' not in [
            y.htype for y in self.board[x[0]][x[1]]]]
        out = [(self.__array_to_axial(c[0], c[1])) for c in adjacent_array]
        return out

    # get neighbours of specific hex
    def get_neighbours(self, r, q, isAxial=True):
        # convert to array coordinates
        if isAxial:
            r, q = self.__axial_to_array(r, q)
        # get adjacent coordinates
        adjacent = self.get_adjacent(r, q, isAxial=False)
        # add neighbours if adjacent hexes arent empty
        neighbours = []
        for cell in adjacent:
            if cell(self.board[cell[0]][cell[1]]) > 0:
                neighbours.append((self.board[cell[0]][cell[1]], cell[0], [1]))
        # convert back to axial coordinates
        for neighbour in neighbours:
            r_out, q_out = self.__array_to_axial(neighbour[1], neighbour[2])
            neighbour = (neighbour[0], r_out, q_out)
        return neighbours

    # remove all token from an array
    def remove_all_token(self, array, element):
        for token in array:
            if token.htype.lower() == element:
                array.remove(token)
                self.token_dict[token.player].remove(token)
        return array

    # remove all token from board dict
    def remove_all_dict(self, r, q, element):
        array = self.board_dict[(r, q)]
        for token in array:
            if token == element:
                array.remove(element)
            elif token == element.upper():
                array.remove(element.upper())
        return array

    # returns the content of a hex
    def get_content(self, r, q, isAxial=True):

        if isAxial:
            r, q = self.__axial_to_array(r, q)

        return self.board[r][q]

    # returns true if a cell has the same player as the token
    def is_same_player(self, token, r, q):
        cell = self.get_content(r, q)
        for item in cell:
            if item.player == token.player:
                return True
        return False

    # Moves a token from one cell to another
    def move(self, token, r_b, q_b, isAxial=True):

        r_a, q_a = token.r, token.q
        token.r, token.q = r_b, q_b
        if isAxial:
            r_a, q_a, r_b, q_b = self.__axial_to_array(
                r_a, q_a, r_b, q_b)

        self.board[r_a][q_a].remove(token)
        self.board_dict[(r_a, q_a)].remove(token.htype)
        if len(self.board_dict[(r_a, q_a)]) == 0:
            del self.board_dict[(r_a, q_a)]

        self.board[r_b][q_b].append(token)
        if (r_b, q_b) not in self.board_dict.keys():
            self.board_dict[(r_b, q_b)] = []
        self.board_dict[(r_b, q_b)].append(token.htype)
