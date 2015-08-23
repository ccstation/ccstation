'use strict';

describe('Queues E2E Tests:', function () {
  describe('Test queues page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/queues');
      expect(element.all(by.repeater('queue in queues')).count()).toEqual(0);
    });
  });
});
