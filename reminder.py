import json
import logging
import sys
import time
import webbrowser
from pathlib import Path

import plyer
from plyer.platforms.win.libs.balloontip import WindowsBalloonTip
from playsound import playsound


# todo: script to auto create shell:startup shortcut


# interval in minutes
REMINDER_INTERVAL = 21
# length of a minute in seconds (for speedy debugging)
MINUTE = 60

APP_NAME = 'Eye Break'

# whether to popup the browser window
AUTORAISE = False
STARTUP_NOTIFY = False


WORKDIR = Path(__file__).parent

LAST_NOTIF_JSON_PATH = WORKDIR / 'last.json'
DEBUG_LOG_PATH = WORKDIR / 'debug.log'

ASSETS_DIR = WORKDIR / 'assets/'
ICON_PATH_DEFAULT = ASSETS_DIR / 'icon_128_noti.ico'
ICON_PATH_CUSTOM = ASSETS_DIR / 'eye_of_sauron.ico'
ICON_PATH = ICON_PATH_CUSTOM
SNDS_DIR = ASSETS_DIR / 'snds/'
SOUND_PATH = SNDS_DIR / 'default.mp3'


formatter = logging.Formatter('%(asctime)s:' + logging.BASIC_FORMAT)
file_handler = logging.FileHandler(DEBUG_LOG_PATH, encoding='utf-8')
stream_handler = logging.StreamHandler()
file_handler.setFormatter(formatter)
stream_handler.setFormatter(formatter)
log = logging.getLogger(__name__)
log.addHandler(file_handler)
log.addHandler(stream_handler)


def notify(bt: WindowsBalloonTip):
    # open page
    webbrowser.open(str(HTML_PATH), AUTORAISE=AUTORAISE)
    playsound(str(SOUND_PATH.resolve()), block=False)

    bt.notify(
        title='Take a break!',
        message='Blink your eyes, move them around, and look at a distant '
                'object for 20 seconds.',
        APP_NAME=APP_NAME
    )


def pre_notify(bt: WindowsBalloonTip):
    bt.notify(
        title='Eye break in 1 minute',
        message='Take an eye break',
        APP_NAME=APP_NAME
    )


def countdown(interval: int, bt: WindowsBalloonTip):
    for i in range(interval, 0, -1):
        if i == 1:
            pre_notify(bt)

        print(i, end=',', flush=True)
        time.sleep(MINUTE)


def save_last(timestamp: float):
    with open(LAST_NOTIF_JSON_PATH, 'w') as last_notif_file:
        json.dump(timestamp, last_notif_file)


def load_last(file: Path = LAST_NOTIF_JSON_PATH) -> float:
    if not file.is_file():
        print("Didn't load last time reminder went off")
        return 0
    
    with open(file) as last_notif_file:
        timestamp = json.load(last_notif_file)
    print('Loaded last time reminder went off')
    return timestamp


def resume_interval(
    last_timestamp: float, default: float = REMINDER_INTERVAL
) -> float:
    current_timestamp = time.time()
    seconds_since_last = current_timestamp - last_timestamp
    if seconds_since_last < default * MINUTE:
        MINUTEs_since_last = int(seconds_since_last // MINUTE)
        interval_remaining = default - MINUTEs_since_last
        print(f'Resuming with {interval_remaining} MINUTEs to go')
        return interval_remaining
    print('Not resuming')
    return default


def main_not_caught():
    bt = WindowsBalloonTip(
        title='Eye break reminders started',
        message=f'Reminders every {REMINDER_INTERVAL} MINUTEs',
        APP_NAME=APP_NAME,
        app_icon=str(ICON_PATH)
    )
    
    if STARTUP_NOTIFY:
        notify(bt)

    countdown(resume_interval(load_last()), bt=bt)
    while True:
        print('\nHave a break have a KitKat®')
        notify(bt)
        save_last(time.time())

        countdown(REMINDER_INTERVAL, bt=bt)


def main():
    while True:
        try:
            main_not_caught()
        except Exception:
            log.exception('Exception caught!')
            time.sleep(60)


if __name__ == '__main__':
    main()
