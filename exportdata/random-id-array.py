from pymongo import MongoClient
import random
import sys
import json
import getopt

#
# Pring out
def  usage():
  print(
    '''
Valid Options are:
------------------
   -h, --help          Print this message                  
   -e, --entries       Number of entries to create in the outputfile
   -n, --min           Minimum number of IDs to include
   -x, --max           Maximum number of IDs to include
   -o, --output-file   File name to store the entries in (3 char minimum length)
    '''
  )
  # print("")


#
# variables needed from the command line 
#
entriesToGenerate = -1
minIdsPerEntry = -1
maxIdsPerEntry = -1
filename = ""
increment = 1
required = 4

#
# Parse the command line
#
try:
  optlist, args = getopt.getopt(sys.argv[1:], 'e:n:x:o:h',["entries","min","max","output-file"]) 
except getopt.GetoptError as err:
  print(err)  # will print something like "option -a not recognized"
  usage()
  sys.exit(2)

#
# Assign values from the options to the variables
#  - also checking to make sure all required options are specified
#
for o, a in optlist:
  if o in ["-e", "--entries"]:
    entriesToGenerate = int(a)
    required -= 1
  elif o in ["-n","--min"]:
    required -= 1
    minIdsPerEntry = int(a)
  elif o in ["-x","--max"]:
    required -= 1
    maxIdsPerEntry = int(a)
  elif o in ["-o", "--output-file"]:
    required -= 1
    filename = a
  elif o in ["-h","--help"]:
    usage()
    sys.exit(2)
#
# Either error out or give the user feed back on the processing
# that will be done
#
if (required != 0) or (len(filename) < 3):
  print("Missing option required.")
  usage()
  sys.exit(2)
else:
  print("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ")
  print("Number of execution lines/entries:", entriesToGenerate)
  print("min IDs per execution:", minIdsPerEntry)
  print("max IDs per entry:",maxIdsPerEntry)
  print("Entries will be saved in", filename)


outfile = open(filename, "w")
client = MongoClient()
for entry in range(0,entriesToGenerate):
  # Update count on the screen
  print("Writing",entry+1,"of",entriesToGenerate,end='\r') 
  query = [
      {
        '$sample': {
          'size': random.randrange(minIdsPerEntry,maxIdsPerEntry+1,1)
        }
      }, {
        '$project': {
          '_id': 1
        }
      }
    ]
  results = []
  resultString = "\"["
  #
  # Loop through the results and build an array of strings
  # with the _id values
  #
  for doc in client.acxiom.testdata.aggregate(query):
    results.append(doc)
    if len(resultString) > 2:
      resultString += ","
    resultString += "'" + str(doc["_id"]) + "'"
  resultString += "]\"\n"
  outfile.write(resultString)
print("*****  Done!!  *****\n*****  Wrote", entriesToGenerate, "lines to",filename,"*****  \n\n")
outfile.close()
