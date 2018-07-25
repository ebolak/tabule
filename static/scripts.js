var memSettingsMain;
var memActualValues;
var memAndons;
var memSettingsShift1;
var memSettingsShift2;
var memSettingsShift3;
var memSettingsShift = {};
var memSettingsSireneGreen;
var memSettingsSireneYellow;
var memSettingsSireneRed;

var timeInputSource;
var toneDurationSource;
var toneSelectSource;

var settingsShift_shiftSelect = 1;

// compute bekido value
var computeBekido = function(ok, counterTactTime) {
  if (counterTactTime > 0) {
    return (ok / counterTactTime * 100).toFixed(1).toString();
  } 
  else {
    return 'N/A';
  }
};


var toneSelect = function(idSelector, msg) {
    if (msg.payload['toneSelect'] !== 0) {
        $(idSelector).text('Tón ' + msg.payload['toneSelect']);
    }
    else {
        $(idSelector).text('Žádný tón');    
    }
    $(idSelector).val(msg.payload['toneSelect']);   
};


var toneTest = function(idSelector, msg) {
    if (msg.payload['test'] === 1) {
        $(idSelector).addClass('btn-success');   
    }
    else {
        $(idSelector).removeClass('btn-success'); 
    }
};

function jsonEqual(a,b) {
    return JSON.stringify(a) === JSON.stringify(b);
};

var isNumber = function(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
};

var isNumberOrDot = function(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode >= 48 && charCode <= 57 || charCode == 46) {
        return true;
    }
    return false;
};

var isNumberOrColon = function(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 58)) {
        return false;
    }
    return true;
};

var updateBtnVYP = function(idSelector, value) {
    if (value === 0) {
        $(idSelector).html('VYP');
        $(idSelector).removeClass('btn-success');
        $(idSelector).addClass('btn-danger');
    } else if (value == 1 )  {
        $(idSelector).html('VYP');
        $(idSelector).removeClass('btn-success');
        $(idSelector).removeClass('btn-danger');
    } else {
        $(idSelector).html('###');
        $(idSelector).removeClass('btn-success');
        $(idSelector).removeClass('btn-danger');
    }
};

var updateBtnZAP = function(idSelector, value) {
    if (value === 0) {
        $(idSelector).html('ZAP');
        $(idSelector).removeClass('btn-success');
        $(idSelector).removeClass('btn-danger');
    } else if (value == 1 )  {
        $(idSelector).html('ZAP');
        $(idSelector).removeClass('btn-danger');
        $(idSelector).addClass('btn-success');
    } else {
        $(idSelector).html('###');
        $(idSelector).removeClass('btn-success');
        $(idSelector).removeClass('btn-danger');
    }
};

var msToTime = function(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
};


function timeString2ms(a,b){// time(HH:MM:SS.mss) // optimized
    return a=a.split('.'), // optimized
        b=a[1]*1||0, // optimized
        a=a[0].split(':'),
        b+(a[2]?a[0]*3600+a[1]*60+a[2]*1:a[1]?a[0]*60+a[1]*1:a[0]*1)*1e3 // optimized
}

function ms2String(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return h + ':' + m + ':' + s;
}


var updateSettingsShift = function(msg) {
    // shiftEN
    updateBtnVYP('#settingsShift-shiftENOff', msg.payload['shiftEN']);
    updateBtnZAP('#settingsShift-shiftENOn', msg.payload['shiftEN']);
    // shift1Begin
    $('#settingsShift-shiftBegin').html(msToTime(msg.payload['shiftBegin']));
    // shift1End
    $('#settingsShift-shiftEnd').html(msToTime(msg.payload['shiftEnd']));
    
    // break1EN
    updateBtnVYP('#settingsShift-break1ENOff', msg.payload['shiftBreak1EN']);
    updateBtnZAP('#settingsShift-break1ENOn', msg.payload['shiftBreak1EN']);
    // break1Begin
    $('#settingsShift-break1Begin').html(msToTime(msg.payload['shiftBreak1Begin']));
    // break1End
    $('#settingsShift-break1End').html(msToTime(msg.payload['shiftBreak1End']));
    
    // break2EN
    updateBtnVYP('#settingsShift-break2ENOff', msg.payload['shiftBreak2EN']);
    updateBtnZAP('#settingsShift-break2ENOn', msg.payload['shiftBreak2EN']);
    // break2Begin
    $('#settingsShift-break2Begin').html(msToTime(msg.payload['shiftBreak2Begin']));
    // break2End
    $('#settingsShift-break2End').html(msToTime(msg.payload['shiftBreak2End']));

    // break3EN
    updateBtnVYP('#settingsShift-break3ENOff', msg.payload['shiftBreak3EN']);
    updateBtnZAP('#settingsShift-break3ENOn', msg.payload['shiftBreak3EN']);
    // break3Begin
    $('#settingsShift-break3Begin').html(msToTime(msg.payload['shiftBreak3Begin']));
    // break3End
    $('#settingsShift-break3End').html(msToTime(msg.payload['shiftBreak3End']));
};
// kick off
$(document).ready(function() {
            namespace = name_space; // change to an empty string to use the global namespace
            // the socket.io documentation recommends sending an explicit package upon connection
            // this is specially important when using the global namespace
            var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);

            // on connect
            socket.on('connect', function(msg) {
                console.log('Connected!');
            });

            // on disconect
            socket.on('disconnect', function() {
                console.log('disconnect');
                $('#target').text('####');
                $('#actual').text('####');
                $('#ok').text('####');
                $('#diff').text('####');
                $('#bekido').text('####');
                $('#taktTime').text('####');
            });

            // on disconect
            socket.on('actualValuesError', function() {
                console.log('actualValuesError');
                $('#target').text('####');
                $('#actual').text('####');
                $('#ok').text('####');
                $('#diff').text('####');
                $('#bekido').text('####');
            });

            // on disconect
            socket.on('connect_error', function(err) {
                console.log('connect error');
                $('#target').text('####');
                $('#actual').text('####');
                $('#ok').text('####');
                $('#diff').text('####');
                $('#bekido').text('####');
            });          

            // *****************************
            // actual Values
            // *****************************
            socket.on(line_name + '/actualValues', function(msg) {
                if (!(jsonEqual(msg, memActualValues))) {
                    console.log(msg);
                    $('#target').text(msg.payload['target']);
                    $('#actual').text(msg.payload['actual']);
                    $('#ok').text(msg.payload['ok']);
                    $('#diff').text(msg.payload['diff']);
                    $('#bekido').text(computeBekido(msg.payload['ok'], msg.payload['taktTimeCnt']));

                    $('#control-startTaktTimeCnt').removeClass('btn-success');
                    $('#control-startTaktTimeCnt').removeClass('btn-danger');
                    $('#control-startTaktTimeCnt').removeClass('btn-warning');
                    $('#control-stopTaktTimeCnt').removeClass('btn-success');
                    $('#control-stopTaktTimeCnt').removeClass('btn-danger');
                    $('#control-stopTaktTimeCnt').removeClass('btn-warning') 
                    switch (msg.payload['state']) {
                        case 0:
                            break;
                        case 1:
                            $('#control-stopTaktTimeCnt').addClass('btn-danger');
                            $('#control-startTaktTimeCnt').addClass('btn-danger');
                            break;
                        case 2:
                            $('#control-stopTaktTimeCnt').addClass('btn-warning');
                            break;
                        case 3:
                            $('#control-startTaktTimeCnt').addClass('btn-success');
                            break;
                    }
                }
                memActualValues = msg;
            });

            // andon update
            socket.on(line_name + '/andons', function(msg) {
                if (!(jsonEqual(msg, memAndons))) {
                    console.log(msg);
                }
                memAndons = msg;
            });

            // *****************************
            // settings
            // *****************************
            socket.on(line_name + '/settings', function(msg) {
                if (!(jsonEqual(msg, memSettingsMain))) {
                    console.log(msg);
                    // taktTimeCntOption update
                    switch (msg.payload['taktTimeCntOption']) {
                        case 0:
                            $('#settings-taktTimeCntOption').text('0: Vypnuto');
                            break;
                        case 1:
                            $('#settings-taktTimeCntOption').text('1: Ručně v ovládání');
                            // update control btns
                            $('#control-startTaktTimeCnt').show();
                            $('#control-stopTaktTimeCnt').show();
                            $('#control-autostartTaktTimeCntEn').hide();
                            break;
                        case 2:;
                            $('#settings-taktTimeCntOption').text('2: Automaticky nastavením směn');
                            // update control btns
                            $('#control-startTaktTimeCnt').hide();
                            $('#control-stopTaktTimeCnt').hide();
                            $('#control-autostartTaktTimeCntEn').show(); 
                            break;
                        default:
                            $('#settings-taktTimeCntOption').text('####'); 
                    }
                    // target update
                    $('#settings-target').html(msg.payload['target'] + ' ks')
                    // ngCount option update
                    switch (msg.payload['countOption']) {
                        case 0:
                            $('#settings-countOption').text('0: OK -1');
                            break;
                        case 1:
                            $('#settings-countOption').text('1: Vyrobeno +1');
                            break;
                        default:
                            $('#settings-countOption').text('####'); 
                    }
                    // taktTime update
                    $('#settings-taktTime').text(msg.payload['taktTime']/1000 + ' s'); 

                    $('#taktTime').text(msg.payload['taktTime']/1000);                
                }
                memSettingsMain = msg;   
            });

            // settings-taktTimeCntOption0
            $('#settings-taktTimeCntOption0').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/taktTimeCntOption';
                msg.payload = {'value':[0]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settings-taktTimeCntOption1
            $('#settings-taktTimeCntOption1').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/taktTimeCntOption';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settings-taktTimeCntOption2
            $('#settings-taktTimeCntOption2').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/taktTimeCntOption';
                msg.payload = {'value':[2]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settings-save-target
            $('#settings-save-target').on('click', function(e) {
                var value = $('#inputTarget').val();
                if ($.isNumeric(value)) {
                    var msg = {}
                    msg.topic = line_name + '/settings/target';
                    msg.payload = {'value':[value]};
                    socket.emit('publish', JSON.stringify(msg));
                    console.log(msg);
                }
            });

            // settings-save-target modal default value
            $('#targetModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var value = button.text();
                var modal = $(this);
                modal.find('.modal-body input').val(value.replace(/[^0-9]/g, ''))
            });
            
            // settings-save-taktTime
            $('#settings-save-taktTime').on('click', function(e) {
                var value = $('#inputTaktTime').val() * 1000;
                if ($.isNumeric(value)) {
                    var msg = {}
                    msg.topic = line_name + '/settings/taktTime';
                    msg.payload = {'value':[value]};
                    socket.emit('publish', JSON.stringify(msg));
                    console.log(msg);    
                }                
            });
            // settings-save-taktTime modal default value
            $('#taktTimeModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget);
                var value = button.text();
                var modal = $(this);
                modal.find('.modal-body input').val(value.replace(/[^0-9.]/g, ''))
            });

            // settings-countOption0
            $('#settings-countOption0').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/countOption';
                msg.payload = {'value':[0]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settings-countOption1
            $('#settings-countOption1').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/countOption';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // ***********************
            // control
            // ***********************

            // control-resetCounters
            $('#control-resetCounters').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/control/resetCounters';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // control-startTaktTimeCnt
            $('#control-startTaktTimeCnt').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/control/startTaktTimeCnt';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // control-stopTaktTimeCnt
            $('#control-stopTaktTimeCnt').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/control/stopTaktTimeCnt';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // control-releaseProduction
            $('#control-releaseProduction').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/control/releaseProduction';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // control-stopProduction
            $('#control-stopProduction').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/control/stopProduction';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // ***********************
            // settingsShift
            // ***********************
            // settingsShift-select shift get value
            $('#settingsShift-selectShift').change(function() {
                settingsShift_shiftSelect = parseInt($(this).val());
                delete memSettingsShift[settingsShift_shiftSelect.toString()];
            });

            socket.on(line_name + '/settingsShift/1', function(msg){
                if (!(jsonEqual(msg, memSettingsShift['1']))) {
                    console.log(msg);
                    if (settingsShift_shiftSelect === 1) {
                        updateSettingsShift(msg);    
                    }  
                }
                memSettingsShift['1'] = msg;                         
            });

            socket.on(line_name + '/settingsShift/2', function(msg){
                if (!(jsonEqual(msg, memSettingsShift['2']))) {
                    console.log(msg);
                    if (settingsShift_shiftSelect === 2) {
                        updateSettingsShift(msg);    
                    }  
                }
                memSettingsShift['2'] = msg;                         
            });

            socket.on(line_name + '/settingsShift/3', function(msg){
                if (!(jsonEqual(msg, memSettingsShift['3']))) {
                    console.log(msg);
                    if (settingsShift_shiftSelect === 3) {
                        updateSettingsShift(msg);    
                    }  
                }
                memSettingsShift['3'] = msg;                         
            });
            
            // settingsShift-shiftENOff
            $('#settingsShift-shiftENOff').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/shiftEN';
                msg.payload = {'value':[0]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });
            // settingsShift-shiftENOn
            $('#settingsShift-shiftENOn').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/shiftEN';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);             
            });

            // settingsShift-break1ENOff
            $('#settingsShift-break1ENOff').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break1EN';
                msg.payload = {'value':[0]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });
            // settingsShift-break1ENOn
            $('#settingsShift-break1ENOn').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break1EN';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settingsShift-break2ENOff
            $('#settingsShift-break2ENOff').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break2EN';
                msg.payload = {'value':[0]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });
            // settingsShift-break1ENOn
            $('#settingsShift-break2ENOn').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break2EN';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settingsShift-break3ENOff
            $('#settingsShift-break3ENOff').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break3EN';
                msg.payload = {'value':[0]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });
            // settingsShift-break3ENOn
            $('#settingsShift-break3ENOn').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break3EN';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // ***********************
            // shared modal for time imput
            // ***********************
            $('#settingsShift-time-inputModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                timeInputSource = button.data('source'); // Extract info from data-* attributes
                var value = button.text();
                var modal = $(this)
                // console.log(timeInputSource)
                modal.find('.modal-title').text(timeInputSource)
                modal.find('.modal-body input').val(value.replace(/[^0-9.:]/g, ''))
            });
            
            // settingsShift-save-time-input
            $('#settingsShift-save-time-input').on('click', function(e) {
                var time_ms = timeString2ms($('#settingsShift-time-input').val());
                // console.log(time_ms);
                if (time_ms <= 86400000) {
                    var msg = {}
                    msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/' + timeInputSource;
                    msg.payload = {'value':[time_ms]};
                    socket.emit('publish', JSON.stringify(msg));
                    console.log(msg);    
                }
                
            });

            // ***********************
            // settingsSirene
            // ***********************
            // settingsSireneGreen actual values
            socket.on(line_name + '/settingsSirene/green', function(msg){
                if (!(jsonEqual(msg, memSettingsSireneGreen))) {
                    console.log(msg);
                    toneSelect('#settingsSirene-green-toneSelect', msg);
                    $('#settingsSirene-green-toneDuration').html(msg.payload['toneDuration'] / 1000 + ' s');
                    toneTest('#settingsSirene-green-test', msg);    
                }
                memSettingsSireneGreen = msg;
                  
            });
            // settingsSireneYellow actual values
            socket.on(line_name + '/settingsSirene/yellow', function(msg){
                if (!(jsonEqual(msg, memSettingsSireneYellow))) {
                    console.log(msg);
                    toneSelect('#settingsSirene-yellow-toneSelect', msg);
                    $('#settingsSirene-yellow-toneDuration').html(msg.payload['toneDuration'] / 1000 + ' s');
                    toneTest('#settingsSirene-yellow-test', msg);   
                }
                memSettingsSireneYellow = msg;
            });

            // settingsSireneRed actual values
            socket.on(line_name + '/settingsSirene/red', function(msg){
                if (!(jsonEqual(msg, memSettingsSireneRed))) {
                    console.log(msg);
                    toneSelect('#settingsSirene-red-toneSelect', msg);
                    $('#settingsSirene-red-toneDuration').html(msg.payload['toneDuration'] / 1000 + ' s');
                    toneTest('#settingsSirene-red-test', msg);
                }
                memSettingsSireneRed = msg;
            });

            // tone select shared modal
            $('#settingsSirene-toneSelectModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                toneSelectSource = button.data('source'); // Extract info from data-* attributes
                var value = button.val();
                var modal = $(this);
                modal.find('.modal-title').text(toneSelectSource);
                $('#settingsSirene-toneSelect').val(value);
            });
            
            // settingsSirene-save-toneSelect
            $('#settingsSirene-save-toneSelect').on('click', function(e) {
                var value = $('#settingsSirene-toneSelect').val();
                var msg = {}
                msg.topic = line_name + '/settingsSirene/' + toneSelectSource;
                msg.payload = {'value':[value]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // tone duration shared modal
            $('#settingsSirene-toneDurationModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                toneDurationSource = button.data('source'); // Extract info from data-* attributes
                var value = button.text();
                var modal = $(this);
                modal.find('.modal-title').text(toneDurationSource);
                modal.find('.modal-body input').val(value.replace(/[^0-9.]/g, ''));
            });

            
            // settingsSirene-save-toneDuration
            $('#settingsSirene-save-toneDuration').on('click', function(e) {
                var value = $('#settingsSirene-inputToneDuration').val() * 1000;
                var msg = {}
                msg.topic = line_name + '/settingsSirene/' + toneDurationSource;
                msg.payload = {'value':[value]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settingsSirene-green-test
            $('#settingsSirene-green-test').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsSirene/green/test';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settingsSirene-yellow-test
            $('#settingsSirene-yellow-test').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsSirene/yellow/test';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settingsSirene-red-test
            $('#settingsSirene-red-test').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settingsSirene/red/test';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });
        });