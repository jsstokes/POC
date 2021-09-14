from pymongo import MongoClient
import sys
import os

docsToGet = 5
# print("Args:", sys.argv)
if (len(sys.argv) > 1):
    docsToGet = int(sys.argv[1])

# else: 
#     print("Using default value of xxxxx");
URI         = os.getenv('URI',default='mongodb://127.0.0.1:27017')
DATABASE    = os.getenv('DATABASE',default='acxiom')
COLLECTION  = os.getenv('COLLECTION',default='testdata')
# print("URI:", URI, "DATABASE:", DATABASE,"COLLECTION:",COLLECTION)
client      = MongoClient(URI)
query = [
    {
      '$sample': {
        'size': docsToGet
      }
    }, {
      '$project': {
        '_id': 1
      }
    }
  ]

col = client[DATABASE][COLLECTION]
# Hard coded db and collection names
# for doc in client.acxiom.testdata.aggregate(query):

# Using env vars for both instead
for doc in col.aggregate(query):
    # print (doc)
    print (doc['_id'])

