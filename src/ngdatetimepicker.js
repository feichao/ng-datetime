(function() {
  'use strict';

  angular.module('ngDatetimePicker', ['ngDatetime'])
    .directive('ngDatetimePicker', NgDatetimePicker);

  var NG_DATETIME_TEMPLATE = [
    '<ng-datetime dt-type="{{ vm.dtType }}" choice="vm.choice" start-choice="vm.startChoice" end-choice="vm.endChoice"',
    ' max="{{ vm.max }}" min="{{ vm.min }}" max-length="{{ vm.maxLength }}" min-length="{{ vm.minLength }}"',
    ' dt-confirm="vm.save(startChoice, endChoice, choice)" dt-cancel="vm.cancel()" ',
    ' dt-q-select="vm.dtQSelect" dt-language="vm.dtLanguage"',
    '</ng-datetime>'
  ].join(' ');

  /**
   * @ngInject
   */
  function NgDatetimePicker() {
    return {
      restrict: 'EA',
      scope: {
        dtType: '@',
        dtQSelect: '=',
        dtConfirm: '&',
        dtCancel: '&',

        startChoice: '=',
        endChoice: '=',
        choice: '=',
        dtLanguage: '=',

        max: '@',
        min: '@',
        maxLength: '@',
        minLength: '@'
      },
      template: function($element, $attr) {
        var template;
        var display = '{{ startChoice }}&nbsp;&nbsp;~&nbsp;&nbsp;{{ endChoice }}';
        if ($attr.dtText === undefined) { // button mode
          if ($attr.choice) {
            template = [
              '<md-button class="md-raised md-primary no-margin time-picker-switch" ng-click="$mdOpenMenu($event)">',
              ' {{ choice }}',
              '</md-button>'
            ].join(' ');
          } else {
            template = [
              '<md-button class="md-raised md-primary no-margin time-picker-switch" ng-click="$mdOpenMenu($event)">',
              display,
              '</md-button>'
            ].join(' ');
          }
        } else { // text mode
          if ($attr.choice) {
            template = [
              '<md-input-container class="time-picker-switch no-margin text-mode-input">',
              ' <input type="text" readonly="readonly" aria-label="please select" ng-click="vm.showDatatimePickerDialog($event)" value="{{ choice }}">',
              '</md-input-container>'
            ].join(' ');
          } else {
            template = [
              '<md-input-container class="time-picker-switch no-margin text-mode-input">',
              ' <input type="text" readonly="readonly" aria-label="please select" ng-click="vm.showDatatimePickerDialog($event)" value="',
              display,
              '">',
              '</md-input-container>'
            ].join(' ');
          }
        }

        if ($attr.dtDialog === undefined) {
          template += '<md-menu-content><div class="ng-datetime-wrapper ng-datetime-inline">' + NG_DATETIME_TEMPLATE + '</div></md-menu-content>';
        }

        return '<md-menu>' + template + '</md-menu>';
      },
      controller: ['$scope', '$element', '$attrs', '$document', '$mdUtil', '$mdDialog', NgDatetimePickerCtrl],
      controllerAs: 'vm'
    };

    function NgDatetimePickerCtrl($scope, $element, $attrs, $document, $mdUtil, $mdDialog) {
      var vm = this;
      vm.isRange = !$scope.choice;
      vm.isDtDialog = $attrs.dtDialog !== undefined;

      vm.dtQSelect = $scope.dtQSelect;
      vm.dtLanguage = $scope.dtLanguage;
      vm.dtType = $scope.dtType;
      vm.max = $scope.max;
      vm.min = $scope.min;
      vm.maxLength = $scope.maxLength;
      vm.minLength = $scope.minLength;
      vm.startChoice = $scope.startChoice;
      vm.endChoice = $scope.endChoice;
      vm.choice = $scope.choice;
      vm.dtConfirm = typeof $scope.dtConfirm === 'function' ? $scope.dtConfirm : angular.noop;
      vm.dtCancel = typeof $scope.dtCancel === 'function' ? $scope.dtCancel : angular.noop;

      $element.on('click', function(event) {
        event.stopPropagation();
      });

      $document.on('click', function(event) {
        vm.isCalendarOpen = false;
        $scope.$digest();
      });

      vm.save = function(startChoice, endChoice, choice) {
        vm.startChoice = startChoice;
        vm.endChoice = endChoice;
        vm.choice = choice;
        vm.dtConfirm({ startChoice: startChoice, endChoice: endChoice, choice: choice });
        vm.closeCalendarPanel();
      };

      if (!vm.isDtDialog) { //判断是否对话框显示模式
        vm.$mdUtil = $mdUtil;

        vm.isCalendarOpen = false;
        vm.switchElement = $element[0].querySelector('.time-picker-switch');
        vm.calendarPane = $element[0].querySelector('.ng-datetime-inline');

        vm.cancel = function() {
          vm.closeCalendarPanel();
        };

        vm.openCalendarPanel = function(event, $mdMenu) {
          vm.isCalendarOpen = !vm.isCalendarOpen;
          $mdMenu.open(event);
          if(vm.isCalendarOpen) {
            calcPosition($element);
          }
        };

        vm.closeCalendarPanel = function() {
          vm.isCalendarOpen = false;
        };

        vm.attachCalendarPane = function() {
          //计算内联显示时的显示位置
          var CALENDAR_PANE_MIN_WIDTH = 300;
          var CALENDAR_PANE_MIN_HEIGHT = 350;
          var calendarPane = vm.calendarPane;
          var body = document.body;

          calendarPane.style.transform = '';

          var elementRect = vm.switchElement.getBoundingClientRect();
          var bodyRect = body.getBoundingClientRect();

          var topMargin = 3;
          var bottomMargin = 3;
          var leftMargin = 0;
          var rightMargin = 0;
          var heightBias = 0;

          if (typeof($attrs.dtText) != 'undefined') {
            heightBias = 12;
          }

          var paneTop = elementRect.top - bodyRect.top + elementRect.height + topMargin - heightBias; //上边停靠
          var paneLeft = elementRect.left - bodyRect.left + leftMargin; //左边对齐
          var panelBottom = bodyRect.bottom - elementRect.top + bottomMargin - heightBias; //底边停靠 
          var paneRight = bodyRect.right - elementRect.right + rightMargin; //右边对齐

          var alignX = 'left';
          var alignY = 'top';

          var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
            -bodyRect.top :
            document.body.scrollTop;

          var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
            -bodyRect.left :
            document.body.scrollLeft;

          var viewportBottom = viewportTop + vm.$window.innerHeight;
          var viewportRight = viewportLeft + vm.$window.innerWidth;

          if ((paneLeft + bodyRect.left + viewportLeft + CALENDAR_PANE_MIN_WIDTH) > viewportRight &&
            (bodyRect.right - paneRight - CALENDAR_PANE_MIN_WIDTH) > 0) {
            alignX = 'right';
          }

          if ((paneTop + bodyRect.top + viewportTop + CALENDAR_PANE_MIN_HEIGHT) > viewportBottom &&
            (bodyRect.bottom - panelBottom - CALENDAR_PANE_MIN_HEIGHT) > 0) {
            alignY = 'bottom';
          }

          calendarPane.style.display = 'block';
          calendarPane.style.position = "absolute";
          if (alignX === 'left') {
            calendarPane.style.right = 'auto';
            calendarPane.style.left = paneLeft + 'px';
          } else {
            calendarPane.style.right = paneRight + 'px';
            calendarPane.style.left = 'auto';
          }
          if (alignY === 'top') {
            calendarPane.style.top = paneTop + 'px';
            calendarPane.style.bottom = 'auto';
          } else {
            calendarPane.style.top = 'auto';
            calendarPane.style.bottom = panelBottom + 'px';
          }

          calendarPane.style.zIndex = "90";
          document.body.appendChild(calendarPane);
        };

        vm.detachCalendarPane = function() {
          if (vm.isCalendarOpen) {
            //vm.$mdUtil.enableScrolling();
          }

          if (vm.calendarPane.parentNode) {
            vm.calendarPane.parentNode.removeChild(vm.calendarPane);
          }
        };
      }

      vm.showDatatimePickerDialog = function(ev) {
        $mdDialog.show({
          controller: ['$mdDialog', 'resolveData', DialogController],
          controllerAs: 'vm',
          template: [
            '<md-dialog aria-label="日期时间选择">',
            NG_DATETIME_TEMPLATE,
            '</md-dialog>'
          ].join(''),
          targetEvent: ev,
          transclude: true,
          resolve: {
            resolveData: function() {
              return vm;
            }
          }
        }).then(function(data) {
          vm.startChoice = data.startChoice;
          vm.endChoice = data.endChoice;
          vm.choice = data.choice;
          vm.dtConfirm(data);
        });
      };
    }
  }

  function calcPosition(element) {
    var elePositionRect = element[0].getBoundingClientRect();
    // if(elePositionRect)
    console.log(element[0].getBoundingClientRect());

    var ngDt = element.find('div');
    console.log(ngDt);
    console.log(ngDt[1].offsetWidth);
    console.log(ngDt[1].offsetHeight);
  }

  function DialogController($mdDialog, resolveData) {
    var vm = this;

    angular.extend(vm, resolveData);
    vm.save = function(startChoice, endChoice, choice) {
      $mdDialog.hide({ startChoice: startChoice, endChoice: endChoice, choice: choice });
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };
  }
})();
