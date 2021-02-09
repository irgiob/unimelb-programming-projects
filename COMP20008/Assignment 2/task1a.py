import pandas as pd
import numpy as np
import textdistance as td
from fuzzywuzzy import fuzz, process

##### PREPROCESSING #####

def pre_processing():
    # load csv files into dataframes (and drop columns that are not needed)
    df_abt = pd.read_csv("abt_small.csv", encoding="ISO-8859-1")[['idABT','name']]
    df_buy = pd.read_csv("buy_small.csv", encoding="ISO-8859-1")[['idBuy','name']]

    # convert everything to lowercase
    df_abt = df_abt.apply(lambda x: x.astype(str).str.lower())
    df_buy = df_buy.apply(lambda x: x.astype(str).str.lower())

    return df_abt, df_buy

##### DATA LINGAGE ALGORITHM #####

def match_data(df_abt, df_buy):
    # thresholds
    threshold_phase2 = 0.9
    threshold_phase3 = 0.8

    # variables to store final output and product ids that are already matched
    # each product is assumed to only have one match
    df_abt_buy = pd.DataFrame(columns= ['idAbt', 'idBuy'])
    abt_list = []
    buy_list = []

    # phase 1: low-difficulty data linkage with EXACT matching serial numbers
    # extract serial number from abt product name and find exact match in buy product name
    for index1, row1 in df_abt.iterrows(): 
        serial = row1['name'].split(" - ")[-1]
        for index2, row2 in df_buy.iterrows():
            if serial in row2['name'].replace('-','').replace('/',''):
                if row1['idABT'] not in abt_list and row2['idBuy'] not in buy_list:
                    df_abt_buy = df_abt_buy.append({'idAbt': row1['idABT'], 'idBuy': row2['idBuy']}, ignore_index=True)
                    df_abt = df_abt[df_abt['idABT'] != row1['idABT']]
                    df_buy = df_buy[df_buy['idBuy'] != row2['idBuy']]
                    abt_list.append(row1['idABT'])
                    buy_list.append(row2['idBuy'])

    # phase 2: medium-difficulty data linkage with SIMILAR matching serial numbers
    # extract serial number from abt product name and compare with every word in every buy product name
    # uses jaro-wrinkler edit-distance-based similarity with high threshold to find near identical serial numbers
    df_all = pd.DataFrame(columns= ['idAbt', 'idBuy', 'sim'])

    # get score for each word in each product name for each serial number and sort by similarity
    for index1, row1 in df_abt.iterrows(): 
        serial = row1['name'].split(" - ")[-1]
        for index2, row2 in df_buy.iterrows():
            sim_list = []
            for word in row2['name'].replace('-','').replace('/','').split(' '):
                sim_list.append(td.jaro_winkler.normalized_similarity(serial, word))
            df_all = df_all.append({'idAbt': row1['idABT'], 'idBuy': row2['idBuy'], 'sim': max(sim_list)}, ignore_index=True)
    df_all = df_all.sort_values(by=['sim','idAbt'], ascending=False)

    # remove matches below the threshold and that already have a higher similarity match
    for index, row, in df_all.iterrows():
        if row['sim'] < threshold_phase2:
            break
        if row['idAbt'] not in abt_list and row['idBuy'] not in buy_list:
            df_abt_buy = df_abt_buy.append({'idAbt': row['idAbt'], 'idBuy': row['idBuy']}, ignore_index=True)
            abt_list.append(row['idAbt'])
            buy_list.append(row['idBuy'])

    # phase 3: high-difficulty data linkage with SIMILAR product names
    # compare each abt product name in its entirety with each buy product name
    # uses token-set-ratio similarity with lower threshold to find near identitical product names
    df_all = pd.DataFrame(columns= ['idAbt', 'idBuy', 'sim'])

    # get score for each product name combination and sort by similarity
    for index1, row1 in df_abt.iterrows(): 
        for index2, row2 in df_buy.iterrows():
            sim = fuzz.token_set_ratio(row1['name'], row2['name'])
            df_all = df_all.append({'idAbt': row1['idABT'], 'idBuy': row2['idBuy'], 'sim': sim}, ignore_index=True)
    df_all = df_all.sort_values(by=['sim','idAbt'], ascending=False)

    # remove matches below the threshold and that already have a higher similarity match
    for index, row, in df_all.iterrows():
        if row['sim'] < threshold_phase3*100:
            break
        if row['idAbt'] not in abt_list and row['idBuy'] not in buy_list:
            df_abt_buy = df_abt_buy.append({'idAbt': row['idAbt'], 'idBuy': row['idBuy']}, ignore_index=True)
            abt_list.append(row['idAbt'])
            buy_list.append(row['idBuy'])
    
    # export final output
    df_abt_buy = df_abt_buy.astype(int)
    df_abt_buy.to_csv('task1a.csv', index = False)

    return df_abt_buy           

if __name__ == "__main__":
    # function pipeline
    df_abt, df_buy = pre_processing()
    df_abt_buy = match_data(df_abt, df_buy)