# TODO: add UI for countdown etc.
# TODO: make the windows notification more like the one from the chrome extension?

import time
import os

import webbrowser
import winsound
import plyer

# interval in minutes
interval = 20
##interval = 5

# Add 1 minute to accomodate for break time
interval += 1


# length of a minute in seconds (for speedy debugging)
minute = 60
##minute = 1

# file paths
##folder_path = "C:/Users/joelm/AppData/Local/Google/Chrome/"
##"User Data/Default/Extensions/eeeningnfkaonkonalpcicgemnnijjhn/0.0.1.6_0/"
folder_path = "C:/Users/joelm/Desktop/0.0.1.6_0/"

page = "unreads.html"
sound_mp3 = "snds/default.mp3"
sound_wav = "snds/default.wav"
##icon = "icon_128_noti_XWm_icon.ico"
icon = "eye_of_sauron_tnT_icon.ico"

page_path = os.path.join(folder_path, page)
page_path_abs = os.path.abspath(page_path)

icon_path = os.path.join(folder_path, icon)
icon_path_abs = os.path.abspath(icon_path)

# whether to popup the browser window
autoraise = False


def notify():
    # open page
    webbrowser.open(page_path_abs, autoraise=autoraise)

    # send windows notification (toast)
    plyer.notification.notify(title="Take a break!",
                              message="Blink your eyes, move them around, "
                                      "and look at a distant "
                                      "object for 20 seconds.",
                              app_name='Eye Break',
                              app_icon=icon_path_abs)

    # play sound
    sound_path = os.path.join(folder_path, sound_wav)
    sound_path_abs = os.path.abspath(sound_path)

    winsound.PlaySound(sound_path_abs, winsound.SND_FILENAME)


def pre_notify():
    plyer.notification.notify(title="Eye break in 1 minute",
                              message='Take an eye break',
                              app_name='Eye Break',
                              app_icon=icon_path_abs)


# mainloop
    
##notify()
while True:
    # count down if interval is appropriate, otherwise just wait
    if type(interval) == int and interval > 1:
        for i in range(interval, 0, -1):
            if i == 1:
                pre_notify()
            
            print(i, end=",", flush=True)
            time.sleep(minute)
    else:
        time.sleep(interval*minute)
        
    print("\nHave a break have a KitKat ®")
    notify()
