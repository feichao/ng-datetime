(function() {
  'use strict';

  angular
    .module('ngDatetimePicker', [
      'ngDatetime'
    ])
    .directive('ngDatetimePicker', NgDatetimePicker);

  var NG_DATETIME_TEMP = ['<ng-datetime choice="choice" ',
    'start-choice="startChoice"  end-choice="endChoice" ',
    'max={{ctrl.max}} min={{ctrl.min}} ',
    'max-length={{ctrl.maxLength}} min-length={{ctrl.minLength}} ',
    'dt-confirm="choice?ctrl.save(choice):ctrl.save(startChoice,endChoice)" dt-cancel="ctrl.cancel()" ',
    'dt-q-select="ctrl.dtQSelect" ',
    'dt-language="ctrl.dtLanguage" ',
    'dt-type={{ctrl.dtType}} ',
    'class="ng-datetime-inline" ',
    'ng-show="ctrl.isCalendarOpen">',
    '</ng-datetime>'
  ].join('');

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

        // inline mode

        // language
        dtLanguage: '='
      },
      template: function($element, $attr) {
        var templateHtml = '';
        if (typeof($attr.inline) != 'undefined') {
          if (typeof($attr.inputmode) == 'undefined') {
            if ($attr.choice) {
              templateHtml = '<md-button class="md-raised md-primary time-picker-switch" ng-click="ctrl.open($event)">{{choice}}</md-button>';
            } else {
              templateHtml = '<md-button class="md-raised md-primary time-picker-switch" ng-click="ctrl.open($event)">{{startChoice}}&nbsp;&nbsp;~&nbsp;&nbsp;{{endChoice}}</md-button>';
            }
          } else {
            if ($attr.choice) {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="ctrl.open($event)" value="{{choice}}"></md-input-container>';
            } else {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="ctrl.open($event)" value="{{startChoice}}&nbsp;&nbsp;~&nbsp;&nbsp;{{endChoice}}"></md-input-container>';
            }
          }
        } else {
          if (typeof($attr.inputmode) == 'undefined') {
            if ($attr.choice) {
              templateHtml = '<md-button class="md-raised md-primary time-picker-switch" ng-click="showDatatimeimePickDialog($event)">{{choice}}</md-button>';
            } else {
              templateHtml = '<md-button class="md-raised md-primary time-picker-switch" ng-click="showDatatimeimePickDialog($event)">{{startChoice}}&nbsp;&nbsp;~&nbsp;&nbsp;{{endChoice}}</md-button>';
            }
          } else {
            if ($attr.choice) {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="showDatatimeimePickDialog($event)" value="{{choice}}"></md-input-container>';
            } else {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="showDatatimeimePickDialog($event)" value="{{startChoice}}&nbsp;&nbsp;~&nbsp;&nbsp;{{endChoice}}"></md-input-container>';
            }
          }
        }

        if (typeof($attr.inline) != 'undefined') {
          templateHtml += NG_DATETIME_TEMP;
        }

        return templateHtml;
      },
      controller: NgDatetimePickerCtrl,
      controllerAs: 'ctrl',
      compile: NgDatetimePickerCompile
    };

    function NgDatetimePickerCompile($element, $attr) {
      var inputElement = $element[0].querySelector('input');
      if (inputElement) {
        inputElement.style.textAlign = 'center';
        inputElement.style.position = 'relative';
        inputElement.style.top = '12px';
        if ($attr.startChoice && $attr.endChoice) {
          inputElement.style.minWidth = '350px';
        }
      }
      return function($scope, $element, $attr) {

      };
    }

    /**
     * @ngInject
     */
    function NgDatetimePickerCtrl($scope, $element, $attrs, $window, $mdUtil, $mdDialog) {
      if (typeof($attrs.inline) != 'undefined') { //判断是否内联显示
        var ctrl = this;

        ctrl.$window = $window;
        ctrl.$mdUtil = $mdUtil;
        ctrl.documentElement = angular.element(document.documentElement);
        ctrl.openOnFocus = true; //输入框获取到焦点时打开

        ctrl.isCalendarOpen = false;
        ctrl.isOpen = false;
        ctrl.isDisabled = false;
        ctrl.inputFocusedOnWindowBlur = false;
        ctrl.switchElement = $element[0].querySelector('.time-picker-switch');
        ctrl.calendarPane = $element[0].querySelector('.ng-datetime-inline');

        ctrl.dtQSelect = $scope.dtQSelect;
        ctrl.dtLanguage = $scope.dtLanguage;
        ctrl.dtType = $scope.dtType;
        ctrl.max = $scope.max;
        ctrl.min = $scope.min;
        ctrl.maxLength = $scope.maxLength;
        ctrl.minLength = $scope.minLength;

        ctrl.open = function(event) {
          ctrl.openCalendarPane(event);
        };

        ctrl.save = function(start, end) {
          if (end) {
            $scope.startChoice = start;
            $scope.endChoice = end;
            if (typeof($scope.dtConfirm) === 'function') {
              $scope.dtConfirm({ startChoice: start, endChoice: end });
            }
          } else {
            $scope.choice = start;
            if (typeof($scope.dtConfirm) === 'function') {
              $scope.dtConfirm({ choice: start });
            }
          }
          ctrl.closeCalendarPane();
        };

        ctrl.cancel = function() {
          ctrl.closeCalendarPane();
        };

        ctrl.handleWindowBlur = function() {
          ctrl.inputFocusedOnWindowBlur = (document.activeElement === ctrl.switchElement);
        };

        ctrl.handleBodyClick = function(event) {
          if (ctrl.isCalendarOpen) {
            //var isInCalendar = this.$mdUtil.getClosest(event.target, 'ng-datetime');

            var clickX = event.clientX;
            var clickY = event.clientY;
            var elementRect = ctrl.calendarPane.getBoundingClientRect();
            var isInCalendar = false;

            if (clickX > elementRect.left && clickX < elementRect.right &&
              clickY > elementRect.top && clickY < elementRect.bottom) {
              isInCalendar = true;
            }
            if (!isInCalendar) {
              ctrl.closeCalendarPane();
            }
          }
        };

        ctrl.bodyClickHandler = angular.bind(this, ctrl.handleBodyClick);
        ctrl.windowBlurHandler = angular.bind(this, ctrl.handleWindowBlur);

        ctrl.openCalendarPane = function(event) {
          if (!ctrl.isCalendarOpen && !ctrl.isDisabled && !ctrl.inputFocusedOnWindowBlur) {
            ctrl.isCalendarOpen = true;
            ctrl.isOpen = true;
            ctrl.calendarPaneOpenedFrom = event.target;

            ctrl.attachCalendarPane();

            var self = this;
            ctrl.$mdUtil.nextTick(function() {
              self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);
          }
        };

        ctrl.closeCalendarPane = function() {
          if (ctrl.isCalendarOpen) {
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

        ctrl.attachCalendarPane = function() {
          var CALENDAR_PANE_MIN_WIDTH = 300;
          var CALENDAR_PANE_MIN_HEIGHT = 350;
          var calendarPane = ctrl.calendarPane;
          var body = document.body;

          calendarPane.style.transform = '';

          var elementRect = ctrl.switchElement.getBoundingClientRect();
          var bodyRect = body.getBoundingClientRect();

          var topMargin = 3;
          var bottomMargin = 3;
          var leftMargin = 0;
          var rightMargin = 0;
          var heightBias = 0;

          if (typeof($attrs.inputmode) != 'undefined') {
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

          var viewportBottom = viewportTop + ctrl.$window.innerHeight;
          var viewportRight = viewportLeft + ctrl.$window.innerWidth;

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

        ctrl.detachCalendarPane = function() {
          if (ctrl.isCalendarOpen) {
            //ctrl.$mdUtil.enableScrolling();
          }

          if (ctrl.calendarPane.parentNode) {
            ctrl.calendarPane.parentNode.removeChild(ctrl.calendarPane);
          }
        };
      } else {
        $scope.showDatatimeimePickDialog = function(ev) {
          var template = ['<md-dialog class="no-padding" aria-label="日期时间选择">',
            '<ng-datetime choice="vm.choice" ',
            'start-choice="vm.startChoice"  end-choice="vm.endChoice" ',
            'max={{vm.max}} min={{vm.min}} ',
            'max-length={{vm.maxLength}} min-length={{vm.minLength}} ',
            'dt-confirm="vm.choice?vm.save(choice):vm.save(startChoice,endChoice)" dt-cancel="vm.cancel()" ',
            'dt-q-select="vm.dtQSelect" ',
            'dt-language="vm.dtLanguage" ',
            'dt-type={{vm.dtType}} ',
            '</ng-datetime>',
            '</md-dialog>'
          ].join('');

          $mdDialog.show({
            controller: DialogController,
            controllerAs: 'vm',
            template: template,
            targetEvent: ev,
            transclude: true,
            resolve: {
              data: function() {
                return {
                  max: $scope.max,
                  min: $scope.min,
                  maxLength: $scope.maxLength,
                  minLength: $scope.minLength,
                  choice: $scope.choice,
                  startChoice: $scope.startChoice,
                  endChoice: $scope.endChoice,
                  dtQSelect: $scope.dtQSelect,
                  dtLanguage: $scope.dtLanguage,
                  dtType: $scope.dtType || 'date'
                };
              }
            }
          }).then(function(date) {
            if (!date.choice) {
              $scope.startChoice = date.startChoice;
              $scope.endChoice = date.endChoice;
              if (typeof($scope.dtConfirm) === 'function') {
                $scope.dtConfirm({ startChoice: $scope.startChoice, endChoice: $scope.endChoice });
              }
            } else {
              $scope.choice = date.choice;
              if (typeof($scope.dtConfirm) === 'function') {
                $scope.dtConfirm({ choice: $scope.choice });
              }
            }
          }, function() {});
        };

        /**
         * @ngInject
         */
        function DialogController($mdDialog, data) {
          var vm = this;
          vm.choice = data.choice;
          vm.startChoice = data.startChoice;
          vm.endChoice = data.endChoice;
          vm.dtQSelect = data.dtQSelect;
          vm.dtLanguage = data.dtLanguage;
          vm.dtType = data.dtType;
          vm.max = data.max;
          vm.min = data.min;
          vm.maxLength = data.maxLength;
          vm.minLength = data.minLength;
          vm.save = function(start, end) {
            if (end) {
              $mdDialog.hide({ startChoice: start, endChoice: end });
            } else {
              $mdDialog.hide({ choice: start });
            }
          };
          vm.cancel = function() {
            $mdDialog.cancel();
          };
        }
      }
    }
  }
})();