var assert = require('assert');

var webhooks = require('../../webhooks/webhooks_mock.js');

  describe('Web Hook Mock Tests', function() {
    describe('#Can mock common commands', function() {
      it('should succeed', function(){

        webhooks.get(null, null)
        .then(webhook => webhook.edit(null, null))
        .then(webhook => {webhook.sendMessage(null);
                          webhook.edit(null, null);
                         })
        .catch(console.error);

      });
    });
  });
  