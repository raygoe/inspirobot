var assert = require('assert');

var webhooks = require('../../webhooks/webhooks_mock.js');
var inspirobot = require('../../bots/inspirobot.js');

  describe('Inspiro Bot Tests', function() {
    describe('#Handle Messages', function() {
      it('should succeed', function(){

        let bot = new inspirobot(webhooks);
        let msg = {
            guild: "",
            channel: { name: "" },
            content: ":idea:"
        }
        assert.equal(bot.handleMessage(msg), true)

      });
    });
  });
  