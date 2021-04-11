from flask.json import jsonify
from flask import Flask, request
from flask.templating import render_template

app = Flask(__name__)


@app.route('/')
def index():
    return {'api': 'documentation'}  # remember


@app.route('/data')
def data():
    pass


if __name__ == '__main__':
    app.run(debug=True)
