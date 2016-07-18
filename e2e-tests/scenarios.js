'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Nasa Images App', function() {


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });


  describe('/', function() {

    beforeEach(function() {
      browser.get('/');
    });

    it('should render / when user navigates to /', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });

});
