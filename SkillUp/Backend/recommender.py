import json
import pandas as pd
import numpy as np
import spacy
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

def recommender(id):

    df = pd.json_normalize(json.load(open('data.json')))
    data = pd.DataFrame(df[['videoID','title','channelID']])    
    nlp = spacy.load(r'C:\Users\patil\AppData\Roaming\Python\Python311\site-packages\en_core_web_sm\en_core_web_sm-3.7.1')

    def preprocess(text):
        exclude = string.punctuation
        result = []
        text = text.translate(str.maketrans('','',exclude))
        for token in nlp(text):
            if token.pos_ not in {'NUM', 'ADP', 'CCONJ', 'PUNCT', 'SYM', 'X'} and token.text.lower() not in {'a','is','tutorial','beginners'}:
                result.append(token.text)
        return ' '.join(result)        

    data['preprocess_title'] = data.title.apply(preprocess)
    data['merged'] = data['preprocess_title'].astype(str) + ' ' + data['channelID'].astype(str)
    
    tfidf = TfidfVectorizer()
    vec_matrix = tfidf.fit_transform(data.merged) 
    data['vec_data'] = list(vec_matrix.toarray())
    
    X = np.array(data['vec_data'].tolist())
    cosine_sim = linear_kernel(X, X)
    indices = pd.Series(df.index, index=df['videoID']).drop_duplicates()

    def get_recommendations(videoID, cosine_sim=cosine_sim):
        idx = indices[videoID]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:11]
        video_indices = [i[0] for i in sim_scores]
        return df['videoID'].iloc[video_indices].tolist()

    # get_recommendations('BGTx91t8q50')

    return {"message": "Hello World !","result" : get_recommendations(id)}