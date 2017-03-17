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
    '<table class="date-picker" ng-repeat="picker in pickers">',
    '  <tbody>',
    '    <tr class="picker-header" ng-if="picker.isShowDatePicker">',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusYear(picker)">',
    '          <ng-md-icon size="24" aria-label="left" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td colspan="2">',
    '        <input name="year-filed" type="text" ng-model="picker.yearNum" ng-change="yearChange(picker)">',
    '      </td>',
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
    '        <input name="month-filed" type="text" ng-model="picker.monthNum" ng-change="monthChange(picker)">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMonth(picker)">',
    '          <ng-md-icon size="24" aria-label="right" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '    </tr>',
    '    <tr class="week-header"  ng-if="picker.isShowDatePicker">',
    '      <td>日</td>',
    '      <td>一</td>',
    '      <td>二</td>',
    '      <td>三</td>',
    '      <td>四</td>',
    '      <td>五</td>',
    '      <td>六</td>',
    '    </tr>',
    '    <tr ng-repeat="row in picker.days" ng-if="picker.isShowDatePicker">',
    '      <td ng-repeat="dayInfo in row track by $index">',
    '        <md-button class="md-icon-button md-mini {{ dayInfo.dayClass }}" ng-click="setDate(picker, dayInfo)">',
    '          {{ dayInfo.day }}',
    '        </md-button>',
    '      </td>',
    '    </tr>',
    '    <tr class="time-picker" ng-if="picker.isShowTimePicker">',
    '      <td></td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusHour(picker)">',
    '          <ng-md-icon size="24" aria-label="left" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <input name="hour-filed" type="text" ng-model="picker.hourNum" ng-change="hourChange(picker)">',
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
    '        <input name="minute-filed" type="text" ng-model="picker.minuteNum" ng-change="minuteChange(picker)">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMinute(picker)">',
    '          <ng-md-icon size="24" aria-label="right" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '    </tr>',
    '  </tbody>',
    '</table>'
  ].join('');

  var TEMPLATE_ACTIONS = [
    '<div layout="row" class="actions">',
    '  <md-button class="md-raised" ng-click="setToday()">今天</md-button>',
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

      console.log($scope.datetime);
      $scope.init = function () {
        switch (attr.dtType) {
          case DATE_TYPE.DATE:
          default:
            $scope.format = $scope.format || DATE_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, false, $scope.choice)];
            break;
          case DATE_TYPE.TIME:
            $scope.format = $scope.format || TIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(false, true, $scope.choice)];
            break;
          case DATE_TYPE.DATETIME:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, true, $scope.choice)];
            console.log($scope.pickers);
            break;
          case DATE_TYPE.DATE_RANGE:
            $scope.format = $scope.format || DATE_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, false, $scope.startChoice), getPickerInfo(true, false, $scope.endChoice)];
            break;
          case DATE_TYPE.TIME_RANGE:
            $scope.format = $scope.format || TIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(false, true, $scope.startChoice), getPickerInfo(false, true, $scope.endChoice)];
            break;
          case DATE_TYPE.DATETIME_RANGE:
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, true, $scope.startChoice), getPickerInfo(true, true, $scope.endChoice)];
            break;
          case DATE_TYPE.DATE_TIMERANGE: // 带解决格式问题
            $scope.format = $scope.format || DATETIME_DEFAULT_FORMAT;
            $scope.pickers = [getPickerInfo(true, true, $scope.startChoice), getPickerInfo(false, true, $scope.endChoice)];
            break;
        }
      };

      $scope.init();

      $scope.setDate = function (picker, dayInfo) {
        $scope.setPickerDateInfo(picker, dayInfo.datetime);
        selectDay(picker, dayInfo.datetime);
        dayInfo.dayClass = getDayClass(dayInfo);
      };

      $scope.setPickerDateInfo = function (picker, newDt) {
        var pMoment = moment(picker.datetime);
        if (pMoment.format('MM') !== newDt.format('MM')) {
          picker.days = calcDays(newDt);
        } else if (pMoment.format('DD') !== newDt.format('DD')) {
          unSelectDay(picker, pMoment);
          selectDay(picker, newDt);
        }
        picker.datetime = newDt.format($scope.format);
        picker.yearNum = newDt.format('YYYY');
        picker.monthNum = newDt.format('MM');
      };

      $scope.setPickerTimeInfo = function (picker, newDt) {
        var pMoment = moment(picker.datetime);
        if (pMoment.format('MM') !== newDt.format('MM')) {
          picker.days = calcDays(newDt);
        } else {
          unSelectDay(picker, pMoment);
          selectDay(picker, newDt);
        }
        picker.datetime = newDt.format($scope.format);
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
        yearChange: function(picker) {
          if(picker.yearNum < 1900) {
            picker.yearNum = 1900;
          } else if(picker.yearNum > 9999) {
            picker.yearNum = 9999;
          }
          $scope.setPickerDateInfo(picker, moment(picker.datetime).year(picker.yearNum));
        },
        monthChange: function(picker) {
          if(picker.monthNum < 1) {
            picker.monthNum = 1;
          } else if(picker.monthNum > 12) {
            picker.monthNum = 12;
          }
          $scope.setPickerDateInfo(picker, moment(picker.datetime).month(picker.monthNum));
        },
        hourChange: function(picker) {

        },
        minuteChange: function(picker) {

        }
      });
    };
  }

  function getPickerInfo(isDate, isTime, datetime) {
    var dt = moment(datetime);
    return {
      datetime: datetime,
      days: calcDays(dt),
      isShowDatePicker: isDate,
      isShowTimePicker: isTime,
      yearNum: dt.format('YYYY'),
      monthNum: dt.format('MM'),
      hourNum: dt.format('HH'),
      minuteNum: dt.format('mm')
    };
  }

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

  function getDayClass(dayInfo) {
    var classCollection = [];
    if (!dayInfo.isToday && !dayInfo.isWeekEnd && !dayInfo.isSelected) {
      classCollection.push('normal-day');
    }

    if (dayInfo.isWeekEnd) {
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
        if(days[i][j].day === dd) {
          days[i][j].isSelected = isSelected;
          days[i][j].dayClass = getDayClass(days[i][j]);
          return;
        }
      }
    }
  }

})();
