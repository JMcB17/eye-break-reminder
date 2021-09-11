//first part
$(document).ready(function () {
    sks_ece_load_options();
    sks_ece_showValue();
    sks_ece_showMessageTime();
    $('#chkEnabled').iphoneStyle({
        onChange: function (elem, value) {
            sks_ece_set_Options();
            sks_ece_showTimeRemain();
            if (document.getElementById('chkEnabled').checked) {
                $('#divOptions').slideDown('fast');
            }
            else {
                $('#divOptions').slideUp('fast');
            }
        }
    });


    sks_ece_showTimeRemain();
    //setTimeout(sks_ece_showOnly_Initial, 25);
    sks_ece_showOnly_Initial();
    $('#chkNoti').bind('change', function () {
        sks_ece_set_Options();

    });
    $('#chkNoti').click(function () {
        if (!document.getElementById('chkNoti').checked) {
            $('.opt_mess').slideUp('fast', function () {
                sks_ece_notification_collapse();
            });
        }
        else {
            sks_ece_notification_expand();
            //$('.hideOption').hide();
            $('.opt_mess').slideDown('fast', function () {
                //$('.hideOption').hide();
            });
        }
    });
    $('#chkEnabled').bind('change', function () {
        sks_ece_set_Options(); sks_ece_showTimeRemain();
    });
    $('#txtFreq').bind('change', function () {
        sks_ece_showValue(this.value); sks_ece_set_Options();
        sks_ece_updateFreq();
    });
    $('#imgPlaySound').bind('click', function () {
        sks_ece_playSound(); return false;
    });
    $('#helplink').bind('click', function () {
        sks_ece_showOptions('options.html#optmode');
        window.close();
        return false;
    });
    $('#resetBreakLink').bind('click', function () {
        sks_ece_updateFreq(); return false;
    });
    $('#fblink').bind('click', function () {
        sks_ece_showOptions('https://www.facebook.com/care.for.your.eyes');
        window.close();
        return false;
    });
    $('#div5 a:nth-child(1)').bind('click', function (event) {
        sks_showhide();
        //return false;
        event.stopPropagation();
    });
    $('#chkPage').bind('change', function () {
        sks_ece_set_Options();
    });
    if ($('#rangeMess').length > 0) {
        $('#rangeMess').bind('change', function () {
            sks_ece_showMessageTime(this.value); sks_ece_set_Options();
        });
    }
    $('#txtMessage').bind('keyup', function () {
        sks_ece_set_OptionsCustom(2);
    });
    $('#ddlPlaySound').bind('change', function () {
        sks_ece_sndChanged(); sks_ece_set_Options();
        //return false;
    });
    $('#chkIcon').bind('change', function () {
        sks_ece_set_Options();
    });
    $('#chkBG').bind('change', function () {
        sks_ece_askPermission();
        //return false;
    });
    //loadAnalytics();
    setTimeout(loadAnalytics, 50);
});

//second part
var sks_ece_timer;
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
function sks_ece_notification_expand() {
    $('#notificationsection').addClass('notificationSection');
    //$('#notificationsection div').css('margin', '0px 1px 1px 1px');
    //$('#notificationsection div:first').css('padding', '3px');
    $('#notificationsection div:first').css('background-color', '#D4E1F9');
}
function sks_ece_notification_collapse() {
    $('#notificationsection').removeClass('notificationSection');
    // $('#notificationsection div').css('margin', '4px'); //from eachControl css
    //$('#notificationsection div:first').css('padding', '5px'); //from eachControl css
    $('#notificationsection div:first').css('background-color', '#EFF2F7'); //from eachControl css            
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
function sks_ece_sndChanged() {
    var slct = document.getElementById("ddlPlaySound");
    var selected = slct.value;
    document.getElementById('imgPlaySound').style.visibility = selected == "" ? 'hidden' : 'visible';
}
function sks_ece_validateFreq() {
    try {
        var tx = document.getElementById("txtFreq").value;
        tx = parseInt(tx);
        if (tx > 0 && tx < 61) {
            document.getElementById("txtFreq").value = tx.toString();
        }
        else {
            document.getElementById("txtFreq").value = 20;
        }
    }
    catch (Ex) { }
}
function sks_ece_playSound() {
    try {
        var slct = document.getElementById("ddlPlaySound");
        var selected = slct.value;
        var fileName = "";
        fileName = "snds/" + selected + ".mp3";
        if (fileName.length > 9) {
            document.getElementById("imgPlaySound").src = "start-icon-dis.png";
            var audio = new Audio(fileName);
            audio.play();
            setTimeout(function () { document.getElementById("imgPlaySound").src = "start-icon.png"; }, 500);
        }
        else {
            //lert("Please select a valid sound file.");
        }
    }
    catch (Except) {
        //lert("Error Occured: " + Except.message)
    }
}
function sks_ece_load_options() {
    try {

        if (localStorage.getItem('sks_ece_duration') != null)
            document.getElementById('txtFreq').value = localStorage.getItem('sks_ece_duration').toString();
        else
            sks_ece_set_Options(); //set default
        if (localStorage.getItem('sks_ece_enabled') != null)
            document.getElementById('chkEnabled').checked = localStorage.getItem('sks_ece_enabled').toString() == "1";
        if (localStorage.getItem('sks_ece_page') != null)
            document.getElementById('chkPage').checked = localStorage.getItem('sks_ece_page').toString() == "1";
        if (localStorage.getItem('sks_ece_noti') != null)
            document.getElementById('chkNoti').checked = localStorage.getItem('sks_ece_noti').toString() == "1";
        if (localStorage.getItem('sks_ece_message') != null)
            document.getElementById('txtMessage').value = localStorage.getItem('sks_ece_message').toString();
        if (localStorage.getItem('sks_ece_snd') != null)
            document.getElementById('ddlPlaySound').value = localStorage.getItem('sks_ece_snd');
        if (localStorage.getItem('sks_ece_bg') != null)
            document.getElementById('chkBG').checked = localStorage.getItem('sks_ece_bg').toString() == "1";
        document.getElementById('imgPlaySound').style.visibility = document.getElementById('ddlPlaySound').value == "" ? 'hidden' : 'visible';
        if (localStorage.getItem('sks_ece_closemessdelay') != null && $('#rangeMess').length > 0)
            document.getElementById('rangeMess').value = localStorage.getItem('sks_ece_closemessdelay');
        if (localStorage.getItem('sks_ece_blink') != null)
            document.getElementById('chkIcon').checked = localStorage.getItem('sks_ece_blink').toString() == "1";
        sks_ece_loadFullOptions();
    }
    catch (exece) {
        console.log(exece.message);
    }
}
function sks_ece_loadFullOptions() {
    try {
        if (window.location.hash.substr(1) == "optmode") {
            document.getElementById('mainDiv').style.width = "980px";
            document.getElementById('divOptHelp').style.display = "block";
            //document.getElementById('divOptFooter').style.display = "none";
            document.getElementById('facebookspn').innerHTML = '';
            sks_showhide();
        }
    }
    catch (ExeCe) { }
}
function sks_ece_set_Options() {
    try {

        localStorage.setItem('sks_ece_enabled', document.getElementById('chkEnabled').checked == true ? "1" : "0");
        localStorage.setItem('sks_ece_duration', document.getElementById('txtFreq').value);
        localStorage.setItem('sks_ece_message', document.getElementById('txtMessage').value);
        localStorage.setItem('sks_ece_page', document.getElementById('chkPage').checked == true ? "1" : "0");
        localStorage.setItem('sks_ece_noti', document.getElementById('chkNoti').checked == true ? "1" : "0");
        localStorage.setItem('sks_ece_snd', document.getElementById('ddlPlaySound').value);
        if ($('#rangeMess').length > 0) { localStorage.setItem('sks_ece_closemessdelay', document.getElementById('rangeMess').value); }
        localStorage.setItem('sks_ece_blink', document.getElementById('chkIcon').checked == true ? "1" : "0");
        //sks_ece_updateFreq();//demo
        sks_ece_syncSettings();
    }
    catch (ExEce) {
        console.log(ExEce.message);
    }
}
function sks_ece_showOnly() {
    try {

    }
    catch (ExS) { }
}
function sks_ece_showOnly_Initial() {
    try {
        if (!document.getElementById('chkNoti').checked) {
            $('.opt_mess').hide();
            sks_ece_notification_collapse();
        }
        else {
            $('.opt_mess').show();
            //$('.hideOption').hide();
            sks_ece_notification_expand();
        }
        if (document.getElementById('chkEnabled').checked) {
            $('#divOptions').show();
        }
        else {
            $('#divOptions').hide();
        }
    }
    catch (ExS) {
        console.log(ExS.message);
    }
}
function sks_ece_showValue(newValue) {
    document.getElementById("timesp").innerHTML = document.getElementById('txtFreq').value;
}
function sks_ece_showMessageTime(newValue) {
    if ($('#rangeMess').length) {
        var min = Math.floor(document.getElementById('rangeMess').value / 60);
        var sec = (document.getElementById('rangeMess').value % 60);
        var mess = (min > 0 ? min + " min " : "") + (sec > 0 ? sec + " sec" : "");
        document.getElementById("spMess").innerHTML = mess == "" ? " message manually." : " after " + mess.toString().trim() + ".";
    }
}
function sks_ece_updateFreq() {
    chrome.extension.sendRequest({ sksmode: "updateinterval" }, function (response) {
        sks_ece_showTimeRemain();
    });
}
function sks_ece_syncSettings() {
    chrome.extension.sendRequest({ sksmode: "syncsettings" }, function (response) {
    });
}
function sks_ece_set_OptionsCustom(arg) {
    try {
        switch (arg) {
            case 1:
                localStorage.setItem('sks_ece_duration', document.getElementById('txtFreq').value);
                sks_ece_updateFreq();
                sks_ece_syncSettings();
                break;
            case 2:
                localStorage.setItem('sks_ece_message', document.getElementById('txtMessage').value);
                //sks_ece_updateFreq();//demo
                sks_ece_syncSettings();
                break;
        }
    }
    catch (ExecE) { }
}
function sks_showhide() {
    try {
        if (document.getElementById('div2').style.display == "none") {
            document.getElementById('div2').style.display = "block";
        }
        else {
            document.getElementById('div2').style.display = "none";
        }
    }
    catch (Exc) { }
}
function sks_ece_showOptions(url) {
    var bgPage = chrome.extension.getBackgroundPage();
    bgPage.sks_ece_OpenUrl(url, true);
}
function sks_ece_askPermission() {
    var bgPage = chrome.extension.getBackgroundPage();
    if (document.getElementById('chkBG').checked == true) {
        chrome.permissions.request({
            permissions: ['background']
        }, function (granted) {
            // The callback argument will be true if the user granted the permissions.
            if (granted) {
                //localStorage.setItem('sks_ece_bg', "1");
                bgPage.sks_ece_setSettings('sks_ece_bg', "1");
            } else {
                //localStorage.setItem('sks_ece_bg',"0");
            }
        });
        //bgPage.sks_ece_requestBackground(true);
    }
    else {
        chrome.permissions.remove({
            permissions: ['background']
        }, function (removed) {
            if (removed) {
                // The permissions have been removed.
                //localStorage.setItem('sks_ece_bg', "0");
                bgPage.sks_ece_setSettings('sks_ece_bg', "0");
            } else {
                // The permissions have not been removed (e.g., you tried to remove
                // required permissions).
            }
        });
        //bgPage.sks_ece_requestBackground(false);
    }
}
function sks_ece_showTimeRemain() {
    try {
        sks_ece_stopTimer();
        if (localStorage.getItem('sks_ece_enabled')) {
            if (localStorage.getItem('sks_ece_enabled') == "1") {
                var bgPage = chrome.extension.getBackgroundPage();
                var remaining = bgPage.sks_ece_timeRemain();
                //document.getElementById('remain').innerHTML = remaining > -1 ? ((remaining == 0 ? "Few seconds" : remaining) + " minutes remaining") : "";
                //document.getElementById('remain').innerHTML = remaining > 0 ? (Math.floor(remaining / 60) + ":" + sks_ece_makeTwo((remaining % 60)) + " remaining") : "";
                document.getElementById('remain').innerHTML = remaining > 0 ? (Math.floor(remaining / 60) + ":" + sks_ece_makeTwo((remaining % 60))) : "00:00";
            }
            else {
                document.getElementById('remain').innerHTML = "00:00"; //eyeCare is disabled.";
            }
        }
        else {
            document.getElementById('remain').innerHTML = "00:00"; //"eyeCare is disabled.";
        }
    }
    catch (EXece) {
        console.log(EXece.message);
    }
    sks_ece_timer = setTimeout(sks_ece_showTimeRemain, 1000); //refresh in 10 seconds
}
function sks_ece_makeTwo(arg) {
    if (arg.toString().length == 1)
        return "0" + arg;
    else
        return arg;
}
function sks_ece_blink() {
    try {
        setInterval(function () {
            $('#titleimg').attr('src', 'icon_48_closed.png');
            setTimeout(function () { $('#titleimg').attr('src', 'icon_48.png'); }, 150);
        }, 7000);
    }
    catch (ExBl) {
        console.log(ExBl.message);
    }
}
//analytics code
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32931889-1']);
_gaq.push(['_trackPageview']);

//        (function() {
//            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//            //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//            ga.src = 'https://ssl.google-analytics.com/ga.js';
//            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//        })();
function loadAnalytics() {
    try {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        //ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        sks_ece_notifyFirstRun();
        sks_ece_blink();
    }
    catch (anaEx) { console.log(anaEx.message); }
}