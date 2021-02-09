import json
import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
from urllib.parse import urljoin
import matplotlib.pyplot as plt
import numpy as np

def task1(source, seed_link):
    # crawl seed url
    seed_url = source + seed_link
    page = requests.get(seed_url)
    soup = BeautifulSoup(page.text, 'html.parser')

    # initialize visited dict and add seed url
    visited = {}; 
    visited[seed_url] = soup.h1.find(text=True)

    # scrape seed url and initialize urls to visit
    links = soup.findAll('a')
    to_visit = [urljoin(seed_url, link['href']) for link in links]

    while (to_visit): 
        # crawl unvisited urls while still unvisited
        link = to_visit.pop(0)
        page = requests.get(link)
        soup = BeautifulSoup(page.text, 'html.parser')
        
        # scrape for headline and new unvisited urls
        visited[link] = soup.h1.find(text=True)
        new_links = soup.findAll('a')
        for new_link in new_links :
            new_url = urljoin(link, new_link['href'])
            if new_url not in visited and new_url not in to_visit:
                to_visit.append(new_url)

    # convert visited dict into dataframe, then export & return
    visited.pop(seed_url, None)
    df = pd.DataFrame(visited.items(), columns=['url','headline'])

    df.to_csv('task1.csv', index=False)
    return df

def task2(df, team_data):
    # create two new columns for team and score
    df['team'] = df['score'] = ""

    for index, row in df.iterrows():
        # parse data from url
        page = requests.get(row['url'])
        soup = BeautifulSoup(page.text, 'html.parser')

        # combine headline and all text into single string
        text = row['headline'] + " "
        text += " ".join([x.findAll(text=True)[0] for x in soup.findAll('p')])

        # identify team name and largest score
        team = re.search("|".join([x['name'] for x in team_data]), text)
        score = max_score(re.findall(" \d{1,3}-\d{1,3}",text))

        # insert team name & score in dataframe, or delete if none
        if team and score:
            df.at[index,'team'] = team[0]
            df.at[index,'score'] = score
        else:
            df.drop(index, inplace=True)

    # export and return new dataframe
    df.to_csv('task2.csv', index=False)
    return df

def task3(df):
    # create new column and fill it using game difference values
    df['game_difference'] = np.nan
    for index, row in df.iterrows():
        scores = [int(x) for x in row['score'].split('-')]
        df.at[index, 'game_difference'] = abs(np.diff(scores)[0])
    
    # groupby dataframe to show average game difference per team
    df = df[['team','game_difference']].groupby(['team']).mean()
    df.columns = ['avg_game_difference']
    df.reset_index(level=0, inplace=True)

    # export new dataframe
    df.to_csv('task3.csv', index=False)
    return df

def task4(df, n = 5):
    # modify dataframe to show frequency of each team in articles
    df = df[['team','score']].groupby(['team']).count()
    df.columns = ['number of articles']
    df.reset_index(level=0, inplace=True)
    
    # create copy for return
    df_out = df.copy()
    df = df.nlargest(n, 'number of articles')
    
    # plot and save data to image
    df.plot(kind='bar', x='team', y='number of articles')
    plt.tight_layout()
    plt.savefig('task4.png')
    return df_out

def task5(df1, df2):
    # merge dataframes from task 4 and 5
    df = df1.merge(df2)

    # plot and save data to image
    df.plot(kind='bar', x='team', y=['number of articles','avg_game_difference'])
    plt.tight_layout()
    plt.savefig('task5.png')

# identifies the largest score in a list of scores
def max_score(score_list):
    max_score = max_index = 0
    if score_list:
        for i in range(len(score_list)):
            total_score = sum([int(x) for x in score_list[i].split('-')])
            if total_score > max_score:
                max_index = i
                max_score = total_score
    else:
        return None
    return score_list[max_index]

source =  "http://comp20008-jh.eng.unimelb.edu.au:9889/"
seed_link = "main/"
json_file = "rugby.json"

with open(json_file) as j_file:
    team_data = json.load(j_file)['teams']

urls = task1(source, seed_link)
game_data = task2(urls, team_data)
game_difference = task3(game_data.copy())
team_frequency = task4(game_data.copy())
task5(game_difference, team_frequency)