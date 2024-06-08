import json
import requests


def lambda_handler(event, context):
    print(event)
    link = event['body']
    res = get_planet_details(link)
    print(res)

    return {
        "statusCode": 200,
        "headers": {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials" : "true"
        },
        "body": json.dumps(res.text)
    }


def get_planet_details(link):
        try:
            res = requests.get(link)
        except:
            res = "bad"
        return res