from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
import requests
import json

app = Flask(__name__)


@app.route("/")
def hello():
    return "Welcome to KaDO"


@app.route("/bot", methods=['POST'])
def sms_reply():
    userPhoneNumber = request.values.get('From', '')
    incoming_msg = request.values.get('Body', '')
    resp = MessagingResponse()
    msg = resp.message()
    responded = False
    if '$help' in incoming_msg:
        msg.body(
            'Hello! Welcome to KāDO!\nTo help you get started, here are a list of commands: \n\n$reg (Username) - Registers your username\n\n$add (Message) - Adds a note card\n\n$del (Card Number) - Deletes a note card\n\n$list - Lists all note cards \n\nVisit https://kado-76995.web.app to see your cards!')
        responded = True
    if '$reg' in incoming_msg:
        username = str(incoming_msg)
        username = username.replace('$reg', '')
        username = username.strip()

        headers = {'Content-Type': 'application/json'}
        r = requests.post(
            'https://us-central1-kado-76995.cloudfunctions.net/registerUser',
            json={'data': {'deviceId': userPhoneNumber.lower(), 'username': username}}, headers=headers)
        if r.status_code == 442:
            msg.body('Registered!')

        elif r.status_code == 441:
            msg.body('Changed Username!')

        elif r.status_code == 440:
            msg.body(
                'This username is already registered. Please try another username.')
        else:
            msg.body('Please enter a valid username. \n(e.g. $reg Kado)')
        responded = True

    if '$add' in incoming_msg:
        userSentence = str(incoming_msg)
        userSentence = userSentence.replace('$add', '')
        headers = {'Content-Type': 'application/json'}
        if len(userSentence) >= 256:
            msg.body(
                'Unable to send characters more than 256 characters. Please try a smaller message.')
        r = requests.post(
            'https://us-central1-kado-76995.cloudfunctions.net/getUsername', json={'data': {'deviceId': userPhoneNumber}})
        print(r.text)
        if r.status_code == 443:
            msg.body(
                "This device is currently unregistered. Please register with the $reg command or see $help for more commands.")
        elif r.status_code == 445:
            userData = json.loads(r.text)
            r2 = requests.post(
                'https://us-central1-kado-76995.cloudfunctions.net/addCard',
                json={'data': {'msg': userSentence, 'author': userData['username']}}, headers=headers)
            if r2.status_code == 200:
                msg.body('Card Added with Text: ' + userSentence)
            else:
                msg.body(
                    'Please enter a valid username. \n(e.g. $add I love Kado!)')
        responded = True
    if '$del' in incoming_msg:
        cardID = str(incoming_msg)
        cardID = cardID.replace('$del ', '')
        cardID = int(cardID)
        headers = {'Content-Type': 'application/json'}
        r = requests.post(
            'https://us-central1-kado-76995.cloudfunctions.net/getUsername', json={'data': {'deviceId': userPhoneNumber}})

        if r.status_code == 443:
            msg.body(
                "This device is currently unregistered. Please register with the $reg command or see $help for more commands.")
        if r.status_code == 445:
            r2 = requests.post(
                'https://us-central1-kado-76995.cloudfunctions.net/deleteCard',
                json={'data': {'id': cardID}}, headers=headers)
            print(r2.text)
            msg.body("Deleted Card: " + str(cardID))
        responded = True
    if '$list' in incoming_msg:
        r = requests.get(
            'https://us-central1-kado-76995.cloudfunctions.net/getAllCards')

        # Format:
        # Card 1:
        #  Hello There - Obi Wan Kenobi
        finalStr = ''
        msgArray = json.loads(r.text)
        for i in range(len(msgArray)):
            data = msgArray[i]
            finalStr += 'Card ' + str(data["id"]) + ': \n'
            finalStr += f'{data["msg"]}  ({data["author"]})'
            finalStr += '\n\n'

        msg.body(finalStr)
        responded = True

    return str(resp)


if __name__ == "__main__":
    app.run(debug=True)
