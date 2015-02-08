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

    multiselect.directive('multiselect', function ($filter, $document) {
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
    });

}());
