var assert = require('assert');

var webhooks = require('../../webhooks/webhooks_mock.js');
var radishbot = require('../../bots/radishbot.js');

  describe('Radish Bot Tests', function() {
    describe('#Handle Messages', function() {
      it('should succeed', function(){

        let bot = new radishbot(webhooks);
        let msg = function() {
            this.guild = ""
            this.channel = { name: "" }
            this.content = ":sorry_bone_bag:"
        }
        assert.equal(bot.handleMessage(msg), true)

      });
    });
  });
  