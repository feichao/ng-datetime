## 最全最好用的基于 Angular Material 的日期时间选择控件

[Demo][1]

### how to install
 > bower install ng-datetime --save
 
### how to use 
 > angular.module('YourApp', ['ngMaterial', 'ngMdIcons', 'ngDatetime'])
 > attention: 'ngMaterial', 'ngMdIcons' is required !!
 
after inject ngDatetime, you can use it like below in your template:
```
<ng-datetime ...></ng-datetime>
```

### what is the directive
```
function ngDatetimeDirective() {
    return {
        restrict: 'E',          // only element
        scope: {
            dtType: '@',        // illustrate current datetime pciker type
            dtQSelect: '=',     // illustrate quick select
            dtConfirm: '&',     // callback when click confirm button
            format: '@',        // datetime format
        
            // datetime params
            startChoice: '=',   // illustrate start datetime if dtType is **-range 
            endChoice: '=',     // illustrate end datetime if dtType is **-range 
            choice: '=',        // illustrate datetime if dtType is not **-range
        
            // restrict datetime params
            max: '@',           // illustrate max datetime can select
            min: '@',           // illustrate min datetime can select
            maxLength: '@',     // illustrate max length between startChoice & endChoice only if dtType is **-range
            minLength: '@',     // illustrate min length between startChoice & endChoice only if dtType is **-range
        
            // language
            dtLanguage: '='     // language: cn or en or object
        },
        ...
    };
}
```

### about some params
 - dtType
 > date, time, datetime, date-range, time-range, datetime-range, date-timerange

 - dtQSelect
 > array contains object like { label: '', value: ''}. label shows to user, value indicates the some seconds ago 

 - dtConfirm
 > callback when user click confirm btn, params are selected date, startChioce & endChoice when dtType is **-range otherwise chioce

 - dtLanguage
 > the language that picker is used, default 'cn' (Chinese), another is 'en' (English). Or you can define your own language like this:
    ```
    language = {
        today: 'Jy',
        confirm: 'Okk',
        weeks: ['Rii', 'Yii', 'Er', 'Sam', 'Si', 'Wui', 'Liu']
    };
    ```
    
### thanks for using...


  [1]: http://www.0xfc.cn/article/0/58d1332040149d025b07ceab