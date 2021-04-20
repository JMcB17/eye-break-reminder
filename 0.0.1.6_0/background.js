var sks_ece_pollInterval = 20 * 1000 * 60;
var sks_ece_timer;
var sks_ece_lastRun = new Date();
var sks_ece_notiProgress = 0;
//var sks_ece_notis = 0;
/* section for 20 second progress notification */
/*
var sks_ece_lastNotiId = "";//can be removed
var sks_ece_last20secNotiId = "";//can be removed
var sks_ece_20secIntervalObj;//can be removed
*/
/* section end for 20 second progress notification */
var sks_ece_lastTab = null;
function sks_ece_updatePollInterval() {
    try {
        if (localStorage.getItem('sks_ece_duration') != null) {
            if (parseInt(localStorage.getItem('sks_ece_duration')) == 0) return;
            sks_ece_pollInterval = parseInt(localStorage.getItem('sks_ece_duration')) * 1000 * 60;
            if (sks_ece_pollInterval == NaN)
                sks_ece_pollInterval = 20 * 1000 * 60;
        }
        //sks_ece_pollInterval = 7500;//demo
    }
    catch (Exdf) {
    }
}
function sks_ece_stopTimer() {
    try {
        if (sks_ece_timer)
            clearTimeout(sks_ece_timer);
    }
    catch (Excf) {
        console.log(Excf.message);
    }
}
function sks_ece_initiateTimer() {
    sks_ece_lastRun = new Date();
    sks_ece_timer = setTimeout(sks_ece_doProcess, sks_ece_pollInterval);
}
function sks_ece_OpenUrl(sks_ece_url, check4page) {
    try {
        chrome.windows.getAll({}, function (windows) {
            if (windows.length > 0) {
                if (check4page) {
                    chrome.tabs.getSelected(null, function (tb) {
                        if (tb.url.indexOf('chrome:') > -1 && tb.url.indexOf('newtab') > -1) {
                            chrome.tabs.update(tb.id, {
                                url: sks_ece_url,
                                selected: true
                            }, function (tb) { });
                        }
                        else {
                            chrome.tabs.create({
                                url: sks_ece_url,
                                selected: true
                            }, function (tb) {
                            });
                        }
                    });
                }
                else {
                    chrome.tabs.create({
                        url: sks_ece_url,
                        selected: true
                    }, function (tb) {
                        sks_ece_lastTab = tb.id;
                    });
                }
            }
            else {
                chrome.windows.create({
                    url: sks_ece_url,
                    focused: true
                }, function (wind) {
                    chrome.windows.update(wind.id, { state: "maximized" }, function (windo) { });
                });
            }
        });

    }
    catch (ExECE) {
        console.log(ExECE.message);
    }
}
function sks_ece_doProcess() {
    try {
        sks_ece_lastRun = new Date();
        if (localStorage.getItem('sks_ece_enabled') != null) {
            if (localStorage.getItem('sks_ece_enabled') == "1") {
                if (localStorage.getItem('sks_ece_duration') != null) {
                    if (parseInt(localStorage.getItem('sks_ece_duration')) > 0) {
                        //show noti
                        if (localStorage.getItem('sks_ece_noti') != null) {
                            if (localStorage.getItem('sks_ece_noti') == "1")
                                sks_ece_ShowNoti(localStorage.getItem('sks_ece_message'));
                        }
                        //show page
                        if (localStorage.getItem('sks_ece_page') != null) {
                            if (localStorage.getItem('sks_ece_page') == "1") {
                                //sks_ece_OpenUrl("unreads.html", false);
                                sks_ece_showExercisesPageIfNot();
                            }

                        }
                        //play sound
                        if (localStorage.getItem('sks_ece_snd') != null) {
                            sks_ece_playSound(localStorage.getItem('sks_ece_snd').toString());
                        }
                        //blink
                        if (localStorage.getItem('sks_ece_blink') != null) {
                            if (localStorage.getItem('sks_ece_blink').toString() == "1")
                                sks_ece_blink(1);
                        }
                    }
                }
            }
        }
    }
    catch (ExEce) {
        console.log(ExEce.message);
    }
    sks_ece_stopTimer(); sks_ece_initiateTimer();
}
function sks_ece_blink(arg) {
    try {
        var icon = (arg % 2) == 1 ? "icon_blue.png" : "icon.png";
        chrome.browserAction.setIcon({ path: icon });
        if (arg < 40) setTimeout(function () { sks_ece_blink(arg + 1) }, 500);
    }
    catch (ExECE) {
        console.log(ExECE.message);
    }
}
function sks_ece_ShowNoti(customMessage) {
    try {
        //if (sks_ece_notis > 0) return;// if a notification is already being displayed, don't show a new one.
        var notify = null;
        if (customMessage != null) {
            if (customMessage == "") {
                //notify = webkitNotifications.createNotification('icon_48.png', "Take a break!", "Blink your eyes, move them around and look at a distant object for 20 seconds. Click here for more exercises.");
                sks_ece_showNotification("Blink your eyes, move them around and look at a distant object for 20 seconds. Click here for more exercises.", "Take a break!");
            } else {
                //notify = webkitNotifications.createNotification('icon_48.png', (customMessage == "" ? "Take a break!" : customMessage), "");
                sks_ece_showNotification((customMessage == "" ? "Take a break!" : customMessage), "");
            }
        }
        else {
            //notify = webkitNotifications.createNotification('icon_48.png', "Take a break!", "Blink your eyes, move them around and look at a distant object for 20 seconds. Click here for more exercises.");
            sks_ece_showNotification("Blink your eyes, move them around and look at a distant object for 20 seconds. Click here for more exercises.", "Take a break!");
        }
        if (localStorage.getItem('sks_ece_closemessdelay') != null) {
            if (parseInt(localStorage.getItem('sks_ece_closemessdelay')) > 0) {
                //notify.onshow = notify.ondisplay = function () { setTimeout(function () { notify.cancel(); }, parseInt(localStorage.getItem('sks_ece_closemessdelay')) * 1000); }
            }
        }
        //notify.onclick = function () {
        //    sks_ece_OpenUrl("unreads.html", false);
        //    notify.cancel();
        //};
        //notify.onclose = function() {
        //    sks_ece_notis--;
        //};
        //notify.show();
        //sks_ece_notis++;
    }
    catch (ExNoti) {
        console.log(ExNoti.message);
    }
}
function sks_ece_showNotification(ece_message, ece_title) {
    try {
        sks_ece_clearAllNoti();
        var opt = {
            type: "basic",
            title: ece_title,
            message: ece_message,
            //contextMessage: jQuery.timeago(ece_when),
            iconUrl: chrome.extension.getURL("icon_128_noti.png")
        }
        var id = sks_ece_getNotificationId();
        chrome.notifications.create(id, opt, function (notiId) {
            //sks_ece_notis++;
            sks_ece_lastNotiId = notiId;
        });
    }
    catch (Exd) { console.log(Exd.message); }
}
function sks_ece_clearAllNoti() {
    try {
        if (sks_ece_lastNotiId != "") {
            chrome.notifications.clear(sks_ece_lastNotiId, function (wasCleared) { });
        }
    }
    catch (Exdc) { console.log(Exdc.message); }
}
function sks_ece_getNotificationId() {
    var id = Math.floor(Math.random() * 9007199254740992) + 1;
    return id.toString();
}

function sks_ece_notiClick(notiid) {
    //Write function to respond to user action.
    sks_ece_showExercisesPageIfNot();
}
// not being used now
/*
function sks_ece_showExercisesPageIfNot_old() {
    try {
        chrome.tabs.query({ url: chrome.extension.getURL("unreads.html") }, function (tabs) {
            if (tabs.length > 0) {
                chrome.tabs.update(tabs[0].id, { highlighted: true, active: true });
            }
            else {
                sks_ece_OpenUrl("unreads.html", false);
            }
        });
    }
    catch (Exshow) {
        console.log(Exshow.message);
        sks_ece_OpenUrl("unreads.html", false);
    }
}
*/
function sks_ece_showExercisesPageIfNot() {
    try {
        if (sks_ece_lastTab !== null) {
            //chrome.tabs.remove(sks_ece_lastTab);
            chrome.tabs.update(sks_ece_lastTab, { highlighted: true, active: true });
            /*
            chrome.tabs.get(sks_ece_lastTab, function (tab) {
                if (tab.url.indexOf("unreads.html")>0)
                {
                    chrome.tabs.update(tab.id, { highlighted: true, active: true });
                    sks_ece_lastTab = tab.id;        
                }
            });
            */
        }
        else {
            sks_ece_lastTab = null;
            sks_ece_OpenUrl("unreads.html", false);
        }
    }
    catch (Exshow) {
        console.log(Exshow.message);
        sks_ece_lastTab = null;
        sks_ece_OpenUrl("unreads.html", false);
    }
}
function sks_ece_resetTabId() {
    sks_ece_lastTab = null;
}
function sks_ece_playSound(fileName) {
    try {
        if (!fileName) return;
        if (fileName != "") {
            fileName = "snds/" + fileName + ".mp3"
            var audio = new Audio(fileName);
            audio.play();
        }
    }
    catch (Exreded) {
    }
}
function sks_ece_requestBackground(true2grand) {
    if (true2grand) {
        chrome.permissions.request({
            permissions: ['background']
        }, function (granted) {
            // The callback argument will be true if the user granted the permissions.
            if (granted) {
                localStorage.setItem('sks_ece_bg', "1");
            } else {
                //localStorage.setItem('sks_ece_bg',"0");
            }
        });
    }
    else {
        chrome.permissions.remove({
            permissions: ['background']
        }, function (removed) {
            if (removed) {
                // The permissions have been removed.
                localStorage.setItem('sks_ece_bg', "0");
            } else {
                // The permissions have not been removed (e.g., you tried to remove
                // required permissions).
            }
        });
    }
}
function sks_ece_timeRemain() {
    var ret = -1;
    try {
        if (localStorage.getItem('sks_ece_duration') != null) {
            if (parseInt(localStorage.getItem('sks_ece_duration')) > 0) {
                var current = new Date();
                var span = current - sks_ece_lastRun;
                //ret = Math.floor(span / 1000 / 60);
                ret = Math.floor(span / 1000);
                //ret = parseInt(localStorage.getItem('sks_ece_duration')) - ret;
                ret = (parseInt(localStorage.getItem('sks_ece_duration')) * 60) - ret;
            }
        }
    }
    catch (ExECe) { }
    return ret;
}
chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        if (request.sksmode == "updateinterval") {
            sks_ece_updatePollInterval();
            sks_ece_stopTimer(); sks_ece_initiateTimer();
            sendResponse({});
        }
        else if (request.sksmode == "syncsettings") {
            sks_ece_setSyncOption();
            sendResponse({});
        }
        else sendResponse({}); // snub them.
    });

function sks_ece_getAllSettings() {
    var sks_ece_sets = {};
    var keyName = '';
    for (var i = 0; i < localStorage.length; i++) {
        keyName = localStorage.key(i);
        sks_ece_sets[keyName] = (localStorage.getItem(localStorage.key(i)).toString() == "" ? '' : localStorage.getItem(localStorage.key(i)));
    }
    return sks_ece_sets;
}
function sks_ece_setSyncOption() {
    try {
        var sks_ece_settings = sks_ece_getAllSettings();
        chrome.storage.sync.set(sks_ece_settings, function () {
            // Notify that we saved.
        });
    }
    catch (Exss) {
        console.log(Exss.message);
    }
}
chrome.storage.onChanged.addListener(function (changes, namespace) {
    try {
        for (key in changes) {
            var storageChange = changes[key];
            //console.log('Storage key "%s" in namespace "%s" changed. ' + 'Old value was "%s", new value is "%s".', key, namespace, storageChange.oldValue, storageChange.newValue);
            localStorage.setItem(key, storageChange.newValue);
        }
    }
    catch (Exssl) {
        console.log(Exssl.message);
    }
});
function sks_ece_setSettings(name, val) {
    localStorage.setItem(name, val);
}
function sks_ece_checkforBGPermission() {
    try {
        chrome.permissions.contains({
            permissions: ['background']
        }, function (result) {
            // The callback argument will be true if the user granted the permissions.
            if (result) {
                localStorage.setItem('sks_ece_bg', "1");
            } else {
                localStorage.setItem('sks_ece_bg', "0");
            }
        });
    }
    catch (Exssl) {
        console.log(Exssl.message);
    }
}
/* section for 20 second progress notification */
/*
function sks_ece_show20secTimer(title, message, timeout) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.extension.getURL("icon_128_noti.png"),
        title: title,
        message: message || '',
        //progress: 0,
        priority: 1
        //requireInteraction:true
    }, function (id) {
        // Automatically close the notification in 4 seconds by default
        //var progress = 0;
        sks_ece_last20secNotiId = id;
        setTimeout(sks_ece_update20sec_timer, 1000);

        //chrome.alarms.create("sks_ece_01", {
        //    delayInMinutes: 0.16, periodInMinutes: 0.16
        //});

        ////sks_ece_20secIntervalObj = setInterval(sks_ece_update20sec, 500);
        
    //     console.log(id + ': created');
    //   var interval = setInterval(function() {
    //       sks_ece_notiProgress +=5;
    //       if (sks_ece_notiProgress <= 100) {
    //           console.log(sks_ece_notiProgress);
    //       chrome.notifications.update(id, {progress: sks_ece_notiProgress}, function(updated) {
    //         if (!updated) {
    //             // the notification was closed
    //           clearInterval(interval);
    //         }
    //         else
    //             console.log(id + ': updated');
    //       });
    //       } else {
    //           console.log(id + ': cleared');

    //       chrome.notifications.clear(id);
    //       clearInterval(interval);
    //       sks_ece_notiProgress = 0;
    //     }
    //   },1000);// (timeout || 4000) / 100);
      
    });
}
function sks_ece_update20sec_timer() {
    if (sks_ece_last20secNotiId != "") {
        sks_ece_notiProgress += 5;
        console.log(sks_ece_notiProgress);
        if (sks_ece_notiProgress <= 100) {

            //chrome.notifications.update(sks_ece_last20secNotiId, { progress: sks_ece_notiProgress }, function (updated) {
            //chrome.notifications.update(sks_ece_last20secNotiId, { progress: sks_ece_notiProgress, message: sks_ece_notiProgress.toString(), priority: 2 }, function (updated) {
            chrome.notifications.update(sks_ece_last20secNotiId, { title: "sample", message: sks_ece_notiProgress.toString(), priority: 1 }, function (updated) {
                if (updated) {
                    console.log(sks_ece_last20secNotiId + ': updatedt');
                    setTimeout(sks_ece_update20sec_timer, 1000);
                }
            });
        }
        else {
            console.log(sks_ece_last20secNotiId + ': clearedt');
            chrome.notifications.clear(sks_ece_last20secNotiId);
            //chrome.alarms.clear("sks_ece_01");
        }
    }
}
function sks_ece_update20sec() {
    if (sks_ece_last20secNotiId != "") {
        sks_ece_notiProgress += 5;
        console.log(sks_ece_notiProgress);
        if (sks_ece_notiProgress <= 100) {

            //chrome.notifications.update(sks_ece_last20secNotiId, { progress: sks_ece_notiProgress }, function (updated) {
            chrome.notifications.update(sks_ece_last20secNotiId, { progress: sks_ece_notiProgress, message: sks_ece_notiProgress.toString(), priority: 2 }, function (updated) {
                if (!updated) {
                    // the notification was closed
                    console.log(sks_ece_last20secNotiId + ': double cleaders');
                    clearInterval(sks_ece_20secIntervalObj);
                }
                else
                    console.log(sks_ece_last20secNotiId + ': updateds');
            });
        } else {
            console.log(sks_ece_last20secNotiId + ': cleareds');

            chrome.notifications.clear(sks_ece_last20secNotiId);
            clearInterval(sks_ece_20secIntervalObj);
            sks_ece_notiProgress = 0;
            sks_ece_last20secNotiId = "";
        }
    }
}
*/
/* section end for 20 second progress notification */

//localStorage.setItem('sks_ece_duration', 1);
//setTimeout(function () { localStorage.setItem('sks_ece_duration', 1); }, 1000);
chrome.notifications.onClicked.addListener(sks_ece_notiClick);
sks_ece_updatePollInterval();
sks_ece_initiateTimer();
sks_ece_checkforBGPermission();
//sks_ece_show20secTimer('eyeCare', 'Exercise Time');
//chrome.alarms.onAlarm.addListener(sks_ece_update20sec_timer);