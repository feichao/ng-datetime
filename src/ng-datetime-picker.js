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
        minLength: '@',
        ngDisabled: '='
      },
      template: function($element, $attr) {
        var template;
        var random = (Math.random() + '').substr(2);
        var display = '{{ vm.startChoice }}&nbsp;~&nbsp;{{ vm.endChoice }}';
        if($attr.dtText === undefined) { // button mode
          if($attr.choice) {
            template = '<md-button class="md-raised md-primary no-margin" ng-disabled="vm.disabled" ng-click="vm.open($event)">{{ vm.choice }}</md-button>';
          } else {
            template = '<md-button class="md-raised md-primary no-margin" ng-disabled="vm.disabled" ng-click="vm.open($event)">' + display + '</md-button>';
          }
        } else { // text mode
          if($attr.choice) {
            template = '<span class="text-mode-input" ng-class="vm.disabled?\'disabled\':\'\'" ng-click="vm.open($event)">{{ vm.choice }}</span>';
          } else {
            template = '<span class="text-mode-input" ng-class="vm.disabled?\'disabled\':\'\'" ng-click="vm.open($event)">' + display + '</span>';
          }
        }

        if ($attr.dtDialog === undefined) {
          template += '<div dt-id="' + random + '" ng-if="vm.isPanelLoading" ng-class="vm.isPanelOpen ? \'open\' : \'\'" class="ng-datetime-wrapper">' + 
            NG_DATETIME_TEMPLATE + '</div>';
        }

        $element.attr('dt-id', random);

        return template;
      },
      controller: ['$scope', '$element', '$attrs', '$document', '$timeout', '$q', '$mdUtil', '$mdDialog', NgDatetimePickerCtrl],
      controllerAs: 'vm'
    };

    function NgDatetimePickerCtrl($scope, $element, $attrs, $document, $timeout, $q, $mdUtil, $mdDialog) {
      var vm = this;
      var bodyEle = $document[0].body;
      var docWidth = bodyEle.offsetWidth;
      var docHeight = bodyEle.offsetHeight;
      var dtId = $element.attr('dt-id');

      vm.isRange = !$scope.choice;
      vm.isDtDialog = $attrs.dtDialog !== undefined;

      vm.dtQSelect = $scope.dtQSelect;
      vm.dtLanguage = $scope.dtLanguage;
      vm.dtType = $scope.dtType;
      vm.max = $scope.max;
      vm.min = $scope.min;
      vm.maxLength = $scope.maxLength;
      vm.minLength = $scope.minLength;
      vm.disabled = !!$scope.ngDisabled;
      vm.startChoice = $scope.startChoice;
      vm.endChoice = $scope.endChoice;
      vm.choice = $scope.choice;
      vm.dtConfirm = typeof $scope.dtConfirm === 'function' ? $scope.dtConfirm : angular.noop;
      vm.dtCancel = typeof $scope.dtCancel === 'function' ? $scope.dtCancel : angular.noop;

      vm.isPanelLoading = false;
      vm.isPanelOpen = false;

      $scope.$on('$destroy', function() {
        var wrapper = vm.getCorrectDatetimePicker().parent();
        wrapper.remove();
      });

      $scope.$watch('vm.isPanelOpen', function() {
        if(!vm.isPanelOpen) {
          var element = vm.getCorrectDatetimePicker().parent();
          element.removeClass('x50 y50 xy50');
        }
      });

      $element.on('click', function (event) {
        event.stopPropagation();
      });

      $document.on('click', function (event) {
        vm.closeCalendarPanel();
        $scope.$digest();
      });

      vm.openCalendarPanel = function (event) {
        if (!vm.isPanelLoading) {
          vm.isPanelLoading = true;
          vm.appendCalendarPanel().then(function() {
            vm.ignoreAppendedDatetimeClickEvent();
            vm.calcPosition();
            vm.isPanelOpen = true;
          });
        } else {
          vm.isPanelOpen = !vm.isPanelOpen;
          if(vm.isPanelOpen) {
            vm.calcPosition();
          }
        }
      };

      vm.closeCalendarPanel = function () {
        vm.isPanelOpen = false;
      };

      vm.getCorrectDatetimePicker = function() {
        var allDTs = angular.element(bodyEle).find('ng-datetime');
        var dtEle;
        for(var i = 0; i < allDTs.length; i++) {
          dtEle = angular.element(allDTs[i]);
          if(dtEle.parent().attr('dt-id') === dtId) {
            return dtEle;
          }
        }
        return allDTs;
      };

      vm.appendCalendarPanel = function() {
        var deferred = $q.defer();
        $timeout(function() { // append ng-datetime-wrapper to body
          angular.element(bodyEle).append($element.find('ng-datetime').parent());
          deferred.resolve();
        });
        return deferred.promise;
      };

      vm.ignoreAppendedDatetimeClickEvent = function() {
        vm.getCorrectDatetimePicker().on('click', function (event) {
          event.stopPropagation();
        });
      };

      vm.calcPosition = function () {
        var datetimeEle = vm.getCorrectDatetimePicker();
        var datetimeEleWidth = 0;
        var datetimeEleHeight = 0;
        var datetimeEleParent = datetimeEle.parent();
        var elePositionRect = $mdUtil.offsetRect($element[0], bodyEle);
        var x50 = false;
        elePositionRect.right = elePositionRect.left + elePositionRect.width;
        elePositionRect.bottom = elePositionRect.top + elePositionRect.height;

        if (datetimeEle[0]) {
          datetimeEleWidth = datetimeEle[0].offsetWidth;
          datetimeEleHeight = datetimeEle[0].offsetHeight;

          datetimeEleParent.css({ left: elePositionRect.left + 'px', top: elePositionRect.bottom + 'px' });
          if (docWidth - elePositionRect.left < datetimeEleWidth) { // 左边没位置
            if(elePositionRect.right >= datetimeEleWidth) { // 右边有位置
              datetimeEleParent.css({ left: 'initial', right: (docWidth - elePositionRect.right) + 'px' });
            } else { // 右边也没位置，居中
              x50 = true;
              datetimeEleParent.addClass('x50');
            }
          }
          if (docHeight - elePositionRect.bottom < datetimeEleHeight) { // 下边没位置
            if(elePositionRect.top >= datetimeEleHeight) { // 上边有位置
              datetimeEleParent.css({ bottom: (docHeight - elePositionRect.top) + 'px', top: 'initial' });
            } else { // 上边也没位置，居中
              x50 ? datetimeEleParent.addClass('xy50') : datetimeEleParent.addClass('y50');
            }
          }
        }
      };

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
          $scope.startChoice = vm.startChoice = data.startChoice;
          $scope.endChoice = vm.endChoice = data.endChoice;
          $scope.choice = vm.choice = data.choice;
          vm.dtConfirm(data);
        });
      };

      vm.open = function(ev) {
        if(vm.disabled) {
          return;
        }

        if(vm.isDtDialog) {
          vm.showDatatimePickerDialog(ev);
        } else {
          vm.openCalendarPanel(ev);
        }
      };

      vm.save = function (startChoice, endChoice, choice) {
        $scope.startChoice = vm.startChoice = startChoice;
        $scope.endChoice = vm.endChoice = endChoice;
        $scope.choice = vm.choice = choice;
        vm.dtConfirm({ startChoice: startChoice, endChoice: endChoice, choice: choice });
        vm.closeCalendarPanel();
      };

      vm.cancel = function () {
        vm.closeCalendarPanel();
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
