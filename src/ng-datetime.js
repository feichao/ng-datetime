(function () {
  'use strict';

  var moment = moment || window.moment;

  if (moment && moment.prototype) {
    if (!moment.addMinutes) {
      moment.prototype.addMinutes = function (num) {
        return this.add(num, 'minutes');
      };
    }

    if (!moment.addHours) {
      moment.prototype.addHours = function (num) {
        return this.add(num, 'hours');
      };
    }

    if (!moment.addDays) {
      moment.prototype.addDays = function (num) {
        return this.add(num, 'days');
      };
    }

    if (!moment.addMonths) {
      moment.prototype.addMonths = function (num) {
        return this.add(num, 'months');
      };
    }

    if (!moment.addYears) {
      moment.prototype.addYears = function (num) {
        return this.add(num, 'years');
      };
    }

    if (!moment.subtractMinutes) {
      moment.prototype.subtractMinutes = function (num) {
        return this.subtract(num, 'minutes');
      };
    }

    if (!moment.subtractHours) {
      moment.prototype.subtractHours = function (num) {
        return this.subtract(num, 'hours');
      };
    }

    if (!moment.subtractDays) {
      moment.prototype.subtractDays = function (num) {
        return this.subtract(num, 'days');
      };
    }

    if (!moment.subtractMonths) {
      moment.prototype.subtractMonths = function (num) {
        return this.subtract(num, 'months');
      };
    }

    if (!moment.subtractYears) {
      moment.prototype.subtractYears = function (num) {
        return this.subtract(num, 'years');
      };
    }
  }

  var TEMPLATE_QUICK_SELECT = [
    '<ul class="quick-select">',
    '  <li ng-repeat="qs in qSelectors">',
    '    <md-button ng-click="qSelect(qs.value)">{{ qs.label }}</md-button>',
    '  </li>',
    '</ul>',
  ].join('');

  var TEMPLATE_DATE = [
    '<div layout="{{ isDiaplayBlock() ? \'column\' : \'row\' }}">',
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
    '              <md-button ng-click="setMonth(picker, month)">{{ month }}</md-button>',
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
    '    <tr class="week-header"  ng-if="picker.isShowDatePicker">',
    '      <td>日</td>',
    '      <td>一</td>',
    '      <td>二</td>',
    '      <td>三</td>',
    '      <td>四</td>',
    '      <td>五</td>',
    '      <td>六</td>',
    '    </tr>',
    // days 
    '    <tr ng-repeat="row in picker.days" ng-if="picker.isShowDatePicker">',
    '      <td ng-repeat="dayInfo in row track by $index">',
    '        <md-button class="md-icon-button md-mini {{ dayInfo.dayClass }}" ng-click="setDate(picker, dayInfo)">',
    '          {{ dayInfo.day }}',
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
    '              <md-button ng-click="setHour(picker, hour)">{{ hour }}</md-button>',
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
    '            <md-menu-item ng-repeat="minute in minutes">',
    '              <md-button ng-click="setMinute(picker, minute)">{{ minute }}</md-button>',
    '            </md-menu-item>',
    '          </md-menu-content>',
    '        </md-menu>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMinute(picker)">',
    '          <ng-md-icon size="24" aria-label="right" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td></td>',
    '    </tr>',
    '  </tbody>',
    '</table>',
    '</div>'
  ].join('');

  var TEMPLATE_ACTIONS = [
    '<div layout="row" class="actions">',
    '  <md-button class="md-raised" ng-click="setToday()" ng-if="isSetToday()">今天</md-button>',
    '  <span flex></span>',
    '  <md-button class="md-warn" ng-click="cancel()">取消</md-button>',
    '  <span flex="5"></span>',
    '  <md-button class="md-primary md-raised" ng-click="confirm()">确定</md-button>',
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

  var DATE_DEFAULT_FORMAT = 'YYYY-MM-DD';
  var TIME_DEFAULT_FORMAT = 'HH:mm:ss';
  var DATETIME_DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

  angular
    .module('ngDatetime', [])
    .directive('ngDatetime', ['$compile', ngDatetimeDirective]);

  /**
   * dtType: date, time, datetime, date-range, time-range, datetime-range, date-timerange
   * dtQSelect: quick select,
   * dtConfirm: callback when confirm select date
   */
  function ngDatetimeDirective($compile) {
    return {
      restrict: 'E',
      scope: {
        dtType: '@',
        dtQSelect: '=',
        dtConfirm: '&',
        format: '@',
        // datetime
        startChoice: '=',
        endChoice: '=',
        choice: '=',
        max: '&',
        min: '&'
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
    return function ($scope, element, attr) {
      if (typeof moment !== 'function') {
        console.log('cant find momentjs lib');
        return;
      }
      $scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      $scope.hours = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
      $scope.minutes = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
      $scope.seconds = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
      $scope.init = function () {
        switch ($scope.dtType) {
          case DATE_TYPE.DATE:
          default:
            $scope.format = $scope.format || DATE_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, false, moment($scope.choice, $scope.format))];
            break;
          case DATE_TYPE.TIME:
            $scope.format = $scope.format || TIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(false, true, moment($scope.choice, $scope.format))];
            break;
          case DATE_TYPE.DATETIME:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, true, moment($scope.choice, $scope.format))];
            console.log($scope.pickers);
            break;
          case DATE_TYPE.DATE_RANGE:
            $scope.format = $scope.format || DATE_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, false, moment($scope.startChoice, $scope.format)), getPickerInfo(true, false, moment($scope.endChoice, $scope.format))];
            break;
          case DATE_TYPE.TIME_RANGE:
            $scope.format = $scope.format || TIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(false, true, moment($scope.startChoice, $scope.format)), getPickerInfo(false, true, moment($scope.endChoice, $scope.format))];
            break;
          case DATE_TYPE.DATETIME_RANGE:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, true, moment($scope.startChoice, $scope.format)), getPickerInfo(true, true, moment($scope.endChoice, $scope.format))];
            break;
          case DATE_TYPE.DATE_TIMERANGE:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, true, moment($scope.startChoice, $scope.format)), getPickerInfo(false, true, moment($scope.endChoice, $scope.format))];
            break;
        }
      };

      $scope.init();

      $scope.isSetToday = function() {
        return $scope.dtType === DATE_TYPE.DATE || $scope.dtType === DATE_TYPE.DATETIME || $scope.dtType === DATE_TYPE.DATE_TIMERANGE;
      };

      $scope.isDiaplayBlock = function() {
        return $scope.dtType === DATE_TYPE.TIME_RANGE || $scope.dtType === DATE_TYPE.DATE_TIMERANGE;
      };

      $scope.setDate = function (picker, dayInfo) {
        $scope.setPickerDateInfo(picker, dayInfo.datetime);
        dayInfo.dayClass = getDayClass(dayInfo);
      };

      $scope.setPickerDateInfo = function (picker, newDt) {
        $scope.setPickerDatetimeInfo(picker, newDt);
      };

      $scope.setPickerTimeInfo = function (picker, newDt) {
        $scope.setPickerDatetimeInfo(picker, newDt);
      };

      $scope.setPickerDatetimeInfo = function(picker, newDt) {
        var picker0 = $scope.pickers[0];
        var picker1 = $scope.pickers[1];
        var pMoment = moment(picker.datetime);

        if (pMoment.format('YYYY') !== newDt.format('YYYY') || pMoment.format('MM') !== newDt.format('MM')) {
          picker.days = calcDays(newDt);
        } else if (pMoment.format('DD') !== newDt.format('DD')) {
          if($scope.dtType === DATE_TYPE.DATE_TIMERANGE) { 
            unSelectDay(picker0, pMoment);
            selectDay(picker0, newDt);
          } else {
            unSelectDay(picker, pMoment);
            selectDay(picker, newDt);
          }
        }
        
        if($scope.dtType === DATE_TYPE.DATE_TIMERANGE) {
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
      };

      $scope = angular.extend($scope, {
        minusYear: function (picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).subtractYears(1));
        },
        addYear: function (picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).addYears(1));
        },
        minusMonth: function (picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).subtractMonths(1));
        },
        addMonth: function (picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).addMonths(1));
        },
        minusHour: function (picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).subtractHours(1));
        },
        addHour: function (picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).addHours(1));
        },
        minusMinute: function (picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).subtractMinutes(1));
        },
        addMinute: function (picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).addMinutes(1));
        },
        setMonth: function(picker, month) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).month(month - 1));
        },
        setHour: function(picker, hour) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).hour(hour));
        },
        setMinute: function(picker, minute) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).minute(minute));
        },
        setToday: function() {
          var picker0 = $scope.pickers[0];
          if(picker0) {
            $scope.setPickerDateInfo(picker0, moment());
          }
        },
        cancel: function() {

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
    };
  }

  function getPickerInfo(isDate, isTime, mDatetime) {
    var datetime = mDatetime.format(DATETIME_DEFAULT_FORMAT);
    return {
      datetime: datetime,
      days: calcDays(mDatetime),
      isShowDatePicker: isDate,
      isShowTimePicker: isTime,
      yearNum: mDatetime.format('YYYY'),
      monthNum: mDatetime.format('MM'),
      hourNum: mDatetime.format('HH'),
      minuteNum: mDatetime.format('mm')
    };
  }

  /**
   * calc one month days, include current month date, pre month date, next month date
   * @param {string or moment} datetime: date string or moment object
   * @returns [array] two-dimensional array with 6 * 7, every row includes one week days
   */
  function calcDays(datetime) {
    var datetimeMoment = moment(datetime);

    // console.log(datetimeMoment);

    var days = new Array(42);
    var dayLength = datetimeMoment.daysInMonth();
    var firstDay = moment(datetime).subtractDays(datetimeMoment.format('DD') - 1);
    var firstDayWeekDay = firstDay.weekday();

    for (var i = 0; i < dayLength; i++) {
      var index = i + firstDayWeekDay;
      days[index] = setDay(datetimeMoment, firstDay, index, i, true);
    }

    for (var j = 1; j <= firstDayWeekDay; j++) {
      var index = firstDayWeekDay - j;
      days[index] = setDay(datetimeMoment, firstDay, index, -j, false);
    }

    for (var k = dayLength; k < 42; k++) {
      var index = firstDayWeekDay + k;
      days[index] = setDay(datetimeMoment, firstDay, index, k, false);
    }

    var result = [];
    for (var l = 0; l < 6; l++) {
      result.push(days.slice(l * 7, (l + 1) * 7));
    }

    // console.log(result);

    return result;
  }

  /**
   * set one day data by the offset(dateIndex) to the first day of current month
   * @param {moment} currentDay: the day selected 
   * @param {*} firstDay: the first day of currentDay's month
   * @param {*} dayIndex: index day of a week, Sunday is the first(= 0)
   * @param {*} dateIndex: offset 
   * @param {*} isInMonth: whether in current month
   * @return {object}
   */
  function setDay(currentDay, firstDay, dayIndex, dateIndex, isInMonth) {
    var dateFormat = DATE_DEFAULT_FORMAT;
    var datetime = moment(firstDay).addDays(dateIndex);
    var weekday = dayIndex % 7;

    var result = {
      datetime: datetime,
      day: datetime.format('DD'),
      isInMonth: isInMonth,
      isWeekEnd: weekday === 0 || weekday === 6,
      isToday: moment().format(dateFormat) === datetime.format(dateFormat),
      isSelected: currentDay.format(dateFormat) === datetime.format(dateFormat)
    };

    result.dayClass = getDayClass(result);

    return result;
  }

  /**
   * get the calendar day's style
   * @param {object} dayInfo 
   * @returns {string} class string
   */
  function getDayClass(dayInfo) {
    var classCollection = [];
    if (!dayInfo.isToday && !dayInfo.isWeekEnd && !dayInfo.isSelected) {
      classCollection.push('normal-day');
    }

    if (dayInfo.isWeekEnd && !dayInfo.isToday) {
      classCollection.push('md-warn');
    } 
    
    if (dayInfo.isToday) {
      classCollection.push('md-primary');
    }

    if (dayInfo.isSelected) {
      classCollection.push('md-primary md-raised');
    }

    if (!dayInfo.isInMonth) {
      classCollection.push('not-in-month');
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
          days[i][j].dayClass = getDayClass(days[i][j]);
          return;
        }
      }
    }
  }

})();
