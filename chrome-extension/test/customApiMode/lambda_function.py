# -*- coding: utf-8 -*-
import json
import jieba
from collections import Counter 

def response_content(status, raw):
    return {
    "statusCode": status,
    "headers": {
        "Content-Type": "application/json" 
    },
    "body": json.dumps(raw),
    "isBase64Encoded":  False
    } 
def lambda_handler(event, context):
    '''
    in_ = {
        "content": "text...",
        "ignoreCharsStrg": ""
    } 
    '''
    in_=json.loads(event["body"])
    
    strgs_gen = jieba.cut(in_["content"], cut_all=True)
    
    data = Counter(list(strgs_gen))
    print(data)
    return response_content(200,{ "data": data });
    
#lambda_handler("","")