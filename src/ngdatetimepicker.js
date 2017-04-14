(function() {
  'use strict';

  angular
    .module('ngDatetimePicker', [
      'ngDatetime'
    ])
    .directive('ngDatetimePicker', NgDatetimePicker);

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

        // language
        dtLanguage: '='
      },
      template: function($element, $attr) {
        if ($attr.inputmode === 'true') {
          if ($attr.choice) {
            return '<md-input-container><input type="text" style="text-align:center" aria-label="please select" class="time-picker" ng-click="showDatatimeimePickDialog($event)" value="{{choice}}"></md-input-container>';
          } else {
            return '<md-input-container><input type="text" style="text-align:center" aria-label="please select" class="time-picker" ng-click="showDatatimeimePickDialog($event)" value="{{startChoice}} to {{endChoice}}"></md-input-container>';
          }
        } else {
          if ($attr.choice) {
            return '<md-button class="md-raised md-primary time-picker" ng-click="showDatatimeimePickDialog($event)">{{choice}}</md-button>';
          } else {
            return '<md-button class="md-raised md-primary time-picker" ng-click="showDatatimeimePickDialog($event)">{{startChoice}} to {{endChoice}}</md-button>';
          }
        }
      },
      controller: controller
    };

    function NgDatetimePickerLinker($scope, $element, $attr) {
      var buttonEle = $element[0].querySelector('.time-picker');
      var template1 = '{{choice}}';
      var template2 = '{{startChoice}} to {{endChoice}}';
      if ($scope.choice) {
        buttonEle.innerText = template1;
      } else {
        buttonEle.innerText = template2;
      }
    }

    /**
     * @ngInject
     */
    function controller($scope, dateFilter, $mdDialog) {
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
          'dt-type={{vm.dtType}}>',
          'format={{vm.format}}>',
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
                format: $scope.format,
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
        vm.format = data.format;
        vm.max = data.max;
        vm.min = data.min;
        vm.maxLength = data.maxLength;
        vm.minLength = data.minLength;
        vm.save = function(data) {
          setTimeout(function() {
            if (vm.choice) {
              //console.log('choice:' + vm.choice);
              $mdDialog.hide({ choice: vm.choice });
            } else {
              //console.log('startChoice:' + vm.startChoice + ',endChoice' + vm.endChoice);
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
})();