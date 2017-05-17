(function () {
  'use strict';

  angular
    .module('ngDatetimePicker', [
      'ngDatetime'
    ])
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
      template: function ($element, $attr) {
        var template;
        var display = '{{ startChoice }}&nbsp;&nbsp;~&nbsp;&nbsp;{{ endChoice }}';
        if ($attr.dtText === undefined) { // button mode
          if ($attr.choice) {
            template = [
              '<md-button class="md-raised md-primary time-picker-switch" ng-click="vm.open($event)">',
              ' {{ choice }}',
              '</md-button>'].join(' ');
          } else {
            template = [
              '<md-button class="md-raised md-primary time-picker-switch" ng-click="vm.open($event)">',
              display,
              '</md-button>'].join(' ');
          }
        } else {  // text mode
          if ($attr.choice) {
            template = [
              '<md-input-container class="time-picker-switch">',
              ' <input type="text" readonly="readonly" aria-label="please select" ng-click="vm.open($event)" value="{{ choice }}">', '</md-input-container>'].join(' ');
          } else {
            template = [
              '<md-input-container class="time-picker-switch">',
              ' <input type="text" readonly="readonly" aria-label="please select" ng-click="vm.open($event)" value="',
              display,
              '">',
              '</md-input-container>'].join(' ');
          }
        }

        if ($attr.dtDialog === undefined) {
          template += '<div ng-show="vm.isCalendarOpen" class="ng-datetime-inline">' + NG_DATETIME_TEMPLATE + '</div>';
        }

        return template;
      },
      controller: ['$scope', '$element', '$attrs', '$window', '$mdUtil', '$mdDialog', NgDatetimePickerCtrl],
      controllerAs: 'vm',
      compile: NgDatetimePickerCompile
    };

    function NgDatetimePickerCompile($element, $attr) {
      var inputElement = $element[0].querySelector('input');
      if (inputElement) {
        //input style时调整显示宽度和位置
        inputElement.style.textAlign = 'center';
        inputElement.style.position = 'relative';
        inputElement.style.top = '12px';
        if ($attr.startChoice && $attr.endChoice) {
          inputElement.style.minWidth = '350px';
        }
      }

      return function ($scope, $element, $attr) {

      };
    }

    function NgDatetimePickerCtrl($scope, $element, $attrs, $window, $mdUtil, $mdDialog) {
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

      if (!vm.isDtDialog) { //判断是否对话框显示模式
        vm.$window = $window;
        vm.$mdUtil = $mdUtil;
        vm.documentElement = angular.element(document.documentElement);
        vm.openOnFocus = true; //输入框获取到焦点时打开

        vm.isCalendarOpen = false;
        vm.isOpen = false;
        vm.isDisabled = false;
        vm.inputFocusedOnWindowBlur = false;
        vm.switchElement = $element[0].querySelector('.time-picker-switch');
        vm.calendarPane = $element[0].querySelector('.ng-datetime-inline');

        vm.save = function (startChoice, endChoice, choice) {
          vm.startChoice = startChoice;
          vm.endChoice = endChoice;
          vm.choice = choice;
          vm.dtConfirm({ startChoice: startChoice, endChoice: endChoice, choice: choice });
          vm.closeCalendarPane();
        };

        vm.cancel = function () {
          vm.closeCalendarPane();
        };

        vm.handleWindowBlur = function () {
          vm.inputFocusedOnWindowBlur = (document.activeElement === vm.switchElement);
        };

        vm.handleBodyClick = function (event) {
          if (vm.isCalendarOpen) {
            //var isInCalendar = this.$mdUtil.getClosest(event.target, 'ng-datetime');

            var clickX = event.clientX;
            var clickY = event.clientY;
            var elementRect = vm.calendarPane.getBoundingClientRect();
            var isInCalendar = false;

            if (clickX > elementRect.left && clickX < elementRect.right &&
              clickY > elementRect.top && clickY < elementRect.bottom) {
              isInCalendar = true;
            }
            if (!isInCalendar) {
              vm.closeCalendarPane();
            }
          }
        };

        vm.bodyClickHandler = angular.bind(this, vm.handleBodyClick);
        vm.windowBlurHandler = angular.bind(this, vm.handleWindowBlur);

        vm.openCalendarPanel = function (event) {
          if (!vm.isCalendarOpen && !vm.isDisabled && !vm.inputFocusedOnWindowBlur) {
            vm.isCalendarOpen = true;
            vm.isOpen = true;
            vm.calendarPaneOpenedFrom = event.target;

            vm.attachCalendarPane();

            var self = this;
            vm.$mdUtil.nextTick(function () {
              self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);
          }
        };

        vm.closeCalendarPane = function () {
          if (vm.isCalendarOpen) {
            var self = this;

            self.detachCalendarPane();

            self.documentElement.off('click touchstart', self.bodyClickHandler);

            self.calendarPaneOpenedFrom.focus();
            self.calendarPaneOpenedFrom = null;

            if (self.openOnFocus) {
              self.$mdUtil.nextTick(reset);
            } else {
              reset();
            }
          }

          function reset() {
            self.isCalendarOpen = false;
            self.isOpen = false;
          }
        };

        vm.attachCalendarPane = function () {
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

          if (typeof ($attrs.dtText) != 'undefined') {
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

        vm.detachCalendarPane = function () {
          if (vm.isCalendarOpen) {
            //vm.$mdUtil.enableScrolling();
          }

          if (vm.calendarPane.parentNode) {
            vm.calendarPane.parentNode.removeChild(vm.calendarPane);
          }
        };
      } else {
        vm.showDatatimePickerDialog = function (ev) {
          var template = [
            '<md-dialog aria-label="日期时间选择">',
            NG_DATETIME_TEMPLATE,
            '</md-dialog>'
          ].join('');

          $mdDialog.show({
            controller: ['$mdDialog', 'resolveData', DialogController],
            controllerAs: 'vm',
            template: template,
            targetEvent: ev,
            transclude: true,
            resolve: {
              resolveData: function () {
                return {
                  max: vm.max,
                  min: vm.min,
                  maxLength: vm.maxLength,
                  minLength: vm.minLength,
                  choice: vm.choice,
                  startChoice: vm.startChoice,
                  endChoice: vm.endChoice,
                  dtQSelect: vm.dtQSelect,
                  dtLanguage: vm.dtLanguage,
                  dtType: vm.dtType
                };
              }
            }
          }).then(function (data) {
            vm.startChoice = data.startChoice;
            vm.endChoice = data.endChoice;
            vm.choice = data.choice;
            vm.dtConfirm(data);
          });
        };
      }

      vm.open = function (event) {
        if (vm.isDtDialog) {
          vm.showDatatimePickerDialog(event);
        } else {
          vm.openCalendarPanel(event);
        }
      };
    }

    function DialogController($mdDialog, resolveData) {
      var vm = this;

      angular.extend(vm, resolveData);
      vm.save = function (startChoice, endChoice, choice) {
        $mdDialog.hide({ startChoice: startChoice, endChoice: endChoice, choice: choice });
      };

      vm.cancel = function () {
        $mdDialog.cancel();
      };
    }
  }
})();