import json
import pickle
import os
from flask.json import jsonify
from flask import Flask, request
from flask.templating import render_template

app = Flask(__name__)

artist_files = os.listdir('collection')
# ['albums'][0]['tracks'][0]['embed_content']
print(artist_files)
# @app.route('/')
# def index():
#     return render_template('index.html')


# @app.route('/data')
# def data():

#     # GET request
#     if request.method == 'GET':

#         file = getArtistData('Tatiana Manois')
#         return jsonify(file)


# if __name__ == '__main__':
#     app.run(debug=True)
