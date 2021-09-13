from pymongo import MongoClient
import sys

docsToGet = 5
# print("Args:", sys.argv)
if (len(sys.argv) > 1):
    docsToGet = int(sys.argv[1])
# else: 
#     print("Using default value of xxxxx");

client = MongoClient()
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
for doc in client.acxiom.testdata.aggregate(query):
    # print (doc)
    print (doc['_id'])

