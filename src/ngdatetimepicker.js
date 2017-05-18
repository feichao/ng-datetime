(function () {
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
      template: function ($element, $attr) {
        var template;
        var display = '{{ startChoice }}&nbsp;&nbsp;~&nbsp;&nbsp;{{ endChoice }}';
        if ($attr.dtText === undefined) { // button mode
          if ($attr.choice) {
            template = [
              '<md-button class="md-raised md-primary no-margin time-picker-switch" ng-click="vm.openCalendarPanel($event)">',
              ' {{ choice }}',
              '</md-button>'
            ].join(' ');
          } else {
            template = [
              '<md-button class="md-raised md-primary no-margin time-picker-switch" ng-click="vm.openCalendarPanel($event)">',
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
          template += '<div ng-if="vm.isPanelLoading" ng-class="vm.isPanelOpen ? \'open\' : \'\'" class="ng-datetime-wrapper ng-datetime-inline">' + NG_DATETIME_TEMPLATE + '</div>';
        }

        return template;
      },
      controller: ['$scope', '$element', '$attrs', '$document', '$timeout', '$mdDialog', NgDatetimePickerCtrl],
      controllerAs: 'vm'
    };

    function NgDatetimePickerCtrl($scope, $element, $attrs, $document, $timeout, $mdDialog) {
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

      vm.isPanelLoading = false;
      vm.isPanelOpen = false;

      $element.on('click', function (event) {
        event.stopPropagation();
      });

      $document.on('click', function (event) {
        vm.closeCalendarPanel();
        $scope.$digest();
      });

      vm.save = function (startChoice, endChoice, choice) {
        vm.startChoice = startChoice;
        vm.endChoice = endChoice;
        vm.choice = choice;
        vm.dtConfirm({ startChoice: startChoice, endChoice: endChoice, choice: choice });
        vm.closeCalendarPanel();
      };

      vm.cancel = function () {
        vm.closeCalendarPanel();
      };

      vm.openCalendarPanel = function (event) {
        if (!vm.isPanelLoading) {
          vm.isPanelLoading = true;
          vm.calcPosition($element);
        } else {
          vm.isPanelOpen = !vm.isPanelOpen;          
        }
      };

      vm.closeCalendarPanel = function () {
        vm.isPanelOpen = false;
      };

      vm.calcPosition = function (element) {
        var elePositionRect = { left: 0, right: 0, width: 0, top: 0, bottom: 0, height: 0 };
        var docWidth = $document[0].body.offsetWidth;
        var docHeight = $document[0].body.offsetHeight;
        if(element[0] && typeof element[0].getBoundingClientRect === 'function') {
          elePositionRect = element[0].getBoundingClientRect();
        }

        console.log(elePositionRect);

        $timeout(function() {
          var datetimeEle = element.find('ng-datetime');
          var datetimeEleWidth = 0;
          var datetimeEleHeight = 0;

          if(datetimeEle[0]) {
            datetimeEleWidth = datetimeEle[0].offsetWidth;
            datetimeEleHeight = datetimeEle[0].offsetHeight;

            if(docWidth - elePositionRect.left < datetimeEleWidth && elePositionRect.right >= datetimeEleWidth) {
              datetimeEle.parent().css({ left: 'initial', right: 0 });
            }

            if(docHeight - elePositionRect.bottom < datetimeEleHeight && elePositionRect.top >= datetimeEleHeight) {
              datetimeEle.parent().css({ bottom: '100%', top: 'initial' });
            }
          }

          vm.isPanelOpen = true;
        });
      }

      vm.showDatatimePickerDialog = function (ev) {
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
            resolveData: function () {
              return vm;
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
})();
