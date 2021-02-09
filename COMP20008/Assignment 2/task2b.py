import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from scipy.spatial.distance import pdist, squareform
from itertools import combinations

from sklearn import neighbors
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.cluster import KMeans
from sklearn.feature_selection import SelectKBest, SelectFromModel, mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.decomposition import PCA

def VAT(R):
    """

    VAT algorithm adapted from matlab version:
    http://www.ece.mtu.edu/~thavens/code/VAT.m

    Args:
        R (n*n double): Dissimilarity data input
        R (n*D double): vector input (R is converted to sq. Euclidean distance)
    Returns:
        RV (n*n double): VAT-reordered dissimilarity data
        C (n int): Connection indexes of MST in [0,n)
        I (n int): Reordered indexes of R, the input data in [0,n)
    """
        
    R = np.array(R)
    N, M = R.shape
    if N != M:
        R = squareform(pdist(R))
        
    J = list(range(0, N))
    
    y = np.max(R, axis=0)
    i = np.argmax(R, axis=0)
    j = np.argmax(y)
    y = np.max(y)


    I = i[j]
    del J[I]

    y = np.min(R[I,J], axis=0)
    j = np.argmin(R[I,J], axis=0)
    
    I = [I, J[j]]
    J = [e for e in J if e != J[j]]
    
    C = [1,1]
    for r in range(2, N-1):   
        y = np.min(R[I,:][:,J], axis=0)
        i = np.argmin(R[I,:][:,J], axis=0)
        j = np.argmin(y)        
        y = np.min(y)      
        I.extend([J[j]])
        J = [e for e in J if e != J[j]]
        C.extend([i[j]])
    
    y = np.min(R[I,:][:,J], axis=0)
    i = np.argmin(R[I,:][:,J], axis=0)
    
    I.extend(J)
    C.extend(i)
    
    RI = list(range(N))
    for idx, val in enumerate(I):
        RI[val] = idx

    RV = R[I,:][:,I]
    
    return RV.tolist(), C, I

def data_preprocessing():
    # load data
    world = pd.read_csv("world.csv")
    life = pd.read_csv("life.csv")[['Country Code', 'Life expectancy at birth (years)']]
    df = pd.merge(world,life,left_on="Country Code",right_on="Country Code").sort_values('Country Code')
    df = df.replace("..",np.nan)
    
    # split data
    data = df.iloc[:,3:23]
    classlabel = df['Life expectancy at birth (years)']
    X_train, X_test, y_train, y_test = train_test_split(data,classlabel, train_size=0.7)

    # median imputation and scaling
    median_values = X_train.median()
    X_train = X_train.fillna(median_values)
    X_test = X_test.fillna(median_values)
    scalar = preprocessing.StandardScaler().fit(X_train)
    X_train = scalar.transform(X_train)
    X_test = scalar.transform(X_test)

    # return datasets for training
    return X_train, X_test, y_train, y_test

def feature_select_1(X_train,X_test, y_train, y_test):
    # datasets that will be manipulated 
    sets = {'Training': X_train, 'Test': X_test}

    # Use VAT to identify how many clusters to use (3 from heatmap)
    RV, C, I = VAT(sets['Training'])
    x=sns.heatmap(RV,cmap='viridis',xticklabels=False,yticklabels=False)
    x.set(xlabel='Objects', ylabel='Objects')
    plt.savefig('task2bgraph1.png')

    # add cluster feature
    print("### Cluster Labels ###","\n")
    kmean = KMeans(n_clusters=3).fit(sets['Training'])
    for x in sets:
        sets[x] = np.hstack((sets[x],np.array([kmean.predict(sets[x])]).transpose()))
        print(f"Cluster Labels of K-Means Clustering in {x} Set")
        print(pd.DataFrame(sets[x][:,-1]),"\n")
    print(sets['Training'].shape)

    # add interaction term pair features
    print("### Interaction Term Pairs ###","\n")
    for x in sets:
        comb_list = list(combinations(range(sets[x].shape[1]-1),2))
        for comb in comb_list:
            sets[x] = np.hstack((sets[x],np.array([sets[x][:,comb[0]]*sets[x][:,comb[1]]]).transpose()))
        print(f"Interaction Term Pairs for {x} Set")
        print(pd.DataFrame(sets[x][:,21:]),"\n")
    print("")

    # feature selection using mutual information
    print("### Feature Selection (using Mutual Information) ###","\n")
    kbest = SelectKBest(mutual_info_classif,k=4).fit(sets['Training'],y_train)
    print("Columns Selected:",pd.DataFrame(sets['Training']).columns[kbest.get_support()],"\n")
    for x in sets:
        sets[x] = kbest.transform(sets[x])
        print(f"Features Selected using Mutual Information for {x} Set")
        print(pd.DataFrame(sets[x]),"\n")
    print("")

    return knn_run_and_test(sets['Training'], sets['Test'], y_train, y_test)

def feature_select_2(X_train, X_test, y_train, y_test):
    # get first four principled components
    print("### Principled Component Analysis (PCA) ###","\n")
    pca = PCA(n_components=4).fit(X_train)
    
    print("Training Set Before PCA")
    print(pd.DataFrame(X_train))
    X_train = pca.transform(X_train)
    print("Principled Components in Training Set")
    print(pd.DataFrame(X_train),"\n")

    print("Test Set Before PCA")
    print(pd.DataFrame(X_test))
    X_test = pca.transform(X_test)
    print("Principled Components in Test Set")
    print(pd.DataFrame(X_test),"\n")
    print("")

    return knn_run_and_test(X_train, X_test, y_train, y_test)

def feature_select_3(X_train, X_test, y_train, y_test):
    # get first four features of original dataset
    print("### First Four Features ###","\n")
    print("First Four Features of Training Set")
    print(pd.DataFrame(X_train[:,:4]),"\n")
    print("First Four Features of Test Set")
    print(pd.DataFrame(X_test[:,:4]),"\n")
    print("")

    return knn_run_and_test(X_train[:,:4], X_test[:,:4], y_train, y_test)

def knn_run_and_test(X_train, X_test, y_train, y_test):
    knn = neighbors.KNeighborsClassifier(n_neighbors=3)
    knn.fit(X_train,y_train)
    y_pred = knn.predict(X_test)
    return accuracy_score(y_test,y_pred)

if __name__ == "__main__":
    # random state for consistent runs
    np.random.seed(200)

    # print settings for dataframes
    np.set_printoptions(suppress=True)
    pd.set_option('display.max_rows', 8)
    pd.set_option('display.max_columns', 8)
    pd.set_option('display.width', 1000)

    # pre-processing data
    X_train, X_test, y_train, y_test = data_preprocessing()

    # test accuracy for each featuring selection method
    acc1 = feature_select_1(X_train,X_test, y_train, y_test)
    acc2 = feature_select_2(X_train, X_test, y_train, y_test)
    acc3 = feature_select_3(X_train, X_test, y_train, y_test)    

    # print accuracy of each feature selection method
    print('### Accuracy of Each Feature Selection Method ###',"\n")
    print(f'Accuracy of feature engineering: {acc1:.3f}')
    print(f'Accuracy of PCA: {acc2:.3f}')
    print(f'Accuracy of first four features: {acc3:.3f}')