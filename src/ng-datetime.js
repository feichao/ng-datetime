(function() {
  'use strict';

  var moment = moment || window.moment;

  if(moment && moment.fn) {
    if(!moment.addSeconds) {
      moment.fn.addSeconds = function(num) {
        return this.add(num, 'seconds');
      };
    }

    if(!moment.addMinutes) {
      moment.fn.addMinutes = function(num) {
        return this.add(num, 'minutes');
      };
    }

    if(!moment.addHours) {
      moment.fn.addHours = function(num) {
        return this.add(num, 'hours');
      };
    }

    if(!moment.addDays) {
      moment.fn.addDays = function(num) {
        return this.add(num, 'days');
      };
    }

    if(!moment.addMonths) {
      moment.fn.addMonths = function(num) {
        return this.add(num, 'months');
      };
    }

    if(!moment.addYears) {
      moment.fn.addYears = function(num) {
        return this.add(num, 'years');
      };
    }

    if(!moment.subtractSeconds) {
      moment.fn.subtractSeconds = function(num) {
        return this.subtract(num, 'seconds');
      };
    }

    if(!moment.subtractMinutes) {
      moment.fn.subtractMinutes = function(num) {
        return this.subtract(num, 'minutes');
      };
    }

    if(!moment.subtractHours) {
      moment.fn.subtractHours = function(num) {
        return this.subtract(num, 'hours');
      };
    }

    if(!moment.subtractDays) {
      moment.fn.subtractDays = function(num) {
        return this.subtract(num, 'days');
      };
    }

    if(!moment.subtractMonths) {
      moment.fn.subtractMonths = function(num) {
        return this.subtract(num, 'months');
      };
    }

    if(!moment.subtractYears) {
      moment.fn.subtractYears = function(num) {
        return this.subtract(num, 'years');
      };
    }

    if(!moment.diffDays) {
      moment.fn.diffDays = function(m) {
        return this.diff(moment(m), 'days');
      };
    }

    if(!moment.diffDays) {
      moment.fn.diffSeconds = function(m) {
        return this.diff(moment(m), 'seconds');
      };
    }
  }

  var TEMPLATE_QUICK_SELECT = [
    '<ul class="quick-select">',
    '  <li ng-repeat="qs in dtQSelect">',
    '    <md-button ng-click="qSelect(qs.value)">{{ ::qs.label }}</md-button>',
    '  </li>',
    '</ul>',
  ].join('');

  var TEMPLATE_DATE = [
    '<div layout="{{ ::isDiaplayBlock ? \'column\' : \'row\' }}" layout-align="{{ ::isDiaplayBlock ? \'center start\' : \'start center\' }}">',
    '<table class="date-picker" ng-repeat="picker in pickers">',
    '  <tbody>',
    // years && months
    '    <tr class="picker-header" ng-if="picker.isShowDatePicker">',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusYear(picker)">',
    '          <ng-md-icon size="24" aria-label="left" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td colspan="2" class="tx-center">{{ picker.yearNum }}</td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addYear(picker)">',
    '          <ng-md-icon size="24" aria-label="right" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusMonth(picker)">',
    '          <ng-md-icon size="24" aria-label="left" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-menu>',
    '          <md-button class="md-icon-button md-mini" ng-click="$mdOpenMenu($event)"> {{ picker.monthNum }}</md-button>',
    '          <md-menu-content layout="row" layout-align="space-between" layout-wrap class="flex-menu-content">',
    '            <md-menu-item ng-repeat="month in months">',
    '              <md-button ng-click="setMonth(picker, month, $event)">{{ month }}</md-button>',
    '            </md-menu-item>',
    '          </md-menu-content>',
    '        </md-menu>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMonth(picker)">',
    '          <ng-md-icon size="24" aria-label="right" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '    </tr>',
    // weeks header
    '    <tr class="week-header" ng-if="picker.isShowDatePicker">',
    '      <td ng-repeat="week in staticString.weeks">{{ ::week }}</td>',
    '    </tr>',
    // days 
    '    <tr ng-repeat="row in picker.days" ng-if="picker.isShowDatePicker">',
    '      <td ng-repeat="dayInfo in row track by $index" class="{{ dayInfo.dayParentClass }}">',
    '        <md-button class="md-icon-button md-mini {{ dayInfo.dayClass }}" ng-click="setDate(picker, dayInfo)" ',
    '           ng-disabled="dayInfo.isDisabled">',
    '          {{ ::dayInfo.day }}',
    '        </md-button>',
    '      </td>',
    '    </tr>',
    // times
    '    <tr class="time-picker" ng-if="picker.isShowTimePicker">',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusHour(picker)">',
    '          <ng-md-icon size="24" aria-label="left" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-menu>',
    '          <md-button class="md-icon-button md-mini" ng-click="$mdOpenMenu($event)"> {{ picker.hourNum }}</md-button>',
    '          <md-menu-content layout="row" layout-align="space-between" layout-wrap class="flex-menu-content hour-menu-content">',
    '            <md-menu-item ng-repeat="hour in hours">',
    '              <md-button ng-click="setHour(picker, hour, $event)">{{ hour }}</md-button>',
    '            </md-menu-item>',
    '          </md-menu-content>',
    '        </md-menu>',
    '      </td>',
    '      <td class="split-time">',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addHour(picker)">',
    '          <ng-md-icon size="24" aria-label="right" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusMinute(picker)">',
    '          <ng-md-icon size="24" aria-label="left" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-menu>',
    '          <md-button class="md-icon-button md-mini" ng-click="$mdOpenMenu($event)"> {{ picker.minuteNum }}</md-button>',
    '          <md-menu-content layout="row" layout-align="space-between" layout-wrap class="flex-menu-content minute-menu-content">',
    '            <md-menu-item ng-repeat="minute in minutesSeconds">',
    '              <md-button ng-click="setMinute(picker, minute, $event)">{{ minute }}</md-button>',
    '            </md-menu-item>',
    '          </md-menu-content>',
    '        </md-menu>',
    '      </td>',
    '      <td class="split-time">',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMinute(picker)">',
    '          <ng-md-icon size="24" aria-label="right" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-menu>',
    '          <md-button class="md-icon-button md-mini" ng-click="$mdOpenMenu($event)"> {{ picker.secondNum }}</md-button>',
    '          <md-menu-content layout="row" layout-align="space-between" layout-wrap class="flex-menu-content minute-menu-content">',
    '            <md-menu-item ng-repeat="second in minutesSeconds">',
    '              <md-button ng-click="setSecond(picker, second, $event)">{{ second }}</md-button>',
    '            </md-menu-item>',
    '          </md-menu-content>',
    '        </md-menu>',
    '      </td>',
    '    </tr>',
    '  </tbody>',
    '</table>',
    '</div>'
  ].join('');

  var TEMPLATE_ACTIONS = [
    '<div layout="row" class="actions">',
    '  <md-button class="md-raised" ng-click="setToday()" ng-if="isSetToday">{{ staticString.today }}</md-button>',
    '  <span flex></span>',
    '  <span ng-if="restrictsActive" class="warn-text">{{ restrictTips }}</span>',
    '  <md-button class="md-warn md-raised" ng-click="cancel()">{{ staticString.cancel }}</md-button>',
    '  <md-button class="md-primary md-raised" ng-click="confirm()" ng-disabled="isDatetimeInvalid()">{{ staticString.confirm }}</md-button>',
    '</div>'
  ].join('');

  var DATE_TYPE = {
    DATE: 'date',
    TIME: 'time',
    DATETIME: 'datetime',
    DATE_RANGE: 'date-range',
    TIME_RANGE: 'time-range',
    DATETIME_RANGE: 'datetime-range',
    DATE_TIMERANGE: 'date-timerange'
  };

  var STATIC_STRING = {
    en: {
      today: 'Today',
      cancel: 'Cancel',
      confirm: 'Ok',
      weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    cn: {
      today: '今天',
      cancel: '取消',
      confirm: '确定',
      weeks: ['日', '一', '二', '三', '四', '五', '六']
    }
  };

  var DATE_DEFAULT_FORMAT = 'YYYY-MM-DD';
  var TIME_DEFAULT_FORMAT = 'HH:mm:ss';
  var DATETIME_DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  angular
    .module('ngDatetime', [])
    .directive('ngDatetime', ngDatetimeDirective);

  /**
   * ngDatetime directive
   * @returns {
   *  dtType: {@} illustrate current datetime pciker type, detail for DATE_TYPE
   *  dtQSelect: {=} illustrate quick select
   *  dtConfirm: {&} callback when click confirm button
   *  dtCancel: {&} callback when click cancel button
   *  format: {@} datetime format
   *  startChoice: {=} illustrate start datetime if dtType is **-range 
   *  endChoice: {=} illustrate end datetime if dtType is **-range 
   *  choice: {=} illustrate datetime if dtType is not **-range
   *  max: {@} illustrate max datetime user can select
   *  max: {@} illustrate min datetime user can select
   *  maxLength: {@} illustrate max length between startChoice & endChoice only if dtType is **-range
   *  minLength: {@} illustrate min length between startChoice & endChoice only if dtType is **-range 
   * }
   */
  function ngDatetimeDirective() {
    return {
      restrict: 'E',
      scope: {
        dtType: '@',
        dtQSelect: '=',
        dtConfirm: '&',
        dtCancel: '&',
        format: '@',

        // datetime params
        startChoice: '=',
        endChoice: '=',
        choice: '=',

        // restrict datetime params
        max: '@',
        min: '@',
        maxLength: '@',
        minLength: '@',

        // custom restricts. if the restrict condition actived, just show custom messages and disable confirm button.
        // it suports 'max-interval' and 'min-interval' in current version.
        // example for use: 
        // restricts: [{
        //   name: 'max-interval',
        //   intervalSeconds: 24 * 60 * 60, 
        //   message: 'time inveral must less than 24 hours'
        // }, {
        //   name: 'min-interval',
        //   intervalSeconds: 5 * 60, 
        //   message: 'time inveral must more than 5 minutes'
        // }],
        restricts: '=',

        // language
        dtLanguage: '='
      },
      template: [
        '<div class="ng-datetime">',
        '  <div layout="row">',
        TEMPLATE_QUICK_SELECT,
        TEMPLATE_DATE,
        '  </div>',
        TEMPLATE_ACTIONS,
        '</div>'
      ].join(''),
      compile: ngDatetimeCompile
    };
  }

  function ngDatetimeCompile(tElement, tAttr) {
    return function($scope, element, attr) {
      if(typeof moment !== 'function' || !moment.fn) {
        console.log('cant find momentjs lib');
        return;
      }

      $scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      $scope.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
      $scope.minutesSeconds = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

      $scope.staticString = STATIC_STRING['cn'];
      if(attr.dtLanguage) {
        $scope.dtLanguage = $scope.dtLanguage || attr.dtLanguage || 'cn';
        if($scope.dtLanguage === 'en') {
          $scope.staticString = STATIC_STRING['en'];
        } else if($scope.dtLanguage === 'cn') {
          $scope.staticString = STATIC_STRING['cn'];
        } else {
          if(typeof $scope.dtLanguage === 'string') {
            $scope.staticString = STATIC_STRING['cn'];
          } else {
            $scope.staticString = angular.extend({}, STATIC_STRING['cn'], $scope.dtLanguage);
          }
        }
      }

      $scope.init = function() {
        $scope.restrictsActive = false;
        $scope.restrictTips = '';
        $scope.maxDate = $scope.max ? moment($scope.max, $scope.format) : undefined;
        $scope.minDate = $scope.min ? moment($scope.min, $scope.format) : undefined;
        switch($scope.dtType) {
          case DATE_TYPE.DATE:
          default:
            $scope.dtType = DATE_TYPE.DATE; // default
            $scope.format = $scope.format || DATE_DEFAULT_FORMAT;
            $scope.pickers = [$scope.getPickerInfo(true, false, moment($scope.choice, $scope.format), 0)];
            break;
          case DATE_TYPE.TIME:
            $scope.format = $scope.format || TIME_DEFAULT_FORMAT;
            $scope.pickers = [$scope.getPickerInfo(false, true, moment($scope.choice, $scope.format), 0)];
            break;
          case DATE_TYPE.DATETIME:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [$scope.getPickerInfo(true, true, moment($scope.choice, $scope.format), 0)];
            break;
          case DATE_TYPE.DATE_RANGE:
            $scope.format = $scope.format || DATE_DEFAULT_FORMAT;
            $scope.pickers = [$scope.getPickerInfo(true, false, moment($scope.startChoice, $scope.format), 0), $scope.getPickerInfo(true, false, moment($scope.endChoice, $scope.format), 1)];
            break;
          case DATE_TYPE.TIME_RANGE:
            $scope.format = $scope.format || TIME_DEFAULT_FORMAT;
            $scope.pickers = [$scope.getPickerInfo(false, true, moment($scope.startChoice, $scope.format), 0), $scope.getPickerInfo(false, true, moment($scope.endChoice, $scope.format), 1)];
            break;
          case DATE_TYPE.DATETIME_RANGE:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [$scope.getPickerInfo(true, true, moment($scope.startChoice, $scope.format), 0), $scope.getPickerInfo(true, true, moment($scope.endChoice, $scope.format), 1)];
            break;
          case DATE_TYPE.DATE_TIMERANGE:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [$scope.getPickerInfo(true, true, moment($scope.startChoice, $scope.format), 0), $scope.getPickerInfo(false, true, moment($scope.endChoice, $scope.format), 1)];
            break;
        }
      };

      $scope.getPickerInfo = function(isDate, isTime, mDatetime, pickerIndex) {
        var datetime = mDatetime.format(DATETIME_DEFAULT_FORMAT);
        var result = {
          datetime: datetime,
          days: calcDays($scope, mDatetime),
          isShowDatePicker: isDate,
          isShowTimePicker: isTime,
          yearNum: mDatetime.format('YYYY'),
          monthNum: mDatetime.format('MM'),
          hourNum: mDatetime.format('HH'),
          minuteNum: mDatetime.format('mm'),
          secondNum: mDatetime.format('ss'),
        };

        if($scope.isDateRange) {
          setDaysDisabledStatus(result, $scope.format, true, pickerIndex, $scope.minDate, $scope.maxDate, moment($scope.startChoice, $scope.format), moment($scope.endChoice, $scope.format), $scope.minLength, $scope.maxLength);
        } else if($scope.minDate || $scope.maxDate) {
          setDaysDisabledStatus(result, $scope.format, false, pickerIndex, $scope.minDate, $scope.maxDate);
        } else {
          getDaysClass(result);
        }

        return result;
      };

      $scope.isRange = /range/.test($scope.dtType);
      $scope.isDateRange = $scope.dtType === DATE_TYPE.DATE_RANGE || $scope.dtType === DATE_TYPE.DATETIME_RANGE;
      $scope.isSetToday = $scope.dtType === DATE_TYPE.DATE || $scope.dtType === DATE_TYPE.DATETIME || $scope.dtType === DATE_TYPE.DATE_TIMERANGE;
      $scope.isDiaplayBlock = $scope.dtType === DATE_TYPE.TIME_RANGE || $scope.dtType === DATE_TYPE.DATE_TIMERANGE;

      $scope.setDate = function(picker, dayInfo) {
        $scope.setPickerDatetimeInfo(picker, dayInfo.datetime);
      };

      $scope.setPickerDatetimeInfo = function(picker, newDt) {
        var picker0 = $scope.pickers[0];
        var picker1 = $scope.pickers[1];
        var pickerIndex = $scope.pickers.indexOf(picker);
        var pMoment = moment(picker.datetime);

        if(pMoment.format('YYYY') !== newDt.format('YYYY') ||
          pMoment.format('MM') !== newDt.format('MM')) {
          picker.days = calcDays($scope, newDt);
        } else if(pMoment.format('DD') !== newDt.format('DD')) {
          setCalendarDayTime(picker, newDt);
          if($scope.dtType === DATE_TYPE.DATE_TIMERANGE) { // date-timerange
            unSelectDay(picker0, pMoment);
            selectDay(picker0, newDt);
          } else {
            unSelectDay(picker, pMoment);
            selectDay(picker, newDt);
          }
        } else if(pMoment.format('HH') !== newDt.format('HH') ||
          pMoment.format('mm') !== newDt.format('mm') ||
          pMoment.format('ss') !== newDt.format('ss')) {
          setCalendarDayTime(picker, newDt);
        }

        if($scope.dtType === DATE_TYPE.DATE_TIMERANGE) { // date-timerange
          picker0.yearNum = picker1.yearNum = newDt.format('YYYY');
          picker0.monthNum = picker1.monthNum = newDt.format('MM');
          picker0.datetime = newDt.format(DATE_DEFAULT_FORMAT) + ' ' + moment(picker0.datetime).format(TIME_DEFAULT_FORMAT);
          picker1.datetime = newDt.format(DATE_DEFAULT_FORMAT) + ' ' + moment(picker1.datetime).format(TIME_DEFAULT_FORMAT);
        } else {
          picker.yearNum = newDt.format('YYYY');
          picker.monthNum = newDt.format('MM');
        }

        picker.datetime = newDt.format(DATETIME_DEFAULT_FORMAT);
        picker.hourNum = newDt.format('HH');
        picker.minuteNum = newDt.format('mm');
        picker.secondNum = newDt.format('ss');

        // until picker.datetime is assign
        if($scope.isDateRange) {
          var picker0Dt = moment($scope.pickers[0].datetime, $scope.format);
          var picker1Dt = moment($scope.pickers[1].datetime, $scope.format);
          setDaysDisabledStatus($scope.pickers[0], $scope.format, true, 0, $scope.minDate, $scope.maxDate, picker0Dt, picker1Dt, $scope.minLength, $scope.maxLength);
          setDaysDisabledStatus($scope.pickers[1], $scope.format, true, 1, $scope.minDate, $scope.maxDate, picker0Dt, picker1Dt, $scope.minLength, $scope.maxLength);
        } else if($scope.minDate || $scope.maxDate) {
          setDaysDisabledStatus(picker, $scope.format, false, 0, $scope.minDate, $scope.maxDate);
        } else {
          getDaysClass(picker);
        }
      };

      $scope.qSelect = function(seconds, picker) {
        if(angular.isArray(seconds) && $scope.isRange) {
          $scope.qSelect(seconds[0], $scope.pickers[0]);
          $scope.qSelect(seconds[1], $scope.pickers[1]);
          return;
        }

        var dtType = $scope.dtType;
        //var oneDaySeconds = 24 * 60 * 60;
        // if ((dtType === DATE_TYPE.DATE || dtType === DATE_TYPE.DATE_RANGE) && seconds < oneDaySeconds) {
        //   return;
        // }

        // if ((dtType === DATE_TYPE.TIME || dtType === DATE_TYPE.TIME_RANGE) && seconds > oneDaySeconds) {
        //   return;
        // }

        if(picker) {
          $scope._setToday(picker);
          $scope.minusSeconds(picker, seconds);
          return;
        }

        var pickerTmp;
        if(dtType === DATE_TYPE.DATE || dtType === DATE_TYPE.DATETIME || dtType === DATE_TYPE.TIME) {
          pickerTmp = $scope.pickers[0];
          $scope._setToday(pickerTmp);
          $scope.minusSeconds(pickerTmp, seconds);
        } else { // range
          $scope._setToday($scope.pickers[0]);
          $scope._setToday($scope.pickers[1]);
          $scope.minusSeconds($scope.pickers[0], seconds);
        }
      };

      $scope._setToday = function(picker) {
        if(picker) {
          $scope.setPickerDatetimeInfo(picker, moment());
        }
      };

      $scope.isDatetimeInvalid = function() {
        if($scope.restricts && $scope.restricts instanceof Array && $scope.restricts.length > 0) {
          var length = $scope.restricts.length;
          var e;
          var isActive = false;
          var message = '';
          for(var i = 0; i < length; ++i) {
            e = $scope.restricts[i];
            if(e.name === 'max-interval' && $scope.isRange) {
              var interval = e.intervalSeconds; // should be seconds
              if(interval > 0) {
                var currentDiff = moment($scope.pickers[1].datetime, $scope.format).diffSeconds($scope.pickers[0].datetime);
                if(currentDiff > interval) {
                  isActive = true;
                  message = e.message;
                  break;
                }
              }
            } else if(e.name === 'min-interval' && $scope.isRange) {
              var interval = e.intervalSeconds; // should be seconds
              if(interval > 0) {
                var currentDiff = moment($scope.pickers[1].datetime, $scope.format).diffSeconds($scope.pickers[0].datetime);
                if(currentDiff < interval) {
                  isActive = true;
                  message = e.message;
                  break;
                }
              }
            }
          }

          $scope.restrictsActive = isActive;
          $scope.restrictTips = message;
        }
        return $scope.restrictsActive || $scope.pickers[0].isInvalid || ($scope.pickers[1] && $scope.pickers[1].isInvalid);
      };

      $scope = angular.extend($scope, {
        minusYear: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).subtractYears(1));
        },
        addYear: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).addYears(1));
        },
        minusMonth: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).subtractMonths(1));
        },
        addMonth: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).addMonths(1));
        },
        minusHour: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).subtractHours(1));
        },
        addHour: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).addHours(1));
        },
        minusMinute: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).subtractMinutes(1));
        },
        addMinute: function(picker) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).addMinutes(1));
        },
        minusSeconds: function(picker, seconds) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).subtractSeconds(seconds || 1));
        },
        addSeconds: function(picker, seconds) {
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).addSeconds(seconds || 1));
        },
        setMonth: function(picker, month, $event) {
          $event.stopPropagation();
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).month(month - 1));
        },
        setHour: function(picker, hour, $event) {
          $event.stopPropagation();
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).hour(hour));
        },
        setMinute: function(picker, minute, $event) {
          $event.stopPropagation();
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).minute(minute));
        },
        setSecond: function(picker, second, $event) {
          $event.stopPropagation();
          $scope.setPickerDatetimeInfo(picker, moment(picker.datetime).second(second));
        },
        setToday: function() {
          $scope._setToday($scope.pickers[0]);
        },
        cancel: function() {
          if(typeof $scope.dtCancel === 'function') {
            $scope.dtCancel();
          }
        },
        confirm: function() {
          var picker0 = $scope.pickers[0];
          var picker1 = $scope.pickers[1];
          if(typeof $scope.dtConfirm === 'function') {
            if(picker0 && picker1) {
              $scope.startChoice = moment(picker0.datetime).format($scope.format);
              $scope.endChoice = moment(picker1.datetime).format($scope.format);
              $scope.dtConfirm({ startChoice: $scope.startChoice, endChoice: $scope.endChoice });
            } else {
              $scope.choice = moment(picker0.datetime).format($scope.format);
              $scope.dtConfirm({ choice: $scope.choice });
            }
          }
        }
      });

      $scope.init();
    };
  }

  /**
   * calc one month days, include current month date, pre month date, next month date
   * @param { object } scope
   * @param {string or moment} datetime: date string or moment object
   * @returns [array] two-dimensional array with 6 * 7, every row includes one week days
   */
  function calcDays(scope, datetime) {
    var datetimeMoment = moment(datetime);

    var days = new Array(42);
    var dayLength = datetimeMoment.daysInMonth();
    var firstDay = moment(datetime).subtractDays(datetimeMoment.format('DD') - 1);
    var firstDayWeekDay = firstDay.weekday();

    for(var i = 0; i < dayLength; i++) {
      var index = i + firstDayWeekDay;
      days[index] = setDay(scope, datetimeMoment, firstDay, index, i, true);
    }

    for(var j = 1; j <= firstDayWeekDay; j++) {
      var index = firstDayWeekDay - j;
      days[index] = setDay(scope, datetimeMoment, firstDay, index, -j, false);
    }

    for(var k = dayLength; k < 42; k++) {
      var index = firstDayWeekDay + k;
      days[index] = setDay(scope, datetimeMoment, firstDay, index, k, false);
    }

    var result = [];
    for(var l = 0; l < 6; l++) {
      result.push(days.slice(l * 7, (l + 1) * 7));
    }

    // console.log(result);

    return result;
  }

  /**
   * set one day data by the offset(dateIndex) to the first day of current month
   * @param {object} scope
   * @param {moment} currentDay: the day selected 
   * @param {*} firstDay: the first day of currentDay's month
   * @param {*} dayIndex: index day of a week, Sunday is the first(= 0)
   * @param {*} dateIndex: offset 
   * @param {*} isInMonth: whether in current month
   * @return {object}
   */
  function setDay(scope, currentDay, firstDay, dayIndex, dateIndex, isInMonth) {
    var dateFormat = DATE_DEFAULT_FORMAT;
    var datetime = moment(firstDay).addDays(dateIndex);
    var weekday = dayIndex % 7;

    return {
      datetime: datetime,
      day: datetime.format('DD'),
      isInMonth: isInMonth,
      isWeekEnd: weekday === 0 || weekday === 6,
      isToday: moment().format(dateFormat) === datetime.format(dateFormat),
      isSelected: currentDay.format(dateFormat) === datetime.format(dateFormat),
      dayClass: '' // calc later
    };
  }

  function getDaysClass(picker) {
    var days = picker.days || [];
    for(var i = 0; i < days.length; i++) {
      for(var j = 0; j < days[i].length; j++) {
        days[i][j].dayClass = getDayClass(days[i][j]);
      }
    }
  }

  /**
   * get the calendar day's style
   * @param {object} dayInfo 
   * @returns {string} class string
   */
  function getDayClass(dayInfo) {
    var classCollection = [];
    if(!dayInfo.isDisabled) {
      classCollection.push('normal-day');
    }

    if(dayInfo.isWeekEnd && !dayInfo.isToday) {
      classCollection.push('md-warn');
    }

    if(dayInfo.isToday) {
      classCollection.push('md-primary today');
    }

    if(dayInfo.isSelected) {
      classCollection.push('md-primary md-raised selected');
    }

    if(!dayInfo.isInMonth) {
      classCollection.push('not-in-month');
    }

    return ' ' + classCollection.join(' ') + ' ';
  }

  function getDayParentClass(dayInfo, isRange, picker0Dt, picker1Dt) {
    var classCollection = [];
    if(isRange) {
      var d0 = moment(moment(dayInfo.datetime).format(DATE_DEFAULT_FORMAT));
      var d1 = moment(picker0Dt.format(DATE_DEFAULT_FORMAT));
      var d2 = moment(picker1Dt.format(DATE_DEFAULT_FORMAT));
      if(d1.isSame(d2)) {
        return '';
      }

      if(d0.isSameOrAfter(d1) && d0.isSameOrBefore(d2)) {
        classCollection.push('in-range');
      }
      if(d0.isSame(d1)) {
        classCollection.push('first-range-day');
      }
      if(d0.isSame(d2)) {
        classCollection.push('last-range-day');
      }
    }

    return ' ' + classCollection.join(' ') + ' ';
  }

  function selectDay(picker, dayM) {
    toggleSelect(picker, dayM, true);
  }

  function unSelectDay(picker, dayM) {
    toggleSelect(picker, dayM, false);
  }

  function toggleSelect(picker, dayM, isSelected) {
    var dd = dayM.format('DD');
    var days = picker && picker.days || [];
    for(var i = 0; i < days.length; i++) {
      for(var j = 0; j < days[i].length; j++) {
        if(days[i][j].day === dd && days[i][j].isInMonth) {
          days[i][j].isSelected = isSelected;
          return;
        }
      }
    }
  }

  // according to max & min & range status to get whether a day is disabled
  function setDaysDisabledStatus(picker, format, isDateRange, currentPickerIndex, minDate, maxDate, picker0Dt, picker1Dt, minLength, maxLength) {
    var days = picker.days;
    picker.isInvalid = false;
    for(var i = 0; i < days.length; i++) {
      for(var j = 0; j < days[i].length; j++) {
        var dayInfo = days[i][j];
        var datetime = moment(dayInfo.datetime.format(format));
        dayInfo.isDisabled = false;
        if(maxDate && datetime.isAfter(maxDate) || minDate && datetime.isBefore(minDate)) {
          dayInfo.isDisabled = true;
        }

        if(isDateRange) {
          if(currentPickerIndex === 0 && datetime.isAfter(picker1Dt) || currentPickerIndex === 1 && datetime.isBefore(picker0Dt)) {
            dayInfo.isDisabled = true;
          }

          if(minLength > 0) {
            if(currentPickerIndex === 0 && picker1Dt.diffDays(datetime) < minLength || currentPickerIndex === 1 && datetime.diffDays(picker0Dt) < minLength) {
              dayInfo.isDisabled = true;
            }
          }

          if(maxLength > 0) {
            if(currentPickerIndex === 0 && picker1Dt.diffDays(datetime) > maxLength || currentPickerIndex === 1 && datetime.diffDays(picker0Dt) > maxLength) {
              dayInfo.isDisabled = true;
            }
          }
        }

        // check if the picker datetime is disabled
        if(dayInfo.isDisabled && moment(picker.datetime).format(DATE_DEFAULT_FORMAT) === dayInfo.datetime.format(DATE_DEFAULT_FORMAT)) {
          picker.isInvalid = true;
        }

        // get day style after all status determines 
        dayInfo.dayClass = getDayClass(dayInfo);
        dayInfo.dayParentClass = getDayParentClass(dayInfo, isDateRange, picker0Dt, picker1Dt);
      }
    }
  }

  /**
   * set calendar day's time when new time selected.
   * @param {object} picker 
   * @param {moment} newDt 
   * @param {string} format 
   */
  function setCalendarDayTime(picker, newDt) {
    var days = picker.days;
    for(var i = 0; i < days.length; i++) {
      for(var j = 0; j < days[i].length; j++) {
        var dayInfo = days[i][j];
        var datetime = dayInfo.datetime;
        datetime.set('hour', newDt.get('hour'));
        datetime.set('minute', newDt.get('minute'));
        datetime.set('second', newDt.get('second'));
      }
    }
  }

})();