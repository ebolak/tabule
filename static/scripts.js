// memory state
var memState;
var memEnabled;
var memAutostartEnabled;
var memTarget;
var memTaktTime;
var memCountOption;

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



$(document).ready(function(){
            namespace = name_space; // change to an empty string to use the global namespace
            // the socket.io documentation recommends sending an explicit package upon connection
            // this is specially important when using the global namespace
            var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);

            // on connect
            socket.on('connect', function(msg) {
                console.log('Connected!');
            });

            // on disconect
            socket.on('disconnect', function(){
                console.log('disconnect');
                $('#target').text('####');
                $('#actual').text('####');
                $('#ok').text('####');
                $('#diff').text('####');
                $('#bekido').text('####');
                $('#taktTime').text('####');
            });

            // on disconect
            socket.on('actualValuesError', function(){
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

            // actual values update
            socket.on(line_name + '/actualValues', function(msg){
                console.log(msg);
                $('#target').text(msg.payload['target']);
                $('#actual').text(msg.payload['actual']);
                $('#ok').text(msg.payload['ok']);
                $('#diff').text(msg.payload['diff']);
                $('#bekido').text(computeBekido(msg.payload['ok'], msg.payload['taktTimeCnt']));


                // if state changed update 
                if (msg.payload['state'] !== memState) {
                    $('#control-starttTaktTimeCnt').removeClass('btn-success');
                    $('#control-starttTaktTimeCnt').removeClass('btn-danger');
                    $('#control-starttTaktTimeCnt').removeClass('btn-warning');
                    $('#control-stoptTaktTimeCnt').removeClass('btn-success');
                    $('#control-stoptTaktTimeCnt').removeClass('btn-danger');
                    $('#control-stoptTaktTimeCnt').removeClass('btn-warning');

                    // state 0:undefined, 1:disabled, 2:stopped, 3:running
                    if (msg.payload['state'] === 0) {
                    
                    } else if (msg.payload['state'] === 1) {
                        $('#control-stoptTaktTimeCnt').addClass('btn-danger');
                        $('#control-starttTaktTimeCnt').addClass('btn-danger');
                    } else if (msg.payload['state'] === 2) {
                        $('#control-stopTaktTimeCnt').addClass('btn-warning');    
                    }
                    else if (msg.payload['state'] === 3) {
                        $('#control-starttTaktTimeCnt').addClass('btn-success'); 
                    }
                    memState = msg.payload['state']; 
                }
            });

            // settings values update
            // socket.on('settings', function(msg){
            socket.on(line_name + '/settings', function(msg){
                console.log(msg);
                $('#taktTime').text(msg.payload['taktTime']/1000);


                // if enabled changed update 
                if (msg.payload['enabled'] !== memEnabled) {
                    console.log('enabled changed');
                    // state 0:undefined, 1:disabled, 2:stopped, 3:running
                    if (msg.payload['enabled'] === 0) {
                        $('#settings-enabledOn').removeClass('btn-success');
                        $('#settings-enabledOff').addClass('btn-danger');
                    
                    } else if (msg.payload['enabled'] === 1) {
                        $('#settings-enabledOn').addClass('btn-success');
                        $('#settings-enabledOff').removeClass('btn-danger');
                    }
                    memEnabled = msg.payload['enabled'];
                }
                // if autostartEnabled changed update 
                if (msg.payload['autostartEnabled'] !== memAutostartEnabled) {
                    console.log('autostartEnabled changed');
                    // state 0: disabled, 1: enabled
                    if (msg.payload['autostartEnabled'] === 0) {
                        $('#settings-autostartOn').removeClass('btn-success');
                        $('#settings-autostartOff').addClass('btn-danger');
                    
                    } else if (msg.payload['autostartEnabled'] === 1) {
                        $('#settings-autostartOn').addClass('btn-success');
                        $('#settings-autostartOff').removeClass('btn-danger');
                    }
                    memAutostartEnabled = msg.payload['autostartEnabled'];
                }

                // if target changed update 
                if (msg.payload['target'] !== memTarget) {
                    console.log('target changed');
                    // update button text
                    $('#settings-target').html(msg.payload['target'])
                    memTarget = msg.payload['target'];
                }

                // if taktTime changed update 
                if (msg.payload['taktTime'] !== memTaktTime) {
                    console.log('taktTime changed');
                    // update button text
                    $('#settings-taktTime').html(msg.payload['taktTime']/1000)
                    memTaktTime = msg.payload['taktTime'];
                }

                // if countOption changed update 
                if (msg.payload['countOption'] !== memCountOption) {
                    console.log('countOption changed');
                    // update button text
                    if (msg.payload['countOption'] === 0) {
                        $('#settings-countOption').html('0: OK -1');
                    } else if (msg.payload['countOption'] === 1) {
                        $('#settings-countOption').html('1: VYROBENO +1');
                    } else {
                        $('#settings-countOption').html('####');    
                    }
                    memCountOption = msg.payload['countOption'];
                }


            });
         
            // control-resetCounters
            $('#control-resetCounters').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/control/resetCounters';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // control-start
            $('#control-startTaktTimeCnt').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/control/startTaktTimeCnt';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // control-stop
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

            // settings-enabledOn
            $('#settings-enabledOn').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/enabled';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settings-enabledOff
            $('#settings-enabledOff').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/enabled';
                msg.payload = {'value':[0]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settings-autostartOn
            $('#settings-autostartOn').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/autostartEnabled';
                msg.payload = {'value':[1]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // settings-autostartOff
            $('#settings-autostartOff').on('click', function(e) {
                var msg = {}
                msg.topic = line_name + '/settings/autostartEnabled';
                msg.payload = {'value':[0]};
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
            // settingsShift
            // ***********************
            // settingsShift-select shift get value
            $('#settingsShift-selectShift').change(function() {
                settingsShift_shiftSelect = parseInt($(this).val());
                console.log('settingsShift/' + settingsShift_shiftSelect);
            });

            socket.on(line_name + '/settingsShift/1', function(msg){
                console.log(msg);
                if (settingsShift_shiftSelect === 1) {
                    updateSettingsShift(msg);    
                }                        
            });

            socket.on(line_name + '/settingsShift/2', function(msg){
                console.log(msg);
                if (settingsShift_shiftSelect === 2) {
                    updateSettingsShift(msg);    
                }                        
            });

            socket.on(line_name + '/settingsShift/3', function(msg){
                console.log(msg);
                if (settingsShift_shiftSelect === 3) {
                    updateSettingsShift(msg);    
                }                        
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
            // TODO
            // Load actual values as input n show
            $('#settingsShift-time-inputModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget) // Button that triggered the modal
                timeInputSource = button.data('source') // Extract info from data-* attributes
                // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                var modal = $(this)
                // console.log(timeInputSource)
                modal.find('.modal-title').text(timeInputSource)
            });
            
            // settingsShift-save-time-input
            $('#settingsShift-save-time-input').on('click', function(e) {
                var value = $('#settingsShift-time-input').val();
                console.log(timeString2ms(value));
                var msg = {}
                msg.topic = line_name + '/settingsShift/' + settingsShift_shiftSelect + '/' + timeInputSource;
                msg.payload = {'value':[timeString2ms(value)]};
                socket.emit('publish', JSON.stringify(msg));
                console.log(msg);
            });

            // ***********************
            // settingsSirene
            // ***********************
            // settingsSireneGreen actual values
            socket.on(line_name + '/settingsSirene/green', function(msg){
                console.log(msg);
                $('#settingsSirene-green-toneSelect').html('Tón ' + msg.payload['toneSelect']);
                $('#settingsSirene-green-toneDuration').html(msg.payload['toneDuration'] / 1000 + ' s');
                if (msg.payload['test'] === 1) {
                    $('#settingsSirene-green-test').addClass('btn-success');   
                }
                else {
                    $('#settingsSirene-green-test').removeClass('btn-success'); 
                }
            });

            // settingsSireneYellow actual values
            socket.on(line_name + '/settingsSirene/yellow', function(msg){
                console.log(msg);
                $('#settingsSirene-yellow-toneSelect').html('Tón ' + msg.payload['toneSelect']);
                $('#settingsSirene-yellow-toneDuration').html(msg.payload['toneDuration'] / 1000 + ' s');
                if (msg.payload['test'] === 1) {
                    $('#settingsSirene-yellow-test').addClass('btn-success');   
                }
                else {
                    $('#settingsSirene-yellow-test').removeClass('btn-success'); 
                }
            });

            // settingsSireneRed actual values
            socket.on(line_name + '/settingsSirene/red', function(msg){
                console.log(msg);
                $('#settingsSirene-red-toneSelect').html('Tón ' + msg.payload['toneSelect']);
                $('#settingsSirene-red-toneDuration').html(msg.payload['toneDuration'] / 1000 + ' s');
                if (msg.payload['test'] === 1) {
                    $('#settingsSirene-red-test').addClass('btn-success');   
                }
                else {
                    $('#settingsSirene-red-test').removeClass('btn-success'); 
                }
            });

            // tone select shared modal
            // TODO Load actual values as input n show
            $('#settingsSirene-toneSelectModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget) // Button that triggered the modal
                toneSelectSource = button.data('source') // Extract info from data-* attributes
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                var modal = $(this)
                modal.find('.modal-title').text(toneSelectSource)
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
            // TODO Load actual values as input n show
            $('#settingsSirene-toneDurationModal').on('show.bs.modal', function (event) {
                var button = $(event.relatedTarget); // Button that triggered the modal
                toneDurationSource = button.data('source'); // Extract info from data-* attributes
                // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
                var modal = $(this);
                modal.find('.modal-title').text(toneDurationSource);
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