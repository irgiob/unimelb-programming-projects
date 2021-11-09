from ChumBucket.board import Board
from ChumBucket.token import Token
from ChumBucket.minimax import minimax
from copy import deepcopy
from random import shuffle

TRAINIING_MODE = False


class Player:
    def __init__(self, player):
        """
        Called once at the beginning of a game to initialise this player.
        Set up an internal representation of the game state.

        The parameter player is the string "upper" (if the instance will
        play as Upper), or the string "lower" (if the instance will play
        as Lower).
        """
        self.turn = 0
        self.board = Board()
        self.player = player
        self.opponent = "lower" if player == "upper" else "upper"

        self.weights = []
        with open("ChumBucket/trainer/weights.txt", "r") as f:
            for line in f:
                self.weights.append(float(line.strip()))

    def action(self):
        """
        Called at the beginning of each turn. Based on the current state
        of the game, select an action to play this turn.
        """
        MINIMAX_DEPTH = round(
            abs(self.weights[-1]) * 20) + round(abs(self.weights[-1]) * 10 + 1) % 2
        CUTOFF = self.weights[-2]

        actions = self.get_all_possible_actions(self.player)

        viable_throws = self.get_viable_throws(actions)
        non_throws = [z for z in actions if z[0] != "THROW"]

        scores = []
        for action in viable_throws + non_throws:
            a = [x for x in self.board.get_content(action[2][0], action[2][1])
                 if x.player == self.player]
            if len(a) == 0:
                player_copy = deepcopy(self)
                player_copy.update_player(self.player, action)

                # calculate minimax score for action and add it to scored list
                score = minimax(self, player_copy, MINIMAX_DEPTH, False, 0, 0)
                scores.append((score, action))

        # add actions with a score > max score - cutoff
        final = [x[1] for x in scores if x[0] >= max(scores)[0] - abs(CUTOFF)]

        # from remaining actions, choose action closest to killing an opponent
        return self.get_closest_killing_actions(final)

    def update(self, opponent_action, player_action):
        """
        Called at the end of each turn to inform this player of both
        players' chosen actions. Update your internal representation
        of the game state.
        The parameter opponent_action is the opponent's chosen action,
        and player_action is this instance's latest chosen action.
        """
        # run code for each player and their associated action
        for action in [(player_action, self.player),
                       (opponent_action, self.opponent)]:
            self.update_player(action[1], action[0])

        # have tokens battle
        self.board.battle(player_action[2][0], player_action[2][1])
        self.board.battle(opponent_action[2][0], opponent_action[2][1])

        # update turn timer
        self.turn += 1

        if TRAINIING_MODE:
            print(self.turn)
            print(self.board.n_tokens_made[self.player] -
                  len(self.board.token_dict[self.player]))
            print(self.board.n_tokens_made[self.opponent] -
                  len(self.board.token_dict[self.opponent]))

    def update_player(self, player, action):
        """
        This function acts as a helper function for the main update function,
        and is used to update the board with the action of a single player.
        This function does not call the battle function, as battle are only
        done after both player's actions have been added to the board. As
        such, the battle function is run on the main update function
        """
        action_type = action[0]
        r, q = action[2][0], action[2][1]

        # if throw, create new token and throw it onto the board
        if action_type == "THROW":
            new_token = Token(action[1], player, None, None)
            self.board.throw(new_token, r, q, player)

        # else, move the specified token to desintation hex
        elif action_type == "SLIDE" or action_type == "SWING":
            # select the (first if multiple) player's token in the cell
            cell = self.board.get_content(action[1][0], action[1][1])
            token = [token for token in cell if token.player == player][0]

            # move said token on the board
            if action_type == "SLIDE":
                self.board.slide(token, r, q)
            elif action_type == "SWING":
                self.board.swing(token, r, q)

    def get_viable_throws(self, actions):
        """
        Return all valid throw actions that can counter an opponent's 
        invincible token. If the opponent has no invincible tokens (or)
        the player cannot throw any more tokens, this function returns
        nothing. 
        """
        throw_actions = [x for x in actions if x[0] == "THROW"]
        # key: token, value: token required to kill it
        kill_dict = {'r': 'p', 'p': 's', 's': 'r'}

        # if first turn, just return all throws
        if len(self.board.token_dict[self.player]) == 0:
            return actions

        # if opponent has unkillable token(s), return only throws that can counter those token
        for token in [x.htype for x in self.board.token_dict[self.opponent]]:
            if len(throw_actions) > 0 and kill_dict[token] not in [x.htype for x in self.board.token_dict[self.player]]:
                return [x for x in throw_actions if x[1] == kill_dict[token]
                        and x[2] not in [(y.r, y.q) for y in self.board.token_dict[self.player]]]
        return []

    def get_closest_killing_actions(self, actions):
        '''
        From a list of potential actions, select the action that is cloest
        to killing an opponent token.
        '''
        a = []
        for action in actions:
            # get the action htype and all opponents
            if action[0] == "THROW":
                htype = action[1]
            elif action[0] == "SLIDE" or action[0] == "SWING":
                htype = [x.htype for x in self.board.get_content(
                    action[1][0], action[1][1])][0]
            opponents = self.board.token_dict[self.opponent]

            # find out closest killable token for each action
            closest_opp = None
            closest_distance = 99
            kill_dict = {'r': 's', 'p': 'r', 's': 'p'}
            for opp in [x for x in opponents if x.htype == kill_dict[htype]]:
                distance = opp.distance(action[2][0], action[2][1])
                if distance < closest_distance:
                    closest_distance = distance
                    closest_opp = opp
            a.append((closest_distance, action, closest_opp))

        # get action closest to killing a token (prioritising swing actions)
        a = sorted(a, key=lambda x: x[1][0], reverse=True)
        a = sorted(a, key=lambda x: x[0])
        return a[0][1]

    def get_all_possible_actions(self, player, random_order=True):
        """
        Get every single valid action a player can make.
        """
        actions = []

        # handle slide and swing actions
        for token in self.board.token_dict[player]:

            # get adjacent tiles and add them as slide actions
            slide_adjacent = self.board.get_adjacent(token.r, token.q)
            for c in slide_adjacent:
                actions.append(("SLIDE", (token.r, token.q), (c[0], c[1])))

            # get neighbouring ally tokens for potential swing
            neighbours = self.board.get_neighbours(token.r, token.q)
            neighbours = [token for token in neighbours
                          if token.player == player]

            for neighbour in neighbours:
                # get adjacent of neighbours and add them as swing actions
                swing_adjacent = self.board.get_adjacent(
                    neighbour.r, neighbour.q)
                swing_adjacent = [x for x in swing_adjacent
                                  if x not in slide_adjacent]
                swing_adjacent.remove([token.r, token.q])
                for c in swing_adjacent:
                    actions.append(("SWING", (token.r, token.q), (c[0], c[1])))

        # handle throw actions
        if self.board.n_tokens_made[player] != self.board.size:
            for htype in ['r', 'p', 's']:
                # generate all throwable spaces
                all = [(r, q) for q in range(self.board.size)
                       for r in range(self.board.size)]
                for r in range(self.board.size//2):
                    for q in range(self.board.size//2-r):
                        all = [x for x in all if not (x[0] == r and x[1] == q)]
                        all = [x for x in all if not (x[0] == self.board.size-1-r
                                                      and x[1] == self.board.size-1-q)]
                all = [(self.board.array_to_axial(x[0], x[1])) for x in all]

                # remove all throw options currently out of reach
                limit = self.board.n_tokens_made[player]
                if player == "upper":
                    all = [(x[0], x[1]) for x in all
                           if self.board.size//2 - x[0] <= limit]
                elif player == "lower":
                    all = [(x[0], x[1]) for x in all
                           if self.board.size//2 + x[0] <= limit]

                # add to action list
                for cell in all:
                    actions.append(("THROW", htype, cell))

        if random_order:
            shuffle(actions)
        return actions
