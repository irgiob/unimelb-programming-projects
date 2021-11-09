from copy import deepcopy


def minimax(player, copy, depth, maximising_player, alpha, beta):
    """
    Calculates the optimal move to make
    player: the original state of the game (to evaluate action score)
    copy: the state of the game after a certain combination of moves
    depth: the current max search depth
    """
    if depth == 0:
        return eval(player, copy)

    if maximising_player:
        best_val = float('-inf')
        actions = copy.get_all_possible_actions(player.player)
        for action in [x for x in actions if x[0] != "THROW"]:

            player_copy = deepcopy(copy)
            player_copy.update_player(player.player, action)

            # only battle after opponent makes move as well
            battle_all(player_copy)

            value = minimax(player, player_copy, depth-1, False, alpha, beta)
            best_val = max(best_val, value)
            alpha = max(alpha, best_val)

            if beta <= alpha:
                break

        return best_val

    else:
        best_val = float('inf')
        actions = copy.get_all_possible_actions(player.opponent)
        for action in [x for x in actions if x[0] != "THROW"]:

            player_copy = deepcopy(copy)
            player_copy.update_player(player.opponent, action)

            value = minimax(player, player_copy, depth-1, True, alpha, beta)
            best_val = min(best_val, value)
            beta = min(beta, best_val)

            if beta <= alpha:
                break

        return best_val


def battle_all(player):
    """
    Runs battles on every single hex of the board.
    """
    for i in range(player.board.size):
        for j in range(player.board.size):
            if player.board.board[i][j] != None:
                r, q = player.board.array_to_axial(j, i)
                player.board.battle(r, q)


def eval(original, player):
    """
    Returns the score for a board state
    """
    # 1. the number of opponents killed
    old_opp_dead = original.board.n_tokens_made[original.opponent] - \
        len(original.board.token_dict[original.opponent])
    new_opp_dead = player.board.n_tokens_made[player.opponent] - \
        len(player.board.token_dict[player.opponent])

    opp_dead = new_opp_dead - old_opp_dead

    # 2. the number of the player's tokens killed
    old_player_dead = original.board.n_tokens_made[original.player] - \
        len(original.board.token_dict[original.player])
    new_player_dead = player.board.n_tokens_made[player.player] - \
        len(player.board.token_dict[player.player])

    player_dead = new_player_dead - old_player_dead

    # 3. Number of possible player swing moves
    possible_moves = player.get_all_possible_actions(player.player)
    total_swing = len([x for x in possible_moves if x[0] == "SWING"])

    # 4. Total distance to nearest killable token
    avg_distance_can_kill = 0
    # 5. Total distance to nearest token that can kill
    avg_distance_killable = 0
    # 6. Smallest distance between a player token and a killable opponent token
    min_distance_can_kill = 99
    # 7. Smallest distance between a player token and a opponent token than can kill
    min_distance_killable = 99

    total_can_kill = 0
    total_killable = 0
    for pt in player.board.token_dict[player.player]:
        min_can_kill = 99
        min_killable = 99
        for ot in player.board.token_dict[player.opponent]:
            if (pt.htype, ot.htype) in [('r', 's'), ('s', 'p'), ('p', 'r')]:
                distance = pt.distance(ot.r, ot.q)
                if distance < min_can_kill:
                    min_can_kill = distance
            elif (ot.htype, pt.htype) in [('r', 's'), ('s', 'p'), ('p', 'r')]:
                distance = pt.distance(ot.r, ot.q)
                if distance < min_killable:
                    min_killable = distance
        if min_can_kill != 99:
            avg_distance_can_kill += min_can_kill
            total_can_kill += 1
        if min_killable != 99:
            avg_distance_killable += min_killable
            total_killable += 1
        if min_can_kill < min_distance_can_kill:
            min_distance_can_kill = min_can_kill
        if min_killable < min_distance_killable:
            min_distance_killable = min_killable
    if total_can_kill != 0:
        avg_distance_can_kill = avg_distance_can_kill / total_can_kill
    if total_killable != 0:
        avg_distance_killable = avg_distance_killable / total_killable

    # 8. the number of player's tokens that is near death
    player_near_dead = all_near_death(
        player.board, player.player) - all_near_death(original.board, original.player)

    # 9. the number of opponent's tokens that is near death
    opp_near_dead = all_near_death(
        player.board, player.opponent) - all_near_death(original.board, original.opponent)

    heuristics = [opp_dead, player_dead, total_swing,
                  avg_distance_can_kill, avg_distance_killable,
                  min_distance_can_kill, min_distance_killable,
                  player_near_dead, opp_near_dead]
    sum = 0
    for i in range(len(heuristics)):
        sum += player.weights[i]*heuristics[i]
    return sum


def near_death(token, board):
    """
    Returns 1 if a token is near death, 0 otherwise
    death is calculated through swing and slide
    """
    neighbour = board.get_neighbours(token.r, token.q)
    kill_dict = {'r': 's', 'p': 'r', 's': 'p'}

    for neighbour_token in neighbour:
        if neighbour_token.player != token.player:
            # Check potential opponent SLIDE that can kill this token
            if kill_dict[neighbour_token.htype.lower()] == token.htype.lower():
                return 1
            else:
                # Check potential opponent SWING that can kill this token
                swing_neighbour = board.get_neighbours(
                    neighbour_token.r, neighbour_token.q)
                for swing_neighbour_token in swing_neighbour:
                    if kill_dict[neighbour_token.htype.lower()] == token.htype.lower() and \
                            swing_neighbour_token.player != token.player:
                        return 1
    return 0


def all_near_death(board, player):
    """
    Gets the number of player's tokens that is near_death
    """
    score = 0
    for token in board.token_dict[player]:
        score += near_death(token, board)
    return score
