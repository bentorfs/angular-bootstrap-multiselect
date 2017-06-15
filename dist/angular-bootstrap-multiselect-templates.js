angular.module('btorfs.multiselect.templates', ['multiselect.html']);

angular.module("multiselect.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("multiselect.html",
    "<div class=\"btn-group\" style=\"width: 100%\">\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-block dropdown-toggle\" ng-click=\"toggleDropdown()\" ng-disabled=\"disabled\" style=\"white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis;\">\n" +
    "        {{getButtonText()}}&nbsp;<span class=\"caret\"></span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu dropdown-menu-form\"\n" +
    "        ng-style=\"{display: open ? 'block' : 'none'}\" style=\"width: 100%; overflow-x: auto\">\n" +
    "\n" +
    "        <li ng-show=\"showSelectAll\">\n" +
    "            <a ng-click=\"selectAll()\" href=\"\">\n" +
    "                <span class=\"glyphicon glyphicon-ok\"></span> {{labels.selectAll || 'Select All'}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"showUnselectAll\">\n" +
    "            <a ng-click=\"unselectAll()\" href=\"\">\n" +
    "                <span class=\"glyphicon glyphicon-remove\"></span> {{labels.unselectAll || 'Unselect All'}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"(showSelectAll || showUnselectAll)\"\n" +
    "            class=\"divider\">\n" +
    "        </li>\n" +
    "\n" +
    "        <li role=\"presentation\" ng-repeat=\"option in selectedOptions\" class=\"active\">\n" +
    "            <a class=\"item-selected\" href=\"\" title=\"{{showTooltip ? getDisplay(option) : ''}}\" ng-click=\"toggleItem(option); $event.stopPropagation()\" style=\"overflow-x: auto\">\n" +
    "                <span class=\"glyphicon glyphicon-remove\"></span>\n" +
    "                {{getDisplay(option)}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"selectedOptions.length > 0\" class=\"divider\"></li>\n" +
    "\n" +
    "        <li ng-show=\"showSearch\">\n" +
    "            <div class=\"dropdown-header\">\n" +
    "                <input type=\"text\" class=\"form-control input-sm\" style=\"width: 100%;\"\n" +
    "                       ng-model=\"searchFilter\" placeholder=\"{{labels.search || 'Search...'}}\" ng-change=\"updateOptions()\"/>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "\n" +
    "        <li ng-show=\"showSearch\" class=\"divider\"></li>\n" +
    "        <li role=\"presentation\" ng-repeat=\"option in unselectedOptions | filter:search() | limitTo: searchLimit\"\n" +
    "            ng-if=\"!isSelected(option)\"\n" +
    "            ng-class=\"{disabled : selectionLimit && selectedOptions.length >= selectionLimit}\">\n" +
    "            <a class=\"item-unselected\" href=\"\" title=\"{{showTooltip ? getDisplay(option) : ''}}\" ng-click=\"toggleItem(option); $event.stopPropagation()\" style=\"overflow-x: auto\">\n" +
    "                {{getDisplay(option)}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "\n" +
    "        <li class=\"divider\" ng-show=\"selectionLimit > 1\"></li>\n" +
    "        <li role=\"presentation\" ng-show=\"selectionLimit > 1\">\n" +
    "            <a>{{selectedOptions.length || 0}} / {{selectionLimit}} {{labels.itemsSelected || 'selected'}}</a>\n" +
    "        </li>\n" +
    "\n" +
    "    </ul>\n" +
    "</div>\n" +
    "");
}]);
