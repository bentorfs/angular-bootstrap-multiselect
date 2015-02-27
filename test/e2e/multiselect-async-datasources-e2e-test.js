describe('Multiselect, using string models, ', function () {

    beforeEach(function () {

    });

    it('should update the options on every key press in the filter box', function () {
        browser.get('test/e2e/test-async-datasources.html');

        var form = element(by.name('asyncTest'));
        form.element(by.className('dropdown-toggle')).click();
        var unselectedItems = form.all(by.tagName('li')).all(by.className('item-unselected'));
        expect(unselectedItems.count()).toBe(0);
        var selectedItems = form.all(by.tagName('li')).all(by.className('item-selected'));
        expect(selectedItems.count()).toBe(0);

        form.element(by.model('searchFilter')).sendKeys('FOO');

        unselectedItems = form.all(by.tagName('li')).all(by.className('item-unselected'));
        expect(unselectedItems.count()).toBe(4);
        expect(unselectedItems.get(0).getInnerHtml()).toContain('FOO1');

        form.element(by.model('searchFilter')).sendKeys('BAR');

        unselectedItems = form.all(by.tagName('li')).all(by.className('item-unselected'));
        expect(unselectedItems.count()).toBe(4);
        expect(unselectedItems.get(0).getInnerHtml()).toContain('FOOBAR1');
    });

});
