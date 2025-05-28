import requests
from sense_hat import SenseHat
import time
import datetime

# Initialize Sense HAT
sense = SenseHat()

# Firebase Realtime Database URLs
LED_URL = 'https://myweb-dad12-default-rtdb.firebaseio.com/led.json'
TEMP_URL = 'https://myweb-dad12-default-rtdb.firebaseio.com/temperature.json'
HUMIDITY_URL = 'https://myweb-dad12-default-rtdb.firebaseio.com/humidity.json'
MESSAGES_URL = 'https://myweb-dad12-default-rtdb.firebaseio.com/messages.json'
GYRO_URL = 'https://myweb-dad12-default-rtdb.firebaseio.com/gyroscope.json'
ACCEL_URL = 'https://myweb-dad12-default-rtdb.firebaseio.com/acceleration.json'
TIME_URL = 'https://myweb-dad12-default-rtdb.firebaseio.com/last_update.json'

# Function to get the latest message from Firebase
def get_latest_message():
    try:
        # Request latest message ordered by timestamp, limit to 1
        url = MESSAGES_URL + '?orderBy=%22timestamp%22&limitToLast=1'
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data:
                for key in data:
                    return data[key]  # Return the entire message data including text and timestamp
        else:
            print("Failed to get message from Firebase. Response Code:", response.status_code)
            print("Error Details:", response.json())
    except Exception as e:
        print("Exception:", e)
    return None

try:
    last_message = None
    while True:
        # 1. Get LED status from Firebase and update LED matrix
        response = requests.get(LED_URL)
        if response.status_code == 200:
            led_status = response.json()

            # Print the LED status to debug
            print(f"LED Status: {led_status}")

            # Ensure that led_status is an integer (if it comes as a string)
            if isinstance(led_status, str):
                led_status = int(led_status)

            if led_status['led'] == 1:
                # Set red background if LED is ON
                sense.clear(255, 0, 0)  # Red background
            else:
                sense.clear()  # Keep black background if LED is OFF
        else:
            sense.show_message("Error", scroll_speed=0.02, text_colour=[255, 0, 0])

        # 2. Read temperature and send to Firebase
        temperature = round(sense.get_temperature(), 2)
        print(f"Temperature : {temperature} ")
        temp_response = requests.put(TEMP_URL, json=temperature)
        if temp_response.status_code != 200:
            print("Failed to send temperature to Firebase.")

        # 3. Read humidity and send to Firebase
        humidity = round(sense.get_humidity(), 2)
        print(f"Humidity : {humidity} ")
        humidity_response = requests.put(HUMIDITY_URL, json=humidity)
        if humidity_response.status_code != 200:
            print("Failed to send humidity to Firebase.")

        # 4. Read gyroscope values (pitch, roll, yaw)
        gyro = sense.get_gyroscope()
        gyro_data = {
            'x': round(gyro['pitch'], 2),
            'y': round(gyro['roll'], 2),
            'z': round(gyro['yaw'], 2)
        }
        print(f"Gyroscope Data : {gyro_data}")
        gyro_response = requests.put(GYRO_URL, json=gyro_data)
        if gyro_response.status_code != 200:
            print("Failed to send gyroscope data to Firebase.")

        # 5. Read acceleration values (x, y, z) using get_accelerometer_raw()
        accel = sense.get_accelerometer_raw()  # Corrected to get accelerometer raw data
        accel_data = {
            'x': round(accel['x'], 2),
            'y': round(accel['y'], 2),
            'z': round(accel['z'], 2)
        }
        print(f"Acceleration Data : {accel_data}")
        accel_response = requests.put(ACCEL_URL, json=accel_data)
        if accel_response.status_code != 200:
            print("Failed to send acceleration data to Firebase.")

        # 6. Get latest message and show if new
        message_data = get_latest_message()  # This will now return the entire message with text and timestamp
        if message_data and message_data != last_message:
            print("New message:", message_data)
            text_message = message_data['text']  # Get the text of the message
            
            text_colour = [0, 0, 0]  # Always black text
            sense.show_message(text_message, scroll_speed=0.1, text_colour=(255,255,0))
            last_message = message_data

        # 7. Record the time of update
        current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"Last update time: {current_time}")
        time_response = requests.put(TIME_URL, json={'last_update': current_time})
        if time_response.status_code != 200:
            print("Failed to send update time to Firebase.")

        time.sleep(5)

except KeyboardInterrupt:
    print("Program ended")
    sense.clear()
