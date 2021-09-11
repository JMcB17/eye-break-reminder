function sks_ece_notifyFirstRun() {
    try {
        var isNotfirstRun = (localStorage['sks_ece_ver'] == '0.0.0.9');
        if (('sks_ece_ver' in localStorage) == false)
            _gaq.push(['_trackEvent', 'Install', 'Installed']);
        if (!isNotfirstRun) {
            localStorage['sks_ece_ver'] = '0.0.0.9';
            _gaq.push(['_trackEvent', 'Install', '0.0.0.9']);
        }
    }
    catch (ExEXE) { }
}