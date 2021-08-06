#!/usr/bin/env python

# TODO: add UI for countdown etc.
# TODO: make the windows notification more like the one from the chrome extension?

import time
import webbrowser
import winsound
from pathlib import Path

import plyer.platforms.win.libs.balloontip

# interval in minutes
interval = 20
# interval = 5

# Add 1 minute to accommodate for break time
interval += 1

# length of a minute in seconds (for speedy debugging)
minute = 60
# minute = 1

# file paths
# folder_path = 'C:/Users/joelm/AppData/Local/Google/Chrome/'
# 'User Data/Default/Extensions/eeeningnfkaonkonalpcicgemnnijjhn/0.0.1.6_0/'
# folder_path = Path.home() / 'Onedrive/Desktop/0.0.1.6_0/'
folder_path = Path() / '0.0.1.6_0/'

page_path = folder_path / 'unreads.html'
snds_folder = folder_path / 'snds/'
sound_path_mp3 = snds_folder / 'default.mp3'
sound_path_wav = snds_folder / 'default.wav'
sound_path = sound_path_wav
# icon = 'icon_128_noti_XWm_icon.ico'
icon_path = folder_path / 'eye_of_sauron_tnT_icon.ico'

# whether to popup the browser window
autoraise = False

notify_at_startup = False


def notify(windows_balloon_tip):
    # open page
    webbrowser.open(str(page_path), autoraise=autoraise)

    # send windows notification (toast)
    windows_balloon_tip.notify(title='Take a break!',
                              message='Blink your eyes, move them around, '
                                      'and look at a distant '
                                      'object for 20 seconds.',
                              app_name='Eye Break',)

    # play sound
    winsound.PlaySound(str(sound_path), winsound.SND_FILENAME)


def pre_notify(windows_balloon_tip):
    windows_balloon_tip.notify(title='Eye break in 1 minute',
                              message='Take an eye break',
                              app_name='Eye Break',)


# mainloop
def main():
    bt = plyer.platforms.win.libs.balloontip(
        title='Eye break reminders started',
        app_name='Eye Break',
        app_icon=str(icon_path)
    )
    
    if notify_at_startup:
        notify(bt)

    while True:
        # count down if interval is appropriate, otherwise just wait
        if type(interval) == int and interval > 1:
            for i in range(interval, 0, -1):
                if i == 1:
                    pre_notify(bt)

                print(i, end=',', flush=True)
                time.sleep(minute)
        else:
            time.sleep(interval*minute)

        print('\nHave a break have a KitKat ®')
        notify(bt)


if __name__ == '__main__':
    main()
