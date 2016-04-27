/**
 * Created by Nick-PC on 27.04.2016.
 */
//регулярное выражение для поиска скобок
var BRACKETS_REGEXP = /^[\[\]\{\}\(\)]+$/;

//создаем модуль приложения
//подключаем модуль ngMessages для вывода сообщений о валидности
var app = angular.module('validApp', ['ngMessages']);
// создаем контроллер
app.controller('validCtrl',['$scope',function($scope){
    $scope.data = '';
}]);
//создаем дерективу проверки ввода (,),[,],{,}.
app.directive('brackets', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.brackets = function(modelValue, viewValue) {
                ctrl.$error.wrongExpression = false;

                if (ctrl.$isEmpty(modelValue)) {
                    // разрешить пустое поле
                    return true;
                }

                if (BRACKETS_REGEXP.test(viewValue)) {
                    // проверка на скобки
                    return true;
                }

                ctrl.$error.wrongExpression = true;
                return false;
            };
        }
    };
});
// создаем дерективу для проверки на закрытые скобки...
app.directive('sequence', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.sequence = function(modelValue, viewValue) {
                ctrl.$error.wrongExpression = false;
                if (ctrl.$isEmpty(modelValue)) {
                    // разрешить пустое поле
                    return true;
                }
                // проверку осуществляем через стек...
                var isValid = true;

                var openBr = ['{','(','['];
                var closedBr = ['}',')',']'];
                var stack = [];
                for (i=0;i< viewValue.length; i++)
                {
                    var char = viewValue[i];
                    var openCharIndex = openBr.indexOf(char);
                    if(openCharIndex > -1)
                    {
                        stack.push(closedBr[openCharIndex]);
                    }
                    else if(closedBr.indexOf(char) > -1 && stack.length > 0 && stack[stack.length - 1] === char)
                    {
                        stack.pop();
                    }
                    else
                    {
                        isValid = false;
                        break;
                    }
                }

                var isValid = isValid && stack.length === 0;

                ctrl.$error.wrongBracketsSequence = !isValid;
                return isValid;
            };
        }
    };
});