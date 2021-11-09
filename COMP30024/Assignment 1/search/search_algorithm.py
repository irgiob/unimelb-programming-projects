from search.token import Token


class Search_Algorithm:

    def __init__(self, board):
        self.board = board

    # Returns the sum of 2 tuples
    def __sum_tuple(self, tuple1, tuple2):
        return (tuple1[0]+tuple2[0], tuple1[1]+tuple2[1])

    # Returns the route of the nearest token to beat using BFS, returns empty list if BFS fails
    def bfs(self, token):
        symbol, r, q, player = token.htype, token.r, token.q, token.player
        win, lose = token.get_win_lose()
        explored = [[r, q]]
        routes = [[[r, q]]]

        # Obtain a list of all possible routes, returns a route if corresponding token is found
        while(len(routes) > 0):

            this_route = routes.pop(0)
            [r, q] = this_route[-1]

            # BFS through the last coordinate of a route
            for coordinate in self.board.get_adjacent(r, q):
                if coordinate not in explored:

                    cell = self.board.get_content(coordinate[0], coordinate[1])

                    new_route = this_route.copy()
                    new_route.append(coordinate)
                    explored.append(coordinate)
                    # print(self.board.board)
                    # Look for goal
                    for this_token in cell:
                        if this_token.htype.lower() == win and this_token.player != player:
                            return new_route

                    # Avoid route if it passes through a cell that will destroy the token
                    if lose not in [x.htype.lower() for x in cell]:
                        routes.append(new_route)

        return []

    def a_star(self, token):
        symbol, r_a, q_a, player = token.htype, token.r, token.q, token.player
        win, lose = token.get_win_lose()

        # choose closest killable opponent to target and set coordinates to goal
        r_b, q_b = 100, 100  # arbitrarily infintely far away initial goal
        for opp in self.board.token_dict['lower']:
            if opp.htype == win:
                if token.distance(opp.r, opp.q) < token.distance(r_b, q_b):
                    r_b, q_b = opp.r, opp.q

        # initialize open and close lists with starting g and f values of 0
        open = [(r_a, q_a, 0, 0, None)]
        close = {}
        while len(open) != 0:

            # find and extract cell with lowest f value
            current = [x for x in open if x[3] == min([x[3] for x in open])][0]
            open.remove(current)

            # if the cell is the goal, break loop
            if list(current)[0:2] == [r_b, q_b]:
                break

            # for every adjacent cell, calculate cost and heuristic score
            for cell in self.board.get_adjacent(current[0], current[1]):
                g = current[2] + 1
                h = Token(None, None, cell[0], cell[1]).distance(r_b, q_b)
                f = g + h
                sucessor = (cell[0], cell[1], g, f,
                            (current[0], current[1], current[2]))

                # if the cell contains a token that will kill current token, do not explore
                if lose in [x.htype for x in self.board.get_content(cell[0], cell[1])]:
                    continue

                # if open or close already contain that cell with a lower f value, do not explore
                if [sucessor[0], sucessor[1]] in [[x[0], x[1]] for x in open if x[3] <= f]:
                    continue
                elif [sucessor[0], sucessor[1]] in [[x[0], x[1]] for x in list(close.values()) if x[3] <= f]:
                    continue

                # otherwise, add it open list to explore later and add to close list to retrace possible path
                else:
                    open.append(sucessor)
                close[(sucessor[0], sucessor[1], sucessor[2])] = sucessor

        # if search leads to no result, return empty list
        if list(current)[0:2] != [r_b, q_b]:
            return []

        # otherwise, retrace path using close dictionary
        else:
            route = []
            while current[4] != (r_a, q_a, 0):
                route.append([current[0], current[1]])
                current = close[current[4]]
            route.append([current[0], current[1]])
            route.append([r_a, q_a])
            route.reverse()
            # return identified route
            return route
