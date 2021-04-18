import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.wordnet import WordNetLemmatizer


def decontracted(phrase):
    # specific
    phrase = re.sub(r"won\'t", "will not", phrase)
    phrase = re.sub(r"can\'t", "can not", phrase)

    # general
    phrase = re.sub(r"n\'t", " not", phrase)
    phrase = re.sub(r"\'re", " are", phrase)
    phrase = re.sub(r"\'s", " is", phrase)
    phrase = re.sub(r"\'d", " would", phrase)
    phrase = re.sub(r"\'ll", " will", phrase)
    phrase = re.sub(r"\'t", " not", phrase)
    phrase = re.sub(r"\'ve", " have", phrase)
    phrase = re.sub(r"\'m", " am", phrase)
    return phrase


def preProcessing(string):

    if not string:
        return None
    else:

        # REMOVING PUNCTUATION
        clean_string = re.sub('\[([^]]+)\]', '', string)
        clean_string = re.sub('\([^)]*\)', '', clean_string)
        clean_string = clean_string.replace('\n', ' ').lower()
        clean_string = re.sub('\w*\d\w*', ' ', clean_string)
        clean_string = re.sub(r'[:;.,_()/\{}"?\!&¬¦ãÃâÂ¢\d]', '', clean_string)

        # DECONTRACTING
        clean_string = decontracted(clean_string)

        # REMOVING STOPWORDS
        # initialising an empty list as container for the cleaned tweet
        _string = []
        # iterating through all words in a list
        for word in clean_string.split():
            # checking if current word is not a stopword
            # also checking if the current word is a hash_tag
            #  also checking if the current word has more than one character
            if word not in stopwords.words('english') and len(word) > 1:
                _string.append(word)
        # return the cleaner string
        clean_string = ' '.join(_string)

        # LEMMATIZATION
        lemmatized_string = []
        lmtzr = WordNetLemmatizer()
        for word in clean_string.split():
            lemmatized_string.append(lmtzr.lemmatize(word, 'v'))
        clean_string = ' '.join(lemmatized_string)

        return clean_string
