import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn import neighbors
from sklearn import tree
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def data_preprocessing():
    # load data
    world = pd.read_csv("world.csv")
    life = pd.read_csv("life.csv")[['Country Code', 'Life expectancy at birth (years)']]
    df = pd.merge(world,life,left_on="Country Code",right_on="Country Code").sort_values('Country Code')
    df = df.replace("..",np.nan)
    
    # split data
    data = df.iloc[:,3:23]
    classlabel = df['Life expectancy at birth (years)']
    X_train, X_test, y_train, y_test = train_test_split(data,classlabel, train_size=0.7, random_state=200)

    # median imputation and scaling
    median_values = X_train.median()
    X_train = X_train.fillna(median_values)
    X_test = X_test.fillna(median_values)
    scalar = preprocessing.StandardScaler().fit(X_train)
    X_train = scalar.transform(X_train)
    X_test = scalar.transform(X_test)

    # export data imputation statistics to csv
    imputation_stats = pd.DataFrame(median_values).reset_index()
    imputation_stats.columns = ['feature','median']
    imputation_stats['mean'] = scalar.mean_
    imputation_stats['variance'] = scalar.var_
    imputation_stats = imputation_stats.round(3)
    imputation_stats.to_csv("task2a.csv",index=False)

    # return datasets for training
    return X_train, X_test, y_train, y_test

def tree_run_and_test(X_train, X_test, y_train, y_test):
    dt = tree.DecisionTreeClassifier(max_depth=3, random_state=200)
    dt.fit(X_train,y_train)
    y_pred=dt.predict(X_test)
    print(f'Accuracy of decision tree: {accuracy_score(y_test,y_pred):.3f}')

def knn_run_and_test(X_train, X_test, y_train, y_test, k):
    knn = neighbors.KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train,y_train)
    y_pred = knn.predict(X_test)
    print(f'Accuracy of k-nn (k={k}): {accuracy_score(y_test,y_pred):.3f}')

if __name__ == "__main__":
    X_train, X_test, y_train, y_test = data_preprocessing()
    knn_run_and_test(X_train, X_test, y_train, y_test, 3)
    knn_run_and_test(X_train, X_test, y_train, y_test, 7)
    tree_run_and_test(X_train, X_test, y_train, y_test)