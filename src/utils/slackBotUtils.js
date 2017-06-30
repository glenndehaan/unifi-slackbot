const log = require('color-console');

class slackBotUtils {
    constructor(bot) {
        /**
         * Define bot
         */
        this.bot = bot;

        /**
         * Create channels, users and groups array
         * @type {Array}
         */
        this.channels = [];
        this.users = [];
        this.groups = [];

        /**
         * Run function to initial fill array's
         */
        this.getChannels();
        this.getGroups();
        this.getUsers();

        /**
         * Update array's after some time
         */
        setInterval(() => {
            log.green("[General] Update slack users and channels");

            this.channels = [];
            this.users = [];
            this.groups = [];

            this.getChannels();
            this.getGroups();
            this.getUsers();
        }, 10000); //600 000
    }

    /**
     * Get all channels from slack and put them in an array
     */
    getChannels() {
        const slack_channels = this.bot.getChannels()._value.channels;

        for (let item = 0; item < slack_channels.length; item++) {
            this.channels[slack_channels[item].id] = slack_channels[item].name;
        }
    }

    /**
     * Get all groups from slack and put them in an array
     */
    getGroups() {
        const slack_groups = this.bot.getGroups()._value.groups;

        for (let item = 0; item < slack_groups.length; item++) {
            this.groups[slack_groups[item].id] = slack_groups[item].name;
        }
    }

    /**
     * Get all users from slack and put them in an array
     */
    getUsers() {
        const slack_users = this.bot.getUsers()._value.members;

        for (let item = 0; item < slack_users.length; item++) {
            this.users[slack_users[item].id] = slack_users[item].name;
        }
    }
}

module.exports = slackBotUtils;
