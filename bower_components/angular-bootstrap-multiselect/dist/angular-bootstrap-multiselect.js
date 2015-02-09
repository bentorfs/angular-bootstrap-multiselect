(function () {
    'use strict';

    var multiselect = angular.module('btorfs.multiselect', ['btorfs.multiselect.templates']);

    multiselect.getRecursiveProperty = function (object, path) {
        return path.split('.').reduce(function (object, x) {
            if (object) {
                return object[x];
            } else {
                return null;
            }
        }, object)
    };

    multiselect.directive('multiselect', ['$filter', '$document', function ($filter, $document) {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                displayProp: '@',
                idProp: '@',
                searchLimit: '=?',
                selectionLimit: '=?',
                showSelectAll: '=?',
                showUnselectAll: '=?',
                showSearch: '=?'
            },
            require: 'ngModel',
            templateUrl: 'multiselect.html',
            link: function ($scope, $element, $attrs, $ngModelCtrl) {
                $scope.selectionLimit = $scope.selectionLimit || 0;
                $scope.searchLimit = $scope.searchLimit || 25;

                $scope.searchFilter = '';

                $scope.toggleDropdown = function () {
                    $scope.open = !$scope.open;
                };

                var closeHandler = function (event) {
                    if (!$element[0].contains(event.target)) {
                        $scope.$apply(function () {
                            $scope.open = false;
                        });
                    }
                };

                $document.on('click', closeHandler);

                $ngModelCtrl.$render = function () {
                    $scope.selection = $ngModelCtrl.$viewValue;
                };

                $ngModelCtrl.$viewChangeListeners.push(function () {
                    $scope.selection = $ngModelCtrl.$viewValue;
                });

                $ngModelCtrl.$isEmpty = function (value) {
                    if (value) {
                        return (value.length === 0);
                    } else {
                        return true;
                    }
                };

                var watcher = $scope.$watch('selection', function () {
                    $ngModelCtrl.$setViewValue(angular.copy($scope.selection));
                }, true);

                $scope.$on('$destroy', function () {
                    $document.off('click', closeHandler);
                    if (watcher) {
                        watcher(); // Clean watcher
                    }
                });

                $scope.getButtonText = function () {
                    if ($scope.selection && $scope.selection.length === 1) {
                        return $scope.getDisplay($scope.selection[0]);
                    }
                    if ($scope.selection && $scope.selection.length > 1) {
                        var totalSelected;
                        totalSelected = angular.isDefined($scope.selection) ? $scope.selection.length : 0;
                        if (totalSelected === 0) {
                            return 'Select';
                        } else {
                            return totalSelected + ' ' + 'selected';
                        }
                    } else {
                        return 'Select';
                    }
                };

                $scope.selectAll = function () {
                    $scope.unselectAll();
                    angular.forEach($scope.options, function (value) {
                        $scope.toggleItem(value);
                    });
                };

                $scope.unselectAll = function () {
                    $scope.selection = [];
                };

                $scope.toggleItem = function (item) {
                    if (typeof $scope.selection === 'undefined') {
                        $scope.selection = [];
                    }
                    var index = $scope.selection.indexOf(item);
                    var exists = index !== -1;
                    if (exists) {
                        $scope.selection.splice(index, 1);
                    } else if (!exists && ($scope.selectionLimit === 0 || $scope.selection.length < $scope.selectionLimit)) {
                        if (!angular.isDefined($scope.selection) || $scope.selection == null) {
                            $scope.selection = [];
                        }
                        $scope.selection.push(item);
                    }
                };

                $scope.getId = function (item) {
                    if (angular.isString(item)) {
                        return item;
                    } else if (angular.isObject(item)) {
                        return multiselect.getRecursiveProperty(item, $scope.idProp);
                    } else {
                        return item;
                    }
                };

                $scope.getDisplay = function (item) {
                    if (angular.isString(item)) {
                        return item;
                    } else if (angular.isObject(item)) {
                        return multiselect.getRecursiveProperty(item, $scope.displayProp);
                    } else {
                        return item;
                    }
                };

                $scope.isSelected = function (item) {
                    var result = false;
                    angular.forEach($scope.selection, function (selectedElement) {
                        if ($scope.getId(selectedElement) === $scope.getId(item)) {
                            result = true;
                        }
                    });
                    return result;
                };

                // This search function is optimized to take into account the search limit.
                // Using angular limitTo filter is not efficient for big lists, because it still runs the search for
                // all elements, even if the limit is reached
                $scope.search = function () {
                    var counter = 0;
                    return function (item) {
                        if (counter > $scope.searchLimit) {
                            return false;
                        }
                        var displayName = $scope.getDisplay(item);
                        if (displayName) {
                            var result = displayName.toLowerCase().indexOf($scope.searchFilter.toLowerCase()) > -1;
                            if (result) {
                                counter++;
                            }
                            return result;
                        }
                    }
                };

            }
        };
    }]);

}());

angular.module('btorfs.multiselect.templates', ['multiselect.html']);

angular.module("multiselect.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("multiselect.html",
    "<div class=\"btn-group\" style=\"width: 100%\">\n" +
    "    <button type=\"button\" class=\"form-control btn btn-default btn-block dropdown-toggle\" ng-click=\"toggleDropdown()\">\n" +
    "        {{getButtonText()}}&nbsp;<span class=\"caret\"></span></button>\n" +
    "    <ul class=\"dropdown-menu dropdown-menu-form\"\n" +
    "        ng-style=\"{display: open ? 'block' : 'none'}\" style=\"width: 100%; overflow-x: auto\">\n" +
    "\n" +
    "        <li ng-show=\"showSelectAll\">\n" +
    "            <a ng-click=\"selectAll()\" href=\"\">\n" +
    "                <span class=\"glyphicon glyphicon-ok\"></span> Select All\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"showUnselectAll\">\n" +
    "            <a ng-click=\"unselectAll()\" href=\"\">\n" +
    "                <span class=\"glyphicon glyphicon-remove\"></span> Unselect All\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"(showSelectAll || showUnselectAll)\"\n" +
    "            class=\"divider\">\n" +
    "        </li>\n" +
    "\n" +
    "        <li role=\"presentation\" ng-repeat=\"option in selection\" class=\"active\">\n" +
    "            <a class=\"item-selected\" href=\"\" ng-click=\"toggleItem(option); $event.stopPropagation()\">\n" +
    "                <span class=\"glyphicon glyphicon-remove\"></span>\n" +
    "                {{getDisplay(option)}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"selection.length > 0\" class=\"divider\"></li>\n" +
    "\n" +
    "        <li ng-show=\"showSearch\">\n" +
    "            <div class=\"dropdown-header\">\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" style=\"width: 100%;\"\n" +
    "                       ng-model=\"searchFilter\" placeholder=\"Search...\"/>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "\n" +
    "        <li ng-show=\"showSearch\" class=\"divider\"></li>\n" +
    "        <li role=\"presentation\" ng-repeat=\"option in options | filter:search() | limitTo: searchLimit\"\n" +
    "            ng-if=\"!isSelected(option)\">\n" +
    "            <a class=\"item-unselected\" href=\"\" ng-click=\"toggleItem(option); $event.stopPropagation()\">\n" +
    "                {{getDisplay(option)}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "\n" +
    "        <li class=\"divider\" ng-show=\"selectionLimit > 1\"></li>\n" +
    "        <li role=\"presentation\" ng-show=\"selectionLimit > 1\">\n" +
    "            <a>{{selection.length || 0}} / {{selectionLimit}} selected</a>\n" +
    "        </li>\n" +
    "\n" +
    "    </ul>\n" +
    "</div>");
}]);
