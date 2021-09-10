#!/usr/bin/env python

import json
import time
import webbrowser
import winsound
import sys
from pathlib import Path

import plyer.platforms.win.libs.balloontip

# todo: add UI for countdown etc.
# todo: make the windows notification more like the one from the chrome extension?
# todo: uppercase constants

# interval in minutes
reminder_interval = 20
# Add 1 minute to accommodate for break time
reminder_interval += 1
# length of a minute in seconds (for speedy debugging)
minute = 60
##minute = 1

folder_path = Path() / '0.0.1.6_0/'
page_path = folder_path / 'unreads.html'
snds_folder = folder_path / 'snds/'
sound_path_mp3 = snds_folder / 'default.mp3'
sound_path_wav = snds_folder / 'default.wav'
sound_path = sound_path_wav
##icon = folder_path / 'icon_128_noti_XWm_icon.ico'
icon_path = folder_path / 'eye_of_sauron_tnT_icon.ico'

LAST_NOTIF_JSON_PATH = Path('last.json')

app_name = 'Eye Break'
WIN = sys.platform == 'win32'

# whether to popup the browser window
autoraise = False
notify_at_startup = False


def notify(windows_balloon_tip=None):
    # open page
    webbrowser.open(str(page_path), autoraise=autoraise)

    # send windows notification
    handler = plyer.notification
    if WIN and windows_balloon_tip is not None:
        handler = windows_balloon_tip

    handler.notify(
        title='Take a break!',
        message='Blink your eyes, move them around, and look at a distant '
                'object for 20 seconds.',
        app_name=app_name
    )

    # play sound
    winsound.PlaySound(str(sound_path), winsound.SND_FILENAME)


def pre_notify(windows_balloon_tip=None):
    handler = plyer.notification
    if WIN and windows_balloon_tip is not None:
        handler = windows_balloon_tip

    handler.notify(
        title='Eye break in 1 minute',
        message='Take an eye break',
        app_name=app_name
    )


def countdown(interval, bt=None):
    # count down if interval is appropriate, otherwise just wait
    if isinstance(interval, int) and interval > 1:
        for i in range(interval, 0, -1):
            if i == 1:
                pre_notify(bt)

            print(i, end=',', flush=True)
            time.sleep(minute)
    else:
        time.sleep(interval*minute)


def save_last(timestamp: float):
    with open(LAST_NOTIF_JSON_PATH, 'w') as last_notif_file:
        json.dump(timestamp, last_notif_file)


def load_last(file: Path = LAST_NOTIF_JSON_PATH) -> float:
    if not file.is_file():
        return 0
    
    with open(file) as last_notif_file:
        timestamp = json.load(last_notif_file)
    print('Loaded last time reminder went off')
    return timestamp


def resume_interval(
    last_timestamp: float, default: float = reminder_interval
) -> float:
    current_timestamp = time.time()
    seconds_since_last = current_timestamp - last_timestamp
    if seconds_since_last < default * minute:
        minutes_since_last = int(seconds_since_last // minute)
        interval_remaining = default - minutes_since_last
        print(f'Resuming with {interval_remaining} minutes to go')
        return interval_remaining
    print('Not resuming')
    return default


# mainloop
def main():
    bt = None
    if WIN:
        bt = plyer.platforms.win.libs.balloontip.WindowsBalloonTip(
            title='Eye break reminders started',
            message=f'Reminders every {reminder_interval} minutes',
            app_name=app_name,
            app_icon=str(icon_path)
        )
    
    if notify_at_startup:
        notify(bt)

    countdown(resume_interval(load_last()))
    while True:
        print('\nHave a break have a KitKat ®')
        notify(bt)
        save_last(time.time())

        countdown(reminder_interval)


if __name__ == '__main__':
    main()
