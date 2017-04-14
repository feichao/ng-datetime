(function() {
  'use strict';

  //NgDatetimePickerCtrl['$inject'] = ["$scope", "$element", "$attrs", "$window", "$mdUtil", "$mdConstant", "$mdDialog"];

  angular
    .module('ngDatetimePicker', [
      'ngDatetime'
    ])
    .directive('ngDatetimePicker', NgDatetimePicker);



  var NG_DATETIME_TEMP = ['<ng-datetime choice="choice" ',
    'start-choice="startChoice"  end-choice="endChoice" ',
    'max={{ctrl.max}} min={{ctrl.min}} ',
    'max-length={{ctrl.maxLength}} min-length={{ctrl.minLength}} ',
    'dt-confirm="ctrl.save(value)" dt-cancel="ctrl.cancel()" ',
    'dt-q-select="ctrl.dtQSelect" ',
    'dt-language="ctrl.dtLanguage" ',
    'dt-type={{ctrl.dtType}} ',
    // 'format={{ctrl.format}} ',
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
              templateHtml = '<md-button class="md-raised md-primary time-picker-switch" ng-click="ctrl.open($event)">{{startChoice}} to {{endChoice}}</md-button>';
            }
          } else {
            if ($attr.choice) {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="ctrl.open($event)" value="{{choice}}"></md-input-container>';
            } else {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="ctrl.open($event)" value="{{startChoice}} to {{endChoice}}"></md-input-container>';
            }
          }
        } else {
          if (typeof($attr.inputmode) == 'undefined') {
            if ($attr.choice) {
              templateHtml = '<md-button class="md-raised md-primary time-picker-switch" ng-click="showDatatimeimePickDialog($event)">{{choice}}</md-button>';
            } else {
              templateHtml = '<md-button class="md-raised md-primary time-picker-switch" ng-click="showDatatimeimePickDialog($event)">{{startChoice}} to {{endChoice}}</md-button>';
            }
          } else {
            if ($attr.choice) {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="showDatatimeimePickDialog($event)" value="{{choice}}"></md-input-container>';
            } else {
              templateHtml = '<md-input-container class="time-picker-switch"><input type="text" readonly="readonly" aria-label="please select" ng-click="showDatatimeimePickDialog($event)" value="{{startChoice}} to {{endChoice}}"></md-input-container>';
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
      console.log($attr);
      var inputElement = $element[0].querySelector('input');
      if (inputElement) {
        inputElement.style['text-align'] = 'center';
        if ($attr['startChoice'] && $attr['endChoice']) {
          inputElement.style['min-width'] = '350px';
        }
      }
      return function($scope, $element, $attr) {

      };
    }

    /**
     * @ngInject
     */
    function NgDatetimePickerCtrl($scope, $element, $attrs, $window, $mdUtil, $mdConstant, $mdDialog) {
      if (typeof($attrs.inline) != 'undefined') { //判断是否内联显示
        this.inline = true;
        this.$window = $window;
        this.$mdUtil = $mdUtil;
        this.$mdConstant = $mdConstant;
        this.documentElement = angular.element(document.documentElement);
        this.openOnFocus = true; //输入框获取到焦点时打开

        this.isFocused = false;
        this.isCalendarOpen = false;
        this.isOpen = false;
        this.isDisabled = false;
        this.inputFocusedOnWindowBlur = false;
        this.switchElement = $element[0].querySelector('.time-picker-switch');
        this.ngSwitchElement = angular.element(this.switchElement);

        this.calendarPane = $element[0].querySelector('.ng-datetime-inline');
        //this.attachInteractionListeners();

        var ctrl = this;

        ctrl.choice = $scope.choice;
        ctrl.startChoice = $scope.startChoice;
        ctrl.endChoice = $scope.endChoice;
        ctrl.dtQSelect = $scope.dtQSelect;
        ctrl.dtLanguage = $scope.dtLanguage;
        ctrl.dtType = $scope.dtType;
        // ctrl.format = $scope.format;
        ctrl.max = $scope.max;
        ctrl.min = $scope.min;
        ctrl.maxLength = $scope.maxLength;
        ctrl.minLength = $scope.minLength;

        ctrl.open = function(event) {
          ctrl.openCalendarPane(event);
        };

        ctrl.save = function(data) {
          // setTimeout(function() {
          //   if (!ctrl.choice) {
          //     $scope.startChoice = ctrl.startChoice;
          //     $scope.endChoice = ctrl.endChoice;
          //   } else {
          //     $scope.choice = ctrl.choice;
          //   }
          // }, 50);
          ctrl.closeCalendarPane();
        };
        ctrl.cancel = function() {
          ctrl.closeCalendarPane();
        };

        ctrl.handleWindowBlur = function() {
          this.inputFocusedOnWindowBlur = (document.activeElement === this.switchElement);
        };

        ctrl.handleBodyClick = function(event) {
          if (ctrl.isCalendarOpen) {
            var isInCalendar = this.$mdUtil.getClosest(event.target, 'ng-datetime');
            if (!isInCalendar) {
              this.closeCalendarPane();
            }
          }
        };

        this.bodyClickHandler = angular.bind(this, this.handleBodyClick);
        this.windowBlurHandler = angular.bind(this, this.handleWindowBlur);

        ctrl.openCalendarPane = function(event) {
          if (!this.isCalendarOpen && !this.isDisabled && !this.inputFocusedOnWindowBlur) {
            this.isCalendarOpen = true;
            this.isOpen = true;
            this.calendarPaneOpenedFrom = event.target;

            this.attachCalendarPane();

            var self = this;
            this.$mdUtil.nextTick(function() {
              self.documentElement.on('click touchstart', self.bodyClickHandler);
            }, false);
          }
        };

        ctrl.closeCalendarPane = function() {
          if (this.isCalendarOpen) {
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
          var CALENDAR_PANE_WIDTH = 360;
          var CALENDAR_PANE_HEIGHT = 368;
          var calendarPane = this.calendarPane;
          var body = document.body;

          calendarPane.style.transform = '';

          var elementRect = this.switchElement.getBoundingClientRect();
          var bodyRect = body.getBoundingClientRect();

          this.topMargin = 0;
          this.leftMargin = 0;

          var paneTop = elementRect.top - bodyRect.top - this.topMargin + elementRect.height;
          var paneLeft = elementRect.left - bodyRect.left - this.leftMargin;

          // var viewportTop = (bodyRect.top < 0 && document.body.scrollTop == 0) ?
          //   -bodyRect.top :
          //   document.body.scrollTop;

          // var viewportLeft = (bodyRect.left < 0 && document.body.scrollLeft == 0) ?
          //   -bodyRect.left :
          //   document.body.scrollLeft;

          // var viewportBottom = viewportTop + this.$window.innerHeight;
          // var viewportRight = viewportLeft + this.$window.innerWidth;

          // if (paneLeft + CALENDAR_PANE_WIDTH > viewportRight) {
          //   if (viewportRight - CALENDAR_PANE_WIDTH > 0) {
          //     paneLeft = viewportRight - CALENDAR_PANE_WIDTH;
          //   } else {
          //     paneLeft = viewportLeft;
          //     var scale = this.$window.innerWidth / CALENDAR_PANE_WIDTH;
          //     calendarPane.style.transform = 'scale(' + scale + ')';
          //   }
          // }

          // if (paneTop + CALENDAR_PANE_HEIGHT > viewportBottom &&
          //   viewportBottom - CALENDAR_PANE_HEIGHT > viewportTop) {
          //   paneTop = viewportBottom - CALENDAR_PANE_HEIGHT;
          // }
          calendarPane.style.display = 'block';
          calendarPane.style.position = "absolute";
          calendarPane.style.left = paneLeft + 'px';
          calendarPane.style.top = paneTop + 'px';
          document.body.appendChild(calendarPane);
        };

        ctrl.detachCalendarPane = function() {
          if (this.isCalendarOpen) {
            //this.$mdUtil.enableScrolling();
          }

          if (this.calendarPane.parentNode) {
            this.calendarPane.parentNode.removeChild(this.calendarPane);
          }
        };
      } else {
        this.inline = false;

        // $scope.$watch('choice', function() {
        //   if (typeof($scope.dtConfirm) === 'function') {
        //     $scope.dtConfirm($scope.choice);
        //   }
        // });

        $scope.showDatatimeimePickDialog = function(ev) {
          var template = ['<md-dialog class="no-padding" aria-label="日期时间选择">',
            '<ng-datetime choice="vm.choice" ',
            'start-choice="vm.startChoice"  end-choice="vm.endChoice" ',
            'max={{vm.max}} min={{vm.min}} ',
            'max-length={{vm.maxLength}} min-length={{vm.minLength}} ',
            'dt-confirm="vm.save(value)" dt-cancel="vm.cancel()" ',
            'dt-q-select="vm.dtQSelect" ',
            'dt-language="vm.dtLanguage" ',
            'dt-type={{vm.dtType}} ',
            //'format={{vm.format}}>',
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
                  //format: $scope.format,
                  dtType: $scope.dtType || 'date'
                };
              }
            }
          }).then(function(date) {
            if (!date.choice) {
              $scope.startChoice = date.startChoice;
              $scope.endChoice = date.endChoice;
            } else {
              $scope.choice = date.choice;
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
          //vm.format = data.format;
          vm.max = data.max;
          vm.min = data.min;
          vm.maxLength = data.maxLength;
          vm.minLength = data.minLength;
          vm.save = function(data) {
            setTimeout(function() {
              if (vm.choice) {
                $mdDialog.hide({ choice: vm.choice });
              } else {
                $mdDialog.hide({ startChoice: vm.startChoice, endChoice: vm.endChoice });
              }
            }, 50);
          };
          vm.cancel = function() {
            $mdDialog.cancel();
          };
        }
      }
    }
  }
})();