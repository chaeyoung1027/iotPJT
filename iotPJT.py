import requests
from sense_hat import SenseHat
import time

# Initialize Sense HAT
sense = SenseHat()

# Firebase Realtime Database URLs
LED_URL = 'httpsmyweb-dad12-default-rtdb.firebaseio.comled.json'
TEMP_URL = 'httpsmyweb-dad12-default-rtdb.firebaseio.comtemperature.json'

try
    while True
        # 1. Get LED status from Firebase and update LED matrix
        response = requests.get(LED_URL)
        if response.status_code == 200
            message = response.json()
            if message['led'] == 1
                sense.clear(255, 0, 0)  # Turn on red light
            else
                sense.clear()  # Turn off LEDs
        else
            sense.show_message(Error, scroll_speed=0.02, text_colour=[255, 0, 0])

        # 2. Read temperature and send to Firebase
        temperature = round(sense.get_temperature(), 2)
        print(fTemperature  {temperature} )
        temp_response = requests.put(TEMP_URL, json=temperature)
        if temp_response.status_code != 200
            print(Failed to send temperature to Firebase.)

        time.sleep(3)  # Wait 3 seconds before next iteration

except KeyboardInterrupt
    print(Program ended)
    sense.clear()

