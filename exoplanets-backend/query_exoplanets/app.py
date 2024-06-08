import json
import requests

def lambda_handler(event, context):
    params = json.loads(event['body'])
    response = construct_query(params)

    return {
        "statusCode": 200,
        "headers": {
          "Access-Control-Allow-Origin": "*"   
        },
        "body": json.dumps(response.text)
    }


def construct_query(params):
    categories = params["categories"]
    table = params["table"]
    flag = params["flag"]
    filters = params["filters"]
    i = 0
    try:
        base_link = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+"
        for category in categories:
            base_link += category
            if (i < len(categories)-1):
                    base_link += ","
                    i+=1
        base_link += "+from+"
        base_link += table
        base_link += "+where+"
        base_link += flag
        base_link += "+"
        for filter in filters:
            base_link += filter
            base_link += "+"
        base_link += "&format=json"
        response = requests.get(base_link)
    except Exception as err:
        response = err
    return response


#"https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_bmasse,sy_dist+from+pscomppars+where+sy_dist+<+=+10+order+by+sy_dist+desc&format=json"