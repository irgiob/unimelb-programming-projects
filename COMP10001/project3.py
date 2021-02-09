#V2 (#008) - looks forward 3 turns instead of 2 (LATEST VERSION):
from math import factorial as fac
from itertools import combinations as com
from itertools import product as prod
from random import choice as ran

hand_dict = {}
score_dict = {} 

def comp10001go_play(discard_history, player_no, hand):
    '''This function identifies the best card from a player to discard from 
    their hand (based on the discard pile) to get the highest score possilbe'''
    # turn counting variables
    n_turns = len(discard_history)
    hand_turn = len(discard_history) % 4
    # READD NEXT TURN IF EXPERIMENT FAILS
    '''if hand_turn == 3:
        next_turn = 0
    else:
        next_turn = hand_turn + 1'''
    # removing cards from dict after discard
    for i in hand_dict:
        for card_set in discard_history:
            for card in card_set:
                try:
                    hand_dict[i].remove(card)
                except ValueError:
                    pass
    # collects all hands info in hand dict and combinations of opponents cards
    hand_dict[hand_turn] = hand
    temp_hand_dict = {key: hand_dict[key] for key in hand_dict.keys() - 
                      {hand_turn}}  # add next_turn if code too long
    opponent_cards = [temp_hand_dict[x] for x in temp_hand_dict]
    opponent_comb_list = list(prod(*opponent_cards))
    # returns a random card if first turn (with priority of higher cards)
    if n_turns == 0:
        high_hand = [x for x in hand if not x[0].isdigit() and x[0] != 'A']
        if high_hand:
            return ran(high_hand)
        else:
            return ran(hand)
    # creates playeres deck
    player_deck = [x[player_no] for x in discard_history]
    # print(f'Player {player_no+1}\'s Deck: {player_deck}')
    potential_decks_list = []
    # finds the potential score for each card added
    for card in hand:
        for card_sets in opponent_comb_list:
            # gets sublist of all discarded cards + potential discard
            # program considers potential future cards when scoring
            temp_deck = [x for x in player_deck]
            temp_deck.append(card)
            for pot_card in card_sets:
                temp_deck.append(pot_card)
            card_sublist = []
            for i in range(1, len(temp_deck) + 1):
                card_sublist += [x for x in com(temp_deck, i)]
            score_list = []
            for sublist in card_sublist:
                # EXPERIMENTAL CODE
                if sublist in score_dict:
                    score = score_dict[sublist]
                else:
                    score_dict[sublist] = comp10001go_score_group(sublist)
                    score = score_dict[sublist]
                # EXPERIMENTAL CODE
                if score:
                    score_list.append((score, sublist))
            # calculates which card would lead to the highest increase in score
            potential_decks_list.append((max_score(score_list), card))
    return max(potential_decks_list)[1]

def comp10001go_group(discard_history, player_no):
    '''This function takes in a discard history for a game and finds the best
    groupings of cards for a player to get the highest score possible'''
    # extracts player deck & makes sublists of all combination of cards
    player_deck = [x[player_no] for x in discard_history]
    # print(f'Player {player_no+1}\'s Deck: {player_deck}')
    card_sublist = []
    for i in range(1, len(player_deck) + 1):
        card_sublist += [x for x in com(player_deck, i)]
    # calculates the score of each sublist and saves it to a score list
    score_list = []
    for sublist in card_sublist:
        score = comp10001go_score_group(sublist)
        if score:
            score_list.append((score, sublist))
    # finds & returns the combination of lists that leads to the highest score
    return max_score(score_list)[1]

def max_score(score_list):
    '''This function takes a list of cards and their score, and calculates the
    best combination of cards to get the highest score'''
    score_list = sorted(score_list)[::-1]
    comb_score_list = []  # list that holds every combination of card sets
    for i in score_list:
        # sets initial values of score and set to the iteration in score list
        score = int(i[0])
        output_sets = list(i[1])  # this output list is for the if statements
        output_lists = [list(i[1])]  # this list is for actual output
        # first goes through every positive set from highest to lowest score
        for j in score_list:
            # if the set being checked doesn't have duplicates of cards already 
            # in output, the set is added to the list(s) and score is increased
            if len(set(output_sets + list(j[1]))) \
                == len(output_sets) + len(list(j[1])):
                output_sets += list(j[1])
                output_lists.append(list(j[1]))
                score += int(j[0])
            # if adding the set makes total list length equal to 10, break loop
            if len(output_sets) == len(score_list):  # change to int for speed
                break
        # every combination of cards is added to final list
        comb_score_list.append((score, output_lists))
    # print(f'Highest Score Calculated: {max(comb_score_list)[0]}')
    # returns the set that has the highest score possible
    return max(comb_score_list)

def comp10001go_score_group(cards):
    '''This function takes in a list of cards and returns a score based on 
    if it is a run, N of a kind, or singleton set of cards'''
    score = 0  # inital score variable
    # checks if the card list is a run or a set
    is_run = check_run(cards)
    is_n_kind = is_n_of_kind(cards)
    is_singleton = is_singleton_card(cards)
    if is_run:  # returns score of sum of all numbers of the cards
        for i in is_run:
            score += int(i[0])
    elif is_n_kind:  # returns score of the number times n!
        r_dict = {'0': 10, 'J': 11, 'Q': 12, 'K': 13}
        if is_n_kind[0] in r_dict:
            score = r_dict[is_n_kind[0]] * fac(is_n_kind[1])
        else:
            score = int(is_n_kind[0]) * fac(is_n_kind[1])
    elif is_singleton:
        score = is_singleton
    else:
        return False
    return score

def is_singleton_card(lst):  
    score = 0
    if len(lst) == 1:
        for i in lst:
            if i[0] == 'A':
                score -= 20
            elif i[0] in '0JQK':
                r_dict = {'0': 10, 'J': 11, 'Q': 12, 'K': 13}
                score -= int(r_dict[i[0]])
            else:
                score -= int(i[0])
    return score

def is_n_of_kind(lst):
    '''This function checks if every card number in a list is the same, 
    and returns the number (and the amount of it) if it is'''
    # returns false if list is not valid
    for card in lst:
        if card[0] == 'A':  # N-of-a-kind can't be aces
            return False
    if len(lst) < 2:
        return False
    num_list = [x[0] for x in lst]
    # if list is valid, check if every number is equal
    for i in range(len(num_list) - 1):
        if num_list[i] != num_list[i + 1]:
            return False
    # if every number is equal, return the number and amount of them
    return (num_list[0], len(lst))

def check_run(lst):
    '''This function checks if a list of cards forms a valid run, and
    if it does, return the list of cards (in (number, color) form)'''
    # returns False is list is not valid (less than 3)
    if len(lst) < 3:
        return False
    # seperates ace and non-ace cards into seperate lists
    ace_list = []
    for card in lst:
        if card[0] == 'A':
            ace_list.append(card)
    card_list = [card for card in lst if card[0] != 'A']
    num_list = [card[0] for card in lst if card[0] != 'A']
    # if any numbers are repeating, return False
    if len(num_list) != len(set(num_list)):
        return False
    # converts card lists into (number, color) tuple form
    n_dict = {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
              '9': 9, '0': 10, 'J': 11, 'Q': 12, 'K': 13}
    c_dict = {'H': 'R', 'D': 'R', 'C': 'B', 'S': 'B'}
    card_tup_lst = []
    for card in card_list:
        card_tup = (n_dict[card[0]], c_dict[card[1]])
        card_tup_lst.append(card_tup)
    a_list = []
    for ace in ace_list:
        a_list.append((ace[0], c_dict[ace[1]]))
    # counting & other variables for checking run
    num_count = 1
    color_count = 1
    card_tup_lst = sorted(card_tup_lst)
    len_list = len(card_tup_lst)
    i = 0
    while i < len_list - 1:
        # checks if the numbers are consequtive
        if card_tup_lst[i][0] == card_tup_lst[i + 1][0] - 1:
            num_count += 1
        # checks if there is a gap in the list that can be filled with an ace
        if 0 < card_tup_lst[i + 1][0] - card_tup_lst[i][0] - 1 <= len(a_list):
            # if there is, the ace is inserted as the missing value
            for ace in a_list:
                if card_tup_lst[i][1] != ace[1]:
                    num_count += 1
                    card_tup_lst = card_tup_lst[:i + 1] + \
                        [(card_tup_lst[i][0] + 1, ace[1])] + \
                        card_tup_lst[i + 1:]
                    len_list += 1
                    a_list.remove(ace)
                    break
        # checks if the colors are alternating
        if card_tup_lst[i][1] != card_tup_lst[i + 1][1]:
            color_count += 1
        i += 1
    # if each number is consequtive and each color is alternating, return list
    if num_count == len(lst) and color_count == len(lst):
        return card_tup_lst

'''V1 (#010) - with discard deleting (OLDER VERSION):
from math import factorial as fac
from itertools import combinations as com
from itertools import product as prod
from random import choice as ran

hand_dict = {}

def comp10001go_play(discard_history, player_no, hand):
    '''This function identifies the best card from a player to discard from 
    their hand (based on the discard pile) to get the highest score possilbe'''
    # turn counting variables
    n_turns = len(discard_history)
    hand_turn = len(discard_history) % 4
    if hand_turn == 3:
        next_turn = 0
    else:
        next_turn = hand_turn + 1
    # removing cards from dict after discard
    for i in hand_dict:
        for card_set in discard_history:
            for card in card_set:
                try:
                    hand_dict[i].remove(card)
                except ValueError:
                    pass
    # collects all hands info in hand dict and combinations of opponents cards
    hand_dict[hand_turn] = hand
    temp_hand_dict = {key: hand_dict[key] for key in hand_dict.keys() - 
                      {hand_turn, next_turn}}
    opponent_cards = [temp_hand_dict[x] for x in temp_hand_dict]
    opponent_comb_list = list(prod(*opponent_cards))
    # returns a random card if first turn (with priority of higher cards)
    if n_turns == 0:
        high_hand = [x for x in hand if not x[0].isdigit() and x[0] != 'A']
        if high_hand:
            return ran(high_hand)
        else:
            return ran(hand)
    # creates playeres deck
    player_deck = [x[player_no] for x in discard_history]
    # print(f'Player {player_no+1}\'s Deck: {player_deck}')
    potential_decks_list = []
    # finds the potential score for each card added
    for card in hand:
        for card_sets in opponent_comb_list:
            # gets sublist of all discarded cards + potential discard
            # program considers potential future cards when scoring
            temp_deck = [x for x in player_deck]
            temp_deck.append(card)
            for pot_card in card_sets:
                temp_deck.append(pot_card)
            card_sublist = []
            for i in range(1, len(temp_deck) + 1):
                card_sublist += [x for x in com(temp_deck, i)]
            score_list = []
            for sublist in card_sublist:
                score = comp10001go_score_group(sublist)
                if score:
                    score_list.append((score, sublist))
            # calculates which card would lead to the highest increase in score
            potential_decks_list.append((max_score(score_list), card))
    return max(potential_decks_list)[1]

def comp10001go_group(discard_history, player_no):
    '''This function takes in a discard history for a game and finds the best
    groupings of cards for a player to get the highest score possible'''
    # extracts player deck & makes sublists of all combination of cards
    player_deck = [x[player_no] for x in discard_history]
    # print(f'Player {player_no+1}\'s Deck: {player_deck}')
    card_sublist = []
    for i in range(1, len(player_deck) + 1):
        card_sublist += [x for x in com(player_deck, i)]
    # calculates the score of each sublist and saves it to a score list
    score_list = []
    for sublist in card_sublist:
        score = comp10001go_score_group(sublist)
        if score:
            score_list.append((score, sublist))
    # finds & returns the combination of lists that leads to the highest score
    return max_score(score_list)[1]

def max_score(score_list):
    '''This function takes a list of cards and their score, and calculates the
    best combination of cards to get the highest score'''
    score_list = sorted(score_list)[::-1]
    comb_score_list = []  # list that holds every combination of card sets
    for i in score_list:
        # sets initial values of score and set to the iteration in score list
        score = int(i[0])
        output_sets = list(i[1])  # this output list is for the if statements
        output_lists = [list(i[1])]  # this list is for actual output
        # first goes through every positive set from highest to lowest score
        for j in score_list:
            # if the set being checked doesn't have duplicates of cards already 
            # in output, the set is added to the list(s) and score is increased
            if len(set(output_sets + list(j[1]))) \
                == len(output_sets) + len(list(j[1])):
                output_sets += list(j[1])
                output_lists.append(list(j[1]))
                score += int(j[0])
            # if adding the set makes total list length equal to 10, break loop
            if len(output_sets) == len(score_list):  # change to int for speed
                break
        # every combination of cards is added to final list
        comb_score_list.append((score, output_lists))
    # print(f'Highest Score Calculated: {max(comb_score_list)[0]}')
    # returns the set that has the highest score possible
    return max(comb_score_list)

def comp10001go_score_group(cards):
    '''This function takes in a list of cards and returns a score based on 
    if it is a run, N of a kind, or singleton set of cards'''
    score = 0  # inital score variable
    # checks if the card list is a run or a set
    is_run = check_run(cards)
    is_n_kind = is_n_of_kind(cards)
    is_singleton = is_singleton_card(cards)
    if is_run:  # returns score of sum of all numbers of the cards
        for i in is_run:
            score += int(i[0])
    elif is_n_kind:  # returns score of the number times n!
        r_dict = {'0': 10, 'J': 11, 'Q': 12, 'K': 13}
        if is_n_kind[0] in r_dict:
            score = r_dict[is_n_kind[0]] * fac(is_n_kind[1])
        else:
            score = int(is_n_kind[0]) * fac(is_n_kind[1])
    elif is_singleton:
        score = is_singleton
    else:
        return False
    return score

def is_singleton_card(lst):  
    score = 0
    if len(lst) == 1:
        for i in lst:
            if i[0] == 'A':
                score -= 20
            elif i[0] in '0JQK':
                r_dict = {'0': 10, 'J': 11, 'Q': 12, 'K': 13}
                score -= int(r_dict[i[0]])
            else:
                score -= int(i[0])
    return score

def is_n_of_kind(lst):
    '''This function checks if every card number in a list is the same, 
    and returns the number (and the amount of it) if it is'''
    # returns false if list is not valid
    for card in lst:
        if card[0] == 'A':  # N-of-a-kind can't be aces
            return False
    if len(lst) < 2:
        return False
    num_list = [x[0] for x in lst]
    # if list is valid, check if every number is equal
    for i in range(len(num_list) - 1):
        if num_list[i] != num_list[i + 1]:
            return False
    # if every number is equal, return the number and amount of them
    return (num_list[0], len(lst))

def check_run(lst):
    '''This function checks if a list of cards forms a valid run, and
    if it does, return the list of cards (in (number, color) form)'''
    # returns False is list is not valid (less than 3)
    if len(lst) < 3:
        return False
    # seperates ace and non-ace cards into seperate lists
    ace_list = []
    for card in lst:
        if card[0] == 'A':
            ace_list.append(card)
    card_list = [card for card in lst if card[0] != 'A']
    num_list = [card[0] for card in lst if card[0] != 'A']
    # if any numbers are repeating, return False
    if len(num_list) != len(set(num_list)):
        return False
    # converts card lists into (number, color) tuple form
    n_dict = {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, 
              '9': 9, '0': 10, 'J': 11, 'Q': 12, 'K': 13}
    c_dict = {'H': 'R', 'D': 'R', 'C': 'B', 'S': 'B'}
    card_tup_lst = []
    for card in card_list:
        card_tup = (n_dict[card[0]], c_dict[card[1]])
        card_tup_lst.append(card_tup)
    a_list = []
    for ace in ace_list:
        a_list.append((ace[0], c_dict[ace[1]]))
    # counting & other variables for checking run
    num_count = 1
    color_count = 1
    card_tup_lst = sorted(card_tup_lst)
    len_list = len(card_tup_lst)
    i = 0
    while i < len_list - 1:
        # checks if the numbers are consequtive
        if card_tup_lst[i][0] == card_tup_lst[i + 1][0] - 1:
            num_count += 1
        # checks if there is a gap in the list that can be filled with an ace
        if 0 < card_tup_lst[i + 1][0] - card_tup_lst[i][0] - 1 <= len(a_list):
            # if there is, the ace is inserted as the missing value
            for ace in a_list:
                if card_tup_lst[i][1] != ace[1]:
                    num_count += 1
                    card_tup_lst = card_tup_lst[:i + 1] + \
                        [(card_tup_lst[i][0] + 1, ace[1])] + \
                        card_tup_lst[i + 1:]
                    len_list += 1
                    a_list.remove(ace)
                    break
        # checks if the colors are alternating
        if card_tup_lst[i][1] != card_tup_lst[i + 1][1]:
            color_count += 1
        i += 1
    # if each number is consequtive and each color is alternating, return list
    if num_count == len(lst) and color_count == len(lst):
        return card_tup_lst'''