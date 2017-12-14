module.exports = {
    get: async function (guild, channel) {

        // Simply writes stuff to the console instead of normal for unit tests
        let MockWebHook = function () {
            this.edit = async function(name, prop) { return this };
            this.sendMessage = async function(msg) { return this };
        }

        let a = new MockWebHook();
        return a;
    }
};

