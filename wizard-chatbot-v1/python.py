import requests
url = 'https://maa63b24v2.execute-api.us-east-1.amazonaws.com/Stage/wizard-conversation'
my_object = {'data': {'inputs': {'text': 'Who are you?'}}}
response = requests.post(url, my_object)
print(response.text)