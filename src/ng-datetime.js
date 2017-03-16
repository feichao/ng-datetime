(function () {
  'use strict';

  var TEMPLATE_QUICK_SELECT = [
    '<ul class="quick-select">',
    '  <li ng-repeat="qs in qSelectors">',
    '    <md-button ng-click="qSelect(qs.value)">{{ qs.label }}</md-button>',
    '  </li>',
    '</ul>',
  ].join('');

  var TEMPLATE_DATE = [
    '<table class="date-picker">',
    '  <tbody>',
    '    <tr class="picker-header" ng-if="isShowDatePicker">',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusYear()">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td colspan="2">',
    '        <input name="year-filed" type="text" ng-model="yearNum">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addYear()">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusMonth()">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <input name="month-filed" type="text" value="monthNum">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMonth()">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '    </tr>',
    '    <tr ng-repeat="row in days" ng-if="isShowDatePicker">',
    '      <td ng-repeat="day in row">',
    '        <md-button class="md-icon-button md-mini normal-day" ng-click="setDate(day)">{{ day }}</md-button>',
    '      </td>',
    '    </tr>',
    '    <tr class="time-picker" ng-if="isShowTimePicker">',
    '      <td></td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusHour()">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <input name="hour-filed" type="text" value="hourNum">',
    '      </td>',
    '      <td class="split-time">',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addHour()">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_right"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="minusMinute()">',
    '          <ng-md-icon size="24" icon="keyboard_arrow_left"></ng-md-icon>',
    '        </md-button>',
    '      </td>',
    '      <td>',
    '        <input name="minute-filed" type="text" value="minuteNum">',
    '      </td>',
    '      <td>',
    '        <md-button class="md-primary md-icon-button md-mini" ng-click="addMinute()">',
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

  var getDtTemplate = function(obj) {
    return [
      '<ng-date-picker is-date-picker="' + obj.isDatePicker + '" is-time-picker="' + obj.isTimePicker + '" ',
      '   format="format" min="minDateTime" max="maxDateTime" datetime="' + obj.dateTime + '">',
      '</ng-date-picker>'
    ].join('');
  };

  var DT_TEMPLATE = {
    date: function () {
      return getDtTemplate({
        isDatePicker: 'true',
        isTimePicker: 'false',
        dateTime: 'dateTime'
      });
    },
    time: function () {
      return getDtTemplate({
        isDatePicker: 'false',
        isTimePicker: 'true',
        dateTime: 'dateTime'
      });
    },
    datetime: function () {
      return getDtTemplate({
        isDatePicker: 'true',
        isTimePicker: 'true',
        dateTime: 'dateTime'
      });
    },
    'date-range': function () {
      return getDtTemplate({
        isDatePicker: 'true',
        isTimePicker: 'false',
        dateTime: 'startDateTime'
      }) + getDtTemplate({
        isDatePicker: 'true',
        isTimePicker: 'false',
        dateTime: 'endDateTime'
      });
    },
    'time-range': function () {
      return getDtTemplate({
        isDatePicker: 'false',
        isTimePicker: 'true',
        dateTime: 'startDateTime'
      }) + getDtTemplate({
        isDatePicker: 'false',
        isTimePicker: 'true',
        dateTime: 'endDateTime'
      });
    },
    'datetime-range': function () {
      return getDtTemplate({
        isDatePicker: 'true',
        isTimePicker: 'true',
        dateTime: 'startDateTime'
      }) + getDtTemplate({
        isDatePicker: 'true',
        isTimePicker: 'true',
        dateTime: 'endDateTime'
      });
    },
    'date-timerange': function () {
      return getDtTemplate({
        isDatePicker: 'true',
        isTimePicker: 'true',
        dateTime: 'startDateTime'
      }) + getDtTemplate({
        isDatePicker: 'false',
        isTimePicker: 'true',
        dateTime: 'endDateTime'
      });
    }
  };

  angular
    .module('ngDatetime', [])
    .directive('ngDatePicker', ['$compile', ngDatePickerDirective])
    .directive('ngDatetime', ['$compile', ngDatetimeDirective]);

  function ngDatePickerDirective() {
    return {
      restrict: 'E',
      scope: {
        isDatePicker: '@',
        isTimePicker: '@',
        format: '@',
        max: '=',
        min: '=',
        datetime: '='
      },
      template: function (element) {
      },
      compile: ngDatePickerCompile
    };
  }

  function ngDatePickerCompile(tElement, tAttr) {
    return function ($scope, element, attr) {
    };
  }

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
        startDateTime: '=',
        endDateTime: '=',
        dateTime: '=',
        maxDateTime: '&',
        minDateTime: '&'
      },
      template: function (element, attr) {
        var wraper = '<div class="ng-datetime"></div>';
        var pickerWraper = '<div layout="row"></div>';
        var actions = TEMPLATE_ACTIONS;

        var tplFun = DT_TEMPLATE(attr.dtType);
        var pickerTpl = '';
        if(typeof tplFun === 'function') {
          tplFun({
            format: 'format',
            startDateTime: 'startDateTime',
            endDateTime: 'endDateTime',
            dateTime: 'dateTime',
            maxDateTime: 'maxDateTime',
            minDateTime: 'minDateTime'
          });
        }
      },
      compile: ngDatetimeCompile
    };
  }

  function ngDatetimeCompile(tElement, tAttr) {
    return function ($scope, element, attr) {

    };
  }
})();