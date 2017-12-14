var assert = require('assert');

var webhooks = require('../../webhooks/webhooks_mock.js');
var apocalypsebot = require('../../bots/apocalypsebot.js');

  describe('Apocalypse Bot Tests', function() {
    describe('#Handle Messages', function() {
      it('should succeed', function(){

        let bot = new apocalypsebot(webhooks);
        let msg = function() {
            this.guild = ""
            this.channel = { name: "" }
            this.content = ":idea:"
        }
        assert.equal(bot.handleMessage(msg), true)

      });
    });
  });
  