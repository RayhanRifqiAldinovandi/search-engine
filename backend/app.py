import re
from flask import Flask, request, jsonify, make_response, session, redirect
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import mysql.connector
from txtai.embeddings import Embeddings
import threading
import base64
import jwt
import html
import pytz
from datetime import datetime, timedelta
from cryptography.hazmat.primitives import serialization

app = Flask(__name__)

bcrypt = Bcrypt(app)
nltk.download('stopwords')
nltk.download('punkt_tab')
#Use lock to allow multiple request to be received and to prevent simultaneous access to the backend
Lock = threading.Lock()

timezone = pytz.timezone("Asia/Jakarta")

#read the private key that is stored in this folder
prv_key = open('myjwtkey','r').read()
#load and encode the key
key = serialization.load_ssh_private_key(prv_key.encode(),password = b'')

#implement CORS to allow request from other IP's
CORS(app, resources={r"/*": {"origins": "*"}})

#connect to mysql
def connection():
    conn = mysql.connector.connect(
        host = "localhost",
        user = "root",
        password = "",
        database = "search_engine_test"
    )
    return conn

#Instantiate the embeddings class
def getEmbeddings():
    embeddings_lock = threading.Lock()
    with embeddings_lock:
        return Embeddings({"path": "sentence-transformers/nli-mpnet-base-v2", "content": True,"backend":"faiss"})

embeddings = getEmbeddings()

#data indexing which will be run everytime a search is queried
def index_data():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM search_index")
    rows = cursor.fetchall()
    stop_words = set(stopwords.words('english'))


    documents = []
    for row in rows:
        text = row[2] + " " + row[3]
        text = re.sub(r'[^\w\s]', '', text)  # remove punctuation
        tokens = word_tokenize(text.lower())  # tokenize and convert to lowercase
        tokens = [token for token in tokens if token not in stop_words]  # remove stop words
        document = {"id": row[0], "text": " ".join(tokens)}
        documents.append(document)

    embeddings.index(documents)
    cursor.close()
    conn.close()

#Creates a JWT token that stores information about the currently logged in user
def createJWT(username,department,role):
    payload = {
        "username": username,
        "department":department,
        "role":role,
        "exp": datetime.now(datetime.UTC) + timedelta(minutes=1440)
    }
    
    #encodes the created JWT token and returns it to frontend
    token = jwt.encode(payload= payload,key=key,algorithm='RS256')

    return token


def get_original_data(ids):
    #lock the process to one request each
    with Lock:
        index_data()
        conn = connection()
        cursor = conn.cursor()
        placeholders = ', '.join(['%s'] * len(ids))
        query = "SELECT * FROM search_index WHERE id IN ({})".format(placeholders)
        cursor.execute(query, ids)
        #fetch all the data
        rows = cursor.fetchall()
        #create a dictionary
        data_dict = {}
        for row in rows:
            gdrive_link = f"https://drive.google.com/thumbnail?id={row[4]}"
            type = row[8]
            data = {"id": row[0], 
                 "url": row[1], 
                 "title":row[2],
                 "description":row[3],
                 "video_link":gdrive_link,
                 #image will use 
                 "image": base64.b64encode(row[5]).decode('utf-8') if row[5] is not None else None,
                 "department":row[6],
                 "author":row[7],
                 "type":type
                 }
            data_dict[str(row[0])] = data  # Convert ID to string
        cursor.close()
        conn.close()
        return [data_dict[str(id)] for id in ids]


@app.route('/register',methods = ['POST'])
def register():
    #Get the data from a JSON request body
    data = request.get_json()
    conn = connection()
    username = data.get('username')
    email = data.get('email')
    password =  bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    department = data.get('department')
    role = data.get('role')
    cursor = conn.cursor()
    #check if user already exist
    query = "SELECT * FROM user WHERE username = %s OR email = %s"
    cursor.execute(query,(username,email))
    result = cursor.fetchone()
    if result:
        return jsonify({"exists": True, "message": "User sudah ada"}),500
    else:
        query = "INSERT INTO user (username,password,email,department,role) VALUES (%s,%s,%s,%s,%s)"
        cursor.execute(query,(username,password,email,department,role))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"Success":True,"message":"User berhasil didaftarkan"}),200

@app.route("/logout")
def logout():
    # Clear the session
    session.clear()
    token = request.headers.get('Authorization')
    payload = jwt.decode(token, options={"verify_signature":False})
    #Updates the expiration time of the JWT token from 24 Hours to just 1 second
    payload['exp'] = datetime.now(datetime.UTC) + timedelta(seconds=1)
    token = jwt.encode(payload,key,algorithm='RS256')
    session.clear()  
    return redirect("/")

@app.route('/input-data',methods = ['POST'])
def insertData():
    conn = connection()
    cursor = conn.cursor()
    url = html.escape(request.form['url'])
    title = html.escape(request.form['title'])
    description = html.escape(request.form['description'])
    video_id = html.escape(request.form['video_id'])
    image = request.files.get('image')
    department = html.escape(request.form['department'])
    author = html.escape(request.form['author'])
    type = html.escape(request.form['type'])
    created_at = datetime.now(timezone)

    if image is None:
        image_blob = None
    else:
        print(image.content_type)
        image_blob = image.read()


    query = "INSERT INTO search_index (url,title,description,video_id,image,department,author,type,created_at) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    val = (url,title,description,video_id,image_blob,department,author,type,created_at)

    cursor.execute(query,val)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Data inserted successfully"}), 200 

@app.route('/delete-data', methods=['DELETE'])
def deleteData():
    conn = connection()
    cursor = conn.cursor()
    data = request.get_json()
    id_number = data.get('id')
    query = "DELETE FROM search_index WHERE id = %s"
    cursor.execute(query,(id_number,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"Message":"Data Berhasil Dihapus"}) 

@app.route('/update-data', methods=['PUT'])
def updateData():
    conn = connection()
    cursor = conn.cursor()
    id_number = request.form['id']
    url = html.escape(request.form['url'])
    title = html.escape(request.form['title'])
    description = html.escape(request.form['description'])
    video_id = html.escape(request.form['video_id'])
    image = request.files.get('image')
    department = html.escape(request.form['department'])
    author = html.escape(request.form['author'])
    type = html.escape(request.form['type'])

    if image is None:
        image_blob = None
    else:
        print(image.content_type)
        image_blob = image.read()

    query = "UPDATE search_index SET url = %s, title = %s, description = %s, video_id = %s, image = %s, department = %s, author = %s, type = %s WHERE id = %s"
    val = (url,title,description,video_id,image_blob,department,author,type,id_number)

    cursor.execute(query,(val))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"Message":"Data Berhasil Diupdate"}),200
    


@app.route('/login',methods = ['POST'])
def login():
    conn = connection()
    cursor = conn.cursor()
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    query = "SELECT * FROM user WHERE username = %s"
    val = (username,)
    cursor.execute(query,val)
    result = cursor.fetchone()
    if result:
        if bcrypt.check_password_hash(result[2],password):
            token = createJWT(username,result[3],result[5])
            return jsonify({"Success":True, "token":token})
    else:
        return jsonify({"Not Exist": False, "message": "Username atau email salah"}),500

@app.route('/search', methods=['GET'])
def search():
    try:
        # Get the search term from the request
        query = request.args.get('term')
        
        # Validate that a search term is provided
        if not query:
            return jsonify({"error": "Search term is required"}), 400

        # Update the index before searching

        # Perform the search
        results = embeddings.search(query, limit = 500)

        # Check if results were found
        if not results:
            return jsonify({"message": "No results found"}), 404

        # Get the original data for the matching documents
        ids = [result['id'] for result in results]
        original_data = get_original_data(ids)

        # Merge the original data with the search results
        results = [{**result, **data} for result, data in zip(results, original_data)]

        # Return the search results
        return jsonify(results)
    except mysql.connector.Error as e:
        return jsonify({'error': 'Database error: {}'.format(e)}), 500
     


#####Admin Data View######

@app.route('/admin-data',methods=['GET'])
def adminDataView():
    conn = connection()
    cursor = conn.cursor()
    query = "SELECT * FROM search_index"
    cursor.execute(query)
    result = cursor.fetchall()
    dict_data = []
    for r in result:
        gdrive_link = f"https://drive.google.com/thumbnail?id={r[4]}"
        type = r[8]
        data = {"id": r[0], 
                 "url": r[1], 
                 "title":r[2],
                 "description":r[3],
                 "video_link":gdrive_link,
                 #image will use 
                #  "image": video_link if type == "video" else base64.b64encode(r[5]).decode('utf-8') if r[5] is not None else None,
                 "department":r[6],
                 "author":r[7],
                 "type":type,
                 "created_at":r[8]
                 }
        dict_data.append(data)
    return jsonify(dict_data)




if __name__ == '__main__':
    index_data()
    app.run(host='0.0.0.0', port=5000,debug=True)
