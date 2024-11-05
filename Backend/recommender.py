import json
import pandas as pd
import numpy as np
import spacy
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

def recommender(id,data):

    df = pd.json_normalize(data)
    data = pd.DataFrame(df[['videoID','title']])    
    # nlp = spacy.load(r'C:\Users\patil\AppData\Roaming\Python\Python311\site-packages\en_core_web_sm\en_core_web_sm-3.7.1')
    nlp = spacy.load('en_core_web_sm')

    def preprocess(text):
        exclude = string.punctuation
        result = []
        text = text.translate(str.maketrans('','',exclude))
        for token in nlp(text):
            if token.pos_ not in {'NUM', 'ADP', 'CCONJ', 'PUNCT', 'SYM', 'X'} and token.text.lower() not in {'a','is','tutorial','beginners'}:
                result.append(token.text)
        return ' '.join(result)        

    data['preprocess_title'] = data.title.apply(preprocess)
    
    tfidf = TfidfVectorizer()
    vec_matrix = tfidf.fit_transform(data.preprocess_title) 
    data['vec_data'] = list(vec_matrix.toarray())
    
    X = np.array(data['vec_data'].tolist())
    cosine_sim = linear_kernel(X, X)
    indices = pd.Series(df.index, index=df['videoID']).drop_duplicates()

    def get_recommendations(videoID, cosine_sim=cosine_sim):
        idx = indices[videoID]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[0:15]
        video_indices = [i[0] for i in sim_scores]
        ID = df['videoID'].iloc[video_indices].tolist()
        title = df['title'].iloc[video_indices].tolist()
        result = list()
        for i in range(len(ID)):
            result.append({"videoID":ID[i],"title":title[i]})
        return result

    # get_recommendations('BGTx91t8q50')

    return json.dumps({"message": "Got recommendations !","result" : get_recommendations(id)})