(function() {
  'use strict';

  var moment = moment || window.moment;
  var DATE_CALC_FORMAT = 'YYYY-MM-DD';
  var TIME_CALC_FORMAT = 'HH:mm:ss';

  if (moment && moment.prototype) {
    if (!moment.addMinutes) {
      moment.prototype.addMinutes = function(num) {
        return this.add(num, 'minutes');
      };
    }

    if (!moment.addHours) {
      moment.prototype.addHours = function(num) {
        return this.add(num, 'hours');
      };
    }

    if (!moment.addDays) {
      moment.prototype.addDays = function(num) {
        return this.add(num, 'days');
      };
    }

    if (!moment.addMonths) {
      moment.prototype.addMonths = function(num) {
        return this.add(num, 'months');
      };
    }

    if (!moment.addYears) {
      moment.prototype.addYears = function(num) {
        return this.add(num, 'years');
      };
    }

    if (!moment.subtractMinutes) {
      moment.prototype.subtractMinutes = function(num) {
        return this.subtract(num, 'minutes');
      };
    }

    if (!moment.subtractHours) {
      moment.prototype.subtractHours = function(num) {
        return this.subtract(num, 'hours');
      };
    }

    if (!moment.subtractDays) {
      moment.prototype.subtractDays = function(num) {
        return this.subtract(num, 'days');
      };
    }

    if (!moment.subtractMonths) {
      moment.prototype.subtractMonths = function(num) {
        return this.subtract(num, 'months');
      };
    }

    if (!moment.subtractYears) {
      moment.prototype.subtractYears = function(num) {
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
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td colspan="2">',
    '        <input name="year-filed" type="text" ng-model="getYear(picker)">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addYear(picker)">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusMonth(picker)">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <input name="month-filed" type="text" ng-model="getMonth(picker)">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMonth(picker)">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_right"></ng-md-icon>',
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
    '        <md-button class="md-icon-button md-mini" ng-click="setDate(picker, dayInfo)" ng-class="getDayClass(dayInfo)">',
    '          {{ dayInfo.day }}',
    '        </md-button>',
    '      </td>',
    '    </tr>',
    '    <tr class="time-picker" ng-if="picker.isShowTimePicker">',
    '      <td></td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusHour(picker)">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <input name="hour-filed" type="text" value="{{ getHour(picker) }}">',
    '      </td>',
    '      <td class="split-time">',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addHour(picker)">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusMinute(picker)">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <input name="minute-filed" type="text" ng-model="getMinute(picker)">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMinute(picker)">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_right"></ng-md-icon>',
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
        startDate: '=',
        endDate: '=',
        startTime: '=',
        endTime: '=',
        startDatetime: '=',
        endDatetime: '=',
        date: '=',
        time: '=',
        datetime: '=',
        maxDatetime: '&',
        minDatetime: '&'
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
      if (typeof moment !== 'function') {
        console.log('cant find momentjs lib');
        return;
      }

      console.log($scope.datetime);

      $scope.init = function() {
        switch (attr.dtType) {
          case 'date':
            $scope.format = $scope.format || DATE_CALC_FORMAT;
            $scope.pickers = [{
              isShowDatePicker: true,
              isShowTimePicker: false,
              yearNum: '2017',
              monthNum: '08',
              days: calcDays($scope.date),
              datetime: $scope.date
            }];
            break;
          case 'time':
            $scope.format = $scope.format || 'HH:mm:ss';
            $scope.pickers = [{
              isShowDatePicker: false,
              isShowTimePicker: true,
              hourNum: '23',
              minuteNum: '34',
              datetime: $scope.datetime
            }];
            break;
          case 'datetime':
            $scope.format = $scope.format || 'YYYY-MM-DD HH:mm:ss';
            $scope.pickers = [{
              isShowDatePicker: true,
              isShowTimePicker: true,
              yearNum: '2017',
              monthNum: '08',
              hourNum: '23',
              minuteNum: '34',
              days: calcDays($scope.datetime),
              datetime: $scope.datetime
            }];
            break;
        }
      };

      $scope.init();

      $scope.getDayClass = function(dayInfo) {
        return {
          'normal-day': !dayInfo.isToday && !dayInfo.isWeekEnd && !dayInfo.isSelected && !dayInfo.isToday,
          'normal-day md-warn': dayInfo.isWeekEnd,
          'md-primary': dayInfo.isToday,
          'md-raised': dayInfo.isSelected,
          'not-in-month': !dayInfo.isInMonth
        };
      };

      $scope.setDate = function(picker, dayInfo) {
        // todo 待优化
        // if(dayInfo.isInMonth) {
        //   picker.datetime = moment(picker.datetime).format($scope.format);
        // } else {
          $scope.setPickerDateInfo(picker, dayInfo.datetime);
        // }
      };

      $scope.setPickerDateInfo = function(picker, dt) {
        picker.datetime = dt.format($scope.format);
        picker.days = calcDays(picker.datetime);
        picker.yearNum = dt.format('YYYY');
        picker.monthNum = dt.format('MM');
      };

      $scope.setPickerTimeInfo = function(picker, dt) {
        // todo 待优化
        // var monthFormat = 'YYYY-MM';
        // if(moment(picker.datetime).format(monthFormat) !== dt.format(monthFormat)) {
        //   picker.days = calcDays(dt);
        // }
        picker.datetime = dt.format($scope.format);
        picker.days = calcDays(dt);
        picker.hourNum = dt.format('HH');
        picker.minuteNum = dt.format('mm');
      };

      $scope = angular.extend($scope, {
        minusYear: function(picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).subtractYears(1));
        },
        addYear: function(picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).addYears(1));
        },
        minusMonth: function(picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).subtractMonths(1));
        },
        addMonth: function(picker) {
          $scope.setPickerDateInfo(picker, moment(picker.datetime).addMonths(1));
        },
        minusHour: function(picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).subtractHours(1));
        },
        addHour: function(picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).addHours(1));
        },
        minusMinute: function(picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).subtractMinutes(1));
        },
        addMinute: function(picker) {
          $scope.setPickerTimeInfo(picker, moment(picker.datetime).addMinutes(1));
        }
      });

      $scope = angular.extend($scope, {
        getYear: function(picker) {
          if(!picker.datetime) {
            return '1900';
          }
          return moment(picker.datetime).format('YYYY');
        },
        getMonth: function(picker) {
          if(!picker.datetime) {
            return '01';
          }
          return moment(picker.datetime).format('MM');
        },
        getHour: function(picker) {
          if(!picker.datetime) {
            return '00';
          }
          return moment(picker.datetime).format('HH');
        },
        getMinute: function(picker) {
          if(!picker.datetime) {
            return '00';
          }
          return moment(picker.datetime).format('mm');
        },
      });
    };
  }

  function calcDays(datetime) {
    var datetimeMoment = moment(datetime);

    var days = new Array(42);
    var dayLength = datetimeMoment.daysInMonth();
    var firstDay = moment(datetime).endOf('month').subtractMonths(1).endOf('month').addDays(1);
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

    console.log(result);

    return result;
  }

  function setDay(currentDay, firstDay, dayIndex, dateIndex, isInMonth) {
    var dateFormat = DATE_CALC_FORMAT;
    var datetime = moment(firstDay).addDays(dateIndex);
    var weekday = dayIndex % 7;

    return {
      datetime: datetime,
      day: datetime.format('DD'),
      isInMonth: isInMonth,
      isWeekEnd: weekday === 0 || weekday === 6,
      isToday: moment().format(dateFormat) === datetime.format(dateFormat),
      isSelected: currentDay.format(dateFormat) === datetime.format(dateFormat)
    };
  }
})();
