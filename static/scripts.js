'use strict';

var memSettingsMain;
var memActualValues;
var memPreviousValues;
var memPrePreviousValues;
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
var controlResetSource;

var settingsShift_shiftSelect = 1;

// compute bekido value
var computeBekido = function (ok, counterTactTime) {
  if (counterTactTime > 0) {
    return ((ok / counterTactTime) * 100).toFixed(1).toString();
  } else {
    return 'N/A';
  }
};

var toneSelect = function (idSelector, msg) {
  if (msg.payload['toneSelect'] !== 0) {
    $(idSelector).text('Tón ' + msg.payload['toneSelect']);
  } else {
    $(idSelector).text('Žádný tón');
  }
  $(idSelector).val(msg.payload['toneSelect']);
};

var toneTest = function (idSelector, msg) {
  if (msg.payload['test'] === 1) {
    $(idSelector).addClass('btn-success');
  } else {
    $(idSelector).removeClass('btn-success');
  }
};

function jsonEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

var isNumber = function (evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
};

var isNumberOrDot = function (evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if ((charCode >= 48 && charCode <= 57) || charCode == 46) {
    return true;
  }
  return false;
};

var isNumberOrColon = function (evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 58)) {
    return false;
  }
  return true;
};

var updateBtnVYP = function (idSelector, value) {
  if (value === 0) {
    $(idSelector).html('VYP');
    $(idSelector).removeClass('btn-success');
    $(idSelector).addClass('btn-danger');
  } else if (value == 1) {
    $(idSelector).html('VYP');
    $(idSelector).removeClass('btn-success');
    $(idSelector).removeClass('btn-danger');
  } else {
    $(idSelector).html('###');
    $(idSelector).removeClass('btn-success');
    $(idSelector).removeClass('btn-danger');
  }
};

var updateBtnZAP = function (idSelector, value) {
  if (value === 0) {
    $(idSelector).html('ZAP');
    $(idSelector).removeClass('btn-success');
    $(idSelector).removeClass('btn-danger');
  } else if (value == 1) {
    $(idSelector).html('ZAP');
    $(idSelector).removeClass('btn-danger');
    $(idSelector).addClass('btn-success');
  } else {
    $(idSelector).html('###');
    $(idSelector).removeClass('btn-success');
    $(idSelector).removeClass('btn-danger');
  }
};

var msToTime = function (duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
};

function timeString2ms(a, b) {
  // time(HH:MM:SS.mss) // optimized
  return (
    (a = a.split('.')), // optimized
    (b = a[1] * 1 || 0), // optimized
    (a = a[0].split(':')),
    b +
      (a[2]
        ? a[0] * 3600 + a[1] * 60 + a[2] * 1
        : a[1]
        ? a[0] * 60 + a[1] * 1
        : a[0] * 1) *
        1e3
  ); // optimized
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

var updateSettingsShift = function (msg) {
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
  $('#settingsShift-break1Begin').html(
    msToTime(msg.payload['shiftBreak1Begin'])
  );
  // break1End
  $('#settingsShift-break1End').html(msToTime(msg.payload['shiftBreak1End']));

  // break2EN
  updateBtnVYP('#settingsShift-break2ENOff', msg.payload['shiftBreak2EN']);
  updateBtnZAP('#settingsShift-break2ENOn', msg.payload['shiftBreak2EN']);
  // break2Begin
  $('#settingsShift-break2Begin').html(
    msToTime(msg.payload['shiftBreak2Begin'])
  );
  // break2End
  $('#settingsShift-break2End').html(msToTime(msg.payload['shiftBreak2End']));

  // break3EN
  updateBtnVYP('#settingsShift-break3ENOff', msg.payload['shiftBreak3EN']);
  updateBtnZAP('#settingsShift-break3ENOn', msg.payload['shiftBreak3EN']);
  // break3Begin
  $('#settingsShift-break3Begin').html(
    msToTime(msg.payload['shiftBreak3Begin'])
  );
  // break3End
  $('#settingsShift-break3End').html(msToTime(msg.payload['shiftBreak3End']));

  // break4EN
  updateBtnVYP('#settingsShift-break4ENOff', msg.payload['shiftBreak4EN']);
  updateBtnZAP('#settingsShift-break4ENOn', msg.payload['shiftBreak4EN']);
  // break4Begin
  $('#settingsShift-break4Begin').html(
    msToTime(msg.payload['shiftBreak4Begin'])
  );
  // break4End
  $('#settingsShift-break4End').html(msToTime(msg.payload['shiftBreak4End']));

  // break5EN
  updateBtnVYP('#settingsShift-break5ENOff', msg.payload['shiftBreak5EN']);
  updateBtnZAP('#settingsShift-break5ENOn', msg.payload['shiftBreak5EN']);
  // break5Begin
  $('#settingsShift-break5Begin').html(
    msToTime(msg.payload['shiftBreak5Begin'])
  );
  // break5End
  $('#settingsShift-break5End').html(msToTime(msg.payload['shiftBreak5End']));

  // targetEN
  updateBtnVYP('#settingsShift-targetENOff', msg.payload['shiftTargetEN']);
  updateBtnZAP('#settingsShift-targetENOn', msg.payload['shiftTargetEN']);
  // target
  $('#settingsShift-target').html(msg.payload['shiftTarget'] + ' ks');

  // taktTimeEN
  updateBtnVYP('#settingsShift-taktTimeENOff', msg.payload['shiftTaktTimeEN']);
  updateBtnZAP('#settingsShift-taktTimeENOn', msg.payload['shiftTaktTimeEN']);
  // taktTime
  $('#settingsShift-taktTime').text(msg.payload['shiftTaktTime'] / 1000 + ' s');
};

var dataClear = function () {
  $('#target').text('####');
  $('#actual').text('####');
  $('#ok').text('####');
  $('#difference').text('####');
  $('#bekido').text('####');
  $('#taktTime').text('####');
  $('#previousTarget').text('####');
  $('#previousActual').text('####');
  $('#previousOk').text('####');
  $('#previousDifference').text('####');
  $('#previousBekido').text('####');
  $('#previousTaktTime').text('####');
  memActualValues = null;
  memPreviousValues = null;
  memPrePreviousValues = null;
};

// kick off
$(document).ready(function () {
  // var name_pace is declared in layout template
  const socket = io(name_space);

  // socket.io on connect
  socket.on('connect', () => {
    console.log('Socket.io Connect! Id: ' + socket.id);
    dataClear();
  });

  // socket.io on disconect
  socket.on('disconnect', reason => {
    console.log('Socket.io disconnect! Reason: ' + reason);
    dataClear();
  });

  // socket.io connect_error
  socket.on('connect_error', () => {
    console.log('Socket.io connect error!');
    dataClear();
  });

  // on mqtt connect
  socket.on('mqtt connect', () => {
    console.log('Mqtt connect!');
  });

  // on mqtt disconnect
  socket.on('mqtt disconnect', () => {
    console.log('Mqtt disconnect!');
  });

  // *****************************
  // actual Values
  // *****************************
  socket.on(line_name + '/actualValues', msg => {
    if (!jsonEqual(msg, memActualValues)) {
      console.log(msg);
      $('#target').text(msg.payload['target']);
      $('#taktTime').text(msg.payload['taktTime'] / 1000);
      $('#actual').text(msg.payload['actual']);
      $('#ok').text(msg.payload['ok']);
      $('#difference').text(msg.payload['difference']);
      $('#bekido').text(
        computeBekido(msg.payload['ok'], msg.payload['counterTactTime'])
      );

      $('#control-startTaktTimeCnt').removeClass('btn-success');
      $('#control-startTaktTimeCnt').removeClass('btn-danger');
      $('#control-startTaktTimeCnt').removeClass('btn-warning');
      $('#control-stopTaktTimeCnt').removeClass('btn-success');
      $('#control-stopTaktTimeCnt').removeClass('btn-danger');
      $('#control-stopTaktTimeCnt').removeClass('btn-warning');
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

  // *****************************
  // previous Values
  // *****************************
  socket.on(line_name + '/previousValues', msg => {
    if (!jsonEqual(msg, memPreviousValues)) {
      console.log(msg);
      $('#previousTarget').text(msg.payload['target']);
      $('#previousTaktTime').text(msg.payload['taktTime'] / 1000);
      $('#previousActual').text(msg.payload['actual']);
      $('#previousOk').text(msg.payload['ok']);
      $('#previousDifference').text(msg.payload['difference']);
      $('#previousBekido').text(
        computeBekido(msg.payload['ok'], msg.payload['counterTactTime'])
      );
    }
    memPreviousValues = msg;
  });

  // *****************************
  // prePrevious Values
  // *****************************
  socket.on(line_name + '/prePreviousValues', msg => {
    if (!jsonEqual(msg, memPrePreviousValues)) {
      console.log(msg);
      $('#prePreviousTarget').text(msg.payload['target']);
      $('#prePreviousTaktTime').text(msg.payload['taktTime'] / 1000);
      $('#prePreviousActual').text(msg.payload['actual']);
      $('#prePreviousOk').text(msg.payload['ok']);
      $('#prePreviousDifference').text(msg.payload['difference']);
      $('#prePreviousBekido').text(
        computeBekido(msg.payload['ok'], msg.payload['counterTactTime'])
      );
    }
    memPrePreviousValues = msg;
  });

  // *****************************
  // andon update
  // *****************************
  socket.on(line_name + '/andons', msg => {
    if (!jsonEqual(msg, memAndons)) {
      console.log(msg);
    }
    memAndons = msg;
  });

  // *****************************
  // settings
  // *****************************
  socket.on(line_name + '/settings', msg => {
    if (!jsonEqual(msg, memSettingsMain)) {
      console.log(msg);
      // taktTimeCntOption update
      switch (msg.payload['taktTimeCntOption']) {
        case 0:
          $('#settings-taktTimeCntOption').text('0: Vypnuto');
          // update control btns
          $('#control-startTaktTimeCnt').hide();
          $('#control-stopTaktTimeCnt').hide();
          $('#control-autostartTaktTimeCntEn').text('Vypnuto v nastavení');
          $('#control-autostartTaktTimeCntEn').show();
          break;
        case 1:
          $('#settings-taktTimeCntOption').text('1: Ručně v ovládání');
          // update control btns
          $('#control-startTaktTimeCnt').show();
          $('#control-stopTaktTimeCnt').show();
          $('#control-autostartTaktTimeCntEn').hide();
          break;
        case 2:
          $('#settings-taktTimeCntOption').text(
            '2: Automaticky nastavením směn'
          );
          // update control btns
          $('#control-startTaktTimeCnt').hide();
          $('#control-stopTaktTimeCnt').hide();
          $('#control-autostartTaktTimeCntEn').show();
          break;
        default:
          $('#settings-taktTimeCntOption').text('####');
      }
      // target update
      $('#settings-target').html(msg.payload['target'] + ' ks');

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
      $('#settings-taktTime').text(msg.payload['taktTime'] / 1000 + ' s');
    }
    memSettingsMain = msg;
  });

  // settings-taktTimeCntOption0
  $('#settings-taktTimeCntOption0').on('click', e => {
    let msg = {};
    msg.topic = line_name + '/settings/taktTimeCntOption';
    msg.payload = {
      value: ['0'],
      nodeId: 'ns=3;s="settings"."taktTimeCntOption"',
      datatypeName: 'Int32',
      name: 'taktTimeCntOption',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settings-taktTimeCntOption1
  $('#settings-taktTimeCntOption1').on('click', e => {
    let msg = {};
    msg.topic = line_name + '/settings/taktTimeCntOption';
    msg.payload = {
      value: ['1'],
      nodeId: 'ns=3;s="settings"."taktTimeCntOption"',
      datatypeName: 'Int32',
      name: 'taktTimeCntOption',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settings-taktTimeCntOption2
  $('#settings-taktTimeCntOption2').on('click', e => {
    let msg = {};
    msg.topic = line_name + '/settings/taktTimeCntOption';
    msg.payload = {
      value: ['2'],
      nodeId: 'ns=3;s="settings"."taktTimeCntOption"',
      datatypeName: 'Int32',
      name: 'taktTimeCntOption',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settings-save-target
  $('#settings-save-target').on('click', e => {
    let value = $('#inputTarget').val();
    if ($.isNumeric(value)) {
      var msg = {};
      msg.topic = line_name + '/settings/target';
      msg.payload = {
        value: [value],
        nodeId: 'ns=3;s="settings"."target"',
        datatypeName: 'Int32',
        name: 'target',
      };
      socket.emit('publish', JSON.stringify(msg));
      console.log(msg);
    }
  });

  //  settings - save - target modal default value
  $('#targetModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var value = button.text();
    var modal = $(this);
    modal.find('.modal-body input').val(value.replace(/[^0-9]/g, ''));
  });

  // settings-save-taktTime
  $('#settings-save-taktTime').on('click', function (event) {
    var value = $('#inputTaktTime').val() * 1000;
    if ($.isNumeric(value)) {
      var msg = {};
      msg.topic = line_name + '/settings/taktTime';
      msg.payload = {
        value: [value],
        nodeId: 'ns=3;s="settings"."taktTime"',
        datatypeName: 'Int32',
        name: 'taktTime',
      };
      socket.emit('publish', JSON.stringify(msg));
      console.log(msg);
    }
  });
  // settings-save-taktTime modal default value
  $('#taktTimeModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var value = button.text();
    var modal = $(this);
    modal.find('.modal-body input').val(value.replace(/[^0-9.]/g, ''));
  });

  // settings-countOption0
  $('#settings-countOption0').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/settings/countOption';
    msg.payload = {
      value: ['0'],
      nodeId: 'ns=3;s="settings"."countOption"',
      datatypeName: 'Int32',
      name: 'countOption',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settings-countOption1
  $('#settings-countOption1').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/settings/countOption';
    msg.payload = {
      value: ['1'],
      nodeId: 'ns=3;s="settings"."countOption"',
      datatypeName: 'Int32',
      name: 'countOption',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // ***********************
  // control
  // ***********************

  // control-resetCounters
  $('#control-resetCountersConfirm').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/control/resetCounters';
    msg.payload = {
      value: [1],
      nodeId: 'ns=3;s="control"."resetCounters"',
      datatypeName: 'Int32',
      name: 'resetCounters',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // control-startTaktTimeCnt
  $('#control-startTaktTimeCnt').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/control/startTaktTimeCnt';
    msg.payload = {
      value: ['1'],
      nodeId: 'ns=3;s="control"."startTaktTimeCnt"',
      datatypeName: 'Int32',
      name: 'startTaktTimeCnt',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // control-stopTaktTimeCnt
  $('#control-stopTaktTimeCnt').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/control/stopTaktTimeCnt';
    msg.payload = {
      value: ['1'],
      nodeId: 'ns=3;s="control"."stopTaktTimeCnt"',
      datatypeName: 'Int32',
      name: 'stopTaktTimeCnt',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // control-actualMinus1
  $('#control-actualMinus1').on('click', function (e) {
    var $btn = $(this);
    // visual feedback: briefly add success class
    var prevTimer = $btn.data('fbTimer');
    if (prevTimer) {
      clearTimeout(prevTimer);
    }
    $btn.addClass('btn-success');
    var t = setTimeout(function () {
      $btn.removeClass('btn-success');
      $btn.removeData('fbTimer');
    }, 250);
    $btn.data('fbTimer', t);

    var msg = {};
    msg.topic = line_name + '/control/actualMinus1';
    msg.payload = {
      value: [1],
      nodeId: 'ns=3;s="control"."actualMinus1"',
      datatypeName: 'Int32',
      name: 'actualMinus1',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // control-actualPlus1
  $('#control-actualPlus1').on('click', function (e) {
    var $btn = $(this);
    // visual feedback: briefly add success class
    var prevTimer = $btn.data('fbTimer');
    if (prevTimer) {
      clearTimeout(prevTimer);
    }
    $btn.addClass('btn-success');
    var t = setTimeout(function () {
      $btn.removeClass('btn-success');
      $btn.removeData('fbTimer');
    }, 250);
    $btn.data('fbTimer', t);

    var msg = {};
    msg.topic = line_name + '/control/actualPlus1';
    msg.payload = {
      value: [1],
      nodeId: 'ns=3;s="control"."actualPlus1"',
      datatypeName: 'Int32',
      name: 'actualPlus1',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // ***********************
  // settingsShift
  // ***********************
  // settingsShift-select shift get value
  $('#settingsShift-selectShift').change(function () {
    settingsShift_shiftSelect = parseInt($(this).val());
    delete memSettingsShift[settingsShift_shiftSelect.toString()];
  });

  socket.on(line_name + '/settingsShift/1', function (msg) {
    if (!jsonEqual(msg, memSettingsShift['1'])) {
      console.log(msg);
      if (settingsShift_shiftSelect === 1) {
        updateSettingsShift(msg);
      }
    }
    memSettingsShift['1'] = msg;
  });

  socket.on(line_name + '/settingsShift/2', function (msg) {
    if (!jsonEqual(msg, memSettingsShift['2'])) {
      console.log(msg);
      if (settingsShift_shiftSelect === 2) {
        updateSettingsShift(msg);
      }
    }
    memSettingsShift['2'] = msg;
  });

  socket.on(line_name + '/settingsShift/3', function (msg) {
    if (!jsonEqual(msg, memSettingsShift['3'])) {
      console.log(msg);
      if (settingsShift_shiftSelect === 3) {
        updateSettingsShift(msg);
      }
    }
    memSettingsShift['3'] = msg;
  });

  // settingsShift-shiftENOff
  $('#settingsShift-shiftENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/shiftEN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."shiftEN"',
      datatypeName: 'Int32',
      name: 'shiftEN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-shiftENOn
  $('#settingsShift-shiftENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/shiftEN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."shiftEN"',
      datatypeName: 'Int32',
      name: 'shiftEN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsShift-break1ENOff
  $('#settingsShift-break1ENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break1EN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break1EN"',
      datatypeName: 'Int32',
      name: 'break1EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-break1ENOn
  $('#settingsShift-break1ENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break1EN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break1EN"',
      datatypeName: 'Int32',
      name: 'break1EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsShift-break2ENOff
  $('#settingsShift-break2ENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break2EN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break2EN"',
      datatypeName: 'Int32',
      name: 'break2EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-break1ENOn
  $('#settingsShift-break2ENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break2EN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break2EN"',
      datatypeName: 'Int32',
      name: 'break2EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsShift-break3ENOff
  $('#settingsShift-break3ENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break3EN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break3EN"',
      datatypeName: 'Int32',
      name: 'break3EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-break3ENOn
  $('#settingsShift-break3ENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break3EN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break3EN"',
      datatypeName: 'Int32',
      name: 'break3EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-break4ENOff
  $('#settingsShift-break4ENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break4EN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break4EN"',
      datatypeName: 'Int32',
      name: 'break4EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-break4ENOn
  $('#settingsShift-break4ENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break4EN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break4EN"',
      datatypeName: 'Int32',
      name: 'break4EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-break5ENOff
  $('#settingsShift-break5ENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break5EN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break5EN"',
      datatypeName: 'Int32',
      name: 'break5EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-break5ENOn
  $('#settingsShift-break5ENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/break5EN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."break5EN"',
      datatypeName: 'Int32',
      name: 'break5EN',
    };
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
    var modal = $(this);
    // console.log(timeInputSource)
    modal.find('.modal-title').text(timeInputSource);
    modal.find('.modal-body input').val(value.replace(/[^0-9.:]/g, ''));
  });

  // settingsShift-save-time-input
  $('#settingsShift-save-time-input').on('click', function (e) {
    var time_ms = parseInt(timeString2ms($('#settingsShift-time-input').val()));
    // console.log(time_ms);
    if (time_ms <= 86399999) {
      var msg = {};
      msg.topic =
        line_name +
        '/settingsShift/' +
        settingsShift_shiftSelect +
        '/' +
        timeInputSource;
      msg.payload = {
        value: [time_ms],
        nodeId:
          'ns=3;s="settingsShift"."' +
          settingsShift_shiftSelect +
          '"."' +
          timeInputSource +
          '"',
        datatypeName: 'UInt32',
        name: 'timeInputSource',
      };
      socket.emit('publish', JSON.stringify(msg));
      console.log(msg);
    }
  });

  // settingsShift-targetENOn
  $('#settingsShift-targetENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/targetEN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."targetEN"',
      datatypeName: 'Int32',
      name: 'targetEN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsShift-targetENOff
  $('#settingsShift-targetENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/targetEN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."targetEN"',
      datatypeName: 'Int32',
      name: 'targetEN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
  // settingsShift-taktTimeENOn
  $('#settingsShift-taktTimeENOn').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/taktTimeEN';
    msg.payload = {
      value: ['1'],
      nodeId:
        'ns=3;s="settingsShift"."' +
        settingsShift_shiftSelect +
        '"."taktTimeEN"',
      datatypeName: 'Int32',
      name: 'taktTimeEN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsShift-taktTimeENOff
  $('#settingsShift-taktTimeENOff').on('click', function (e) {
    var msg = {};
    msg.topic =
      line_name + '/settingsShift/' + settingsShift_shiftSelect + '/taktTimeEN';
    msg.payload = {
      value: ['0'],
      nodeId:
        'ns=3;s="settingsShift"."' +
        settingsShift_shiftSelect +
        '"."taktTimeEN"',
      datatypeName: 'Int32',
      name: 'taktTime1EN',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsShift-save-target
  $('#settingsShift-save-target').on('click', e => {
    let value = $('#inputTarget').val();
    if ($.isNumeric(value)) {
      var msg = {};
      msg.topic =
        line_name + '/settingsShift/' + settingsShift_shiftSelect + '/target';
      msg.payload = {
        value: [value],
        nodeId:
          'ns=3;s="settingsShift"."' + settingsShift_shiftSelect + '"."target"',
        datatypeName: 'Int32',
        name: 'target',
      };
      socket.emit('publish', JSON.stringify(msg));
      console.log(msg);
    }
  });

  //  settings - save - target modal default value
  // $('#targetModal').on('show.bs.modal', function (event) {
  //     var button = $(event.relatedTarget);
  //     var value = button.text();
  //     var modal = $(this);
  //     modal.find('.modal-body input').val(value.replace(/[^0-9]/g, ''))
  // });

  // settingsSetings-save-taktTime
  $('#settingsShift-save-taktTime').on('click', function (event) {
    var value = $('#inputTaktTime').val() * 1000;
    if ($.isNumeric(value)) {
      var msg = {};
      msg.topic =
        line_name + '/settingsShift/' + settingsShift_shiftSelect + '/taktTime';
      msg.payload = {
        value: [value],
        nodeId:
          'ns=3;s="settingsShift"."' +
          settingsShift_shiftSelect +
          '"."taktTime"',
        datatypeName: 'Int32',
        name: 'taktTime',
      };
      socket.emit('publish', JSON.stringify(msg));
      console.log(msg);
    }
  });

  // ***********************
  // settingsSirene
  // ***********************
  // settingsSireneGreen actual values
  socket.on(line_name + '/settingsSirene/green', function (msg) {
    if (!jsonEqual(msg, memSettingsSireneGreen)) {
      console.log(msg);
      toneSelect('#settingsSirene-green-toneSelect', msg);
      $('#settingsSirene-green-toneDuration').html(
        msg.payload['toneDuration'] / 1000 + ' s'
      );
      toneTest('#settingsSirene-green-test', msg);
    }
    memSettingsSireneGreen = msg;
  });
  // settingsSireneYellow actual values
  socket.on(line_name + '/settingsSirene/yellow', function (msg) {
    if (!jsonEqual(msg, memSettingsSireneYellow)) {
      console.log(msg);
      toneSelect('#settingsSirene-yellow-toneSelect', msg);
      $('#settingsSirene-yellow-toneDuration').html(
        msg.payload['toneDuration'] / 1000 + ' s'
      );
      toneTest('#settingsSirene-yellow-test', msg);
    }
    memSettingsSireneYellow = msg;
  });

  // settingsSireneRed actual values
  socket.on(line_name + '/settingsSirene/red', function (msg) {
    if (!jsonEqual(msg, memSettingsSireneRed)) {
      console.log(msg);
      toneSelect('#settingsSirene-red-toneSelect', msg);
      $('#settingsSirene-red-toneDuration').html(
        msg.payload['toneDuration'] / 1000 + ' s'
      );
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
  $('#settingsSirene-save-toneSelect').on('click', function (e) {
    var value = $('#settingsSirene-toneSelect').val();
    var nodeId = toneSelectSource.split('/');
    var msg = {};
    msg.topic = line_name + '/settingsSirene/' + toneSelectSource;
    msg.payload = {
      value: [value],
      nodeId: 'ns=3;s="settingsSirene"."' + nodeId[0] + '"."' + nodeId[1] + '"',
      datatypeName: 'Int32',
      name: nodeId[1],
    };
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
  $('#settingsSirene-save-toneDuration').on('click', function (e) {
    var value = parseInt($('#settingsSirene-inputToneDuration').val() * 1000);
    var nodeId = toneDurationSource.split('/');
    var msg = {};
    msg.topic = line_name + '/settingsSirene/' + toneDurationSource;
    msg.payload = {
      value: [value],
      nodeId: 'ns=3;s="settingsSirene"."' + nodeId[0] + '"."' + nodeId[1] + '"',
      datatypeName: 'Int32',
      name: nodeId[1],
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsSirene-green-test
  $('#settingsSirene-green-test').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/settingsSirene/green/test';
    msg.payload = {
      value: ['1'],
      nodeId: 'ns=3;s="settingsSirene"."green"."test"',
      datatypeName: 'Int32',
      name: 'test',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsSirene-yellow-test
  $('#settingsSirene-yellow-test').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/settingsSirene/yellow/test';
    msg.payload = {
      value: ['1'],
      nodeId: 'ns=3;s="settingsSirene"."yellow"."test"',
      datatypeName: 'Int32',
      name: 'test',
    };
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });

  // settingsSirene-red-test
  $('#settingsSirene-red-test').on('click', function (e) {
    var msg = {};
    msg.topic = line_name + '/settingsSirene/red/test';
    msg.payload = {
      value: ['1'],
      nodeId: 'ns=3;s="settingsSirene"."red"."test"',
      datatypeName: 'Int32',
      name: 'test',
    };
    //socket.emit('publish', JSON.stringify(msg));
    socket.emit('publish', JSON.stringify(msg));
    console.log(msg);
  });
});
