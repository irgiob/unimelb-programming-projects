import pandas as pd
import textdistance as td
import numpy as np

##### PREPROCESSING #######

def pre_processing():
    # load csv files into dataframes (and drop columns that are not needed)
    df_abt = pd.read_csv("abt.csv", encoding="ISO-8859-1")[['idABT','name']]
    df_buy = pd.read_csv("buy.csv", encoding="ISO-8859-1")[['idBuy','name','manufacturer']]

    # combine 'Name' and 'Manufacturer' columns
    df_buy['name'] = df_buy.apply(lambda row: str(row['name']) + " " + str(row['manufacturer']) \
        if row['manufacturer'] != np.nan else row['manufacturer'], axis=1)

    # fill empty cells with unknown (each manufacturer will become a block)
    # 'unknown' block is used to sort products that do not have an identifiable manufacturer
    df_buy['manufacturer'] = df_buy['manufacturer'].fillna('unknown')

    # simplify manufacturer name to only use first word in said name (makes similarity match more likely)
    df_buy['manufacturer'] = df_buy['manufacturer'].apply(lambda x: x.split(' ')[0])

    # convert everything to lowercase
    df_abt = df_abt.apply(lambda x: x.astype(str).str.lower())
    df_buy = df_buy.apply(lambda x: x.astype(str).str.lower())

    return df_abt, df_buy

##### BLOCKING ######

def blocking(df_abt, df_buy, scorer, threshold):
    # create list of blocks (from manufacturer names) and new DataFrames to store output
    blocks = list(set(df_buy['manufacturer']))
    blocks_abt = pd.DataFrame(columns= ['block_key', 'product_id'])
    blocks_buy = pd.DataFrame(columns= ['block_key', 'product_id'])

    for index, row in df_abt.iterrows():
        no_block = True
        # compare each block string with each word in the product string and get similarity score
        for key in blocks:
            sim_list = []
            for word in row['name'].split(' '):
                sim_list.append(scorer(word, key))
            # if a word in the product string is similar enough to a block key, assigned the product to that key
            if max(sim_list) > threshold:
                blocks_abt = blocks_abt.append({'block_key': key, 'product_id': row['idABT']}, ignore_index=True)
                no_block = False
        # if the product string was not similar enough to any block key, assign it to the 'unknown' block
        if no_block:
            blocks_abt = blocks_abt.append({'block_key': 'unknown', 'product_id': row['idABT']}, ignore_index=True)
    
    for index, row in df_buy.iterrows():
        no_block = True
        # compare each block string with each word in the product string and get similarity score
        for key in blocks:
            sim_list = []
            for word in row['name'].split(' '): 
                sim_list.append(scorer(word, key))
            # if a word in the product string is similar enough to a block key, assigned the product to that key
            if max(sim_list) > threshold:
                blocks_buy = blocks_buy.append({'block_key': key, 'product_id': row['idBuy']}, ignore_index=True)
                no_block = False
        # if the product string was not similar enough to any block key, assign it to the 'unknown' block
        if no_block:
            blocks_buy = blocks_buy.append({'block_key': 'unknown', 'product_id': row['idBuy']}, ignore_index=True)

    # export DataFrames to csv
    blocks_abt.to_csv('abt_blocks.csv', index=False)
    blocks_buy.to_csv('buy_blocks.csv', index=False)

    return blocks_abt, blocks_buy

if __name__ == "__main__":
    # values to tweak
    threshold = 0.85
    scorer = td.jaro_winkler.normalized_similarity

    # funtion pipeline
    df_abt, df_buy = pre_processing()
    blocks_abt, blocks_buy = blocking(df_abt, df_buy, scorer, threshold)