import json
import logging
import sys
import time
import webbrowser
from pathlib import Path

WIN = (sys.platform == 'win32')

import plyer
if WIN:
    import plyer.platforms.win.libs.balloontip
from playsound import playsound

# todo: add UI for countdown etc.
# todo: make the windows notification more like the one from the chrome extension?
# todo: uppercase constants
# todo: script to auto create shell:startup shortcut

# interval in minutes
reminder_interval = 20
# Add 1 minute to accommodate for break time
reminder_interval += 1
# length of a minute in seconds (for speedy debugging)
minute = 60
##minute = 1

WORKDIR = Path(__file__).parent

folder_path = WORKDIR / 'assets/'
page_path = folder_path / 'unreads.html'
snds_folder = folder_path / 'snds/'
sound_path = snds_folder / 'default.mp3'

default_icon_path = folder_path / 'icon_128_noti.ico'
custom_icon_path = folder_path / 'eye_of_sauron.ico'
icon_path = custom_icon_path

LAST_NOTIF_JSON_PATH = WORKDIR / 'last.json'
DEBUG_LOG_PATH = WORKDIR / 'debug.log'

app_name = 'Eye Break'

# whether to popup the browser window
autoraise = False
notify_at_startup = False


formatter = logging.Formatter('%(asctime)s:' + logging.BASIC_FORMAT)
file_handler = logging.FileHandler(DEBUG_LOG_PATH, encoding='utf-8')
stream_handler = logging.StreamHandler()
file_handler.setFormatter(formatter)
stream_handler.setFormatter(formatter)
log = logging.getLogger(__name__)
log.addHandler(file_handler)
log.addHandler(stream_handler)


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
    try:
        playsound(str(sound_path.resolve()), block=False)
    except ValueError as error:
        raise ValueError(
            'Error, try this:\nsudo apt install python3-gst-1.0'
            '\nFrom https://github.com/TaylorSMarks/playsound/issues'
            '/16#issuecomment-658182306'
        ) from error


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
        print("Didn't load last time reminder went off")
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


def main_not_caught():
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

    countdown(resume_interval(load_last()), bt=bt)
    while True:
        print('\nHave a break have a KitKat®')
        notify(bt)
        save_last(time.time())

        countdown(reminder_interval, bt=bt)


def main():
    try:
        main_not_caught()
    except Exception:
        log.exception('Exception caught!')


if __name__ == '__main__':
    main()
