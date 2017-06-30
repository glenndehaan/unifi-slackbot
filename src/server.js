const SlackBot = require('slackbots');
const log = require('color-console');
const unifi = require('node-unifi');
const slackBotUtils = require('./utils/slackBotUtils');
const config = require('./config/config');
let utils = null;

/**
 * Create a new slack bot
 *
 * @see https://my.slack.com/services/new/bot
 * @type {Bot}
 */
const bot = new SlackBot({
    token: config.slackToken,
    name: config.botName
});

/**
 * Create new UniFi controller object
 *
 * @type {Controller}
 */
const controller = new unifi.Controller(config.unifiIP, config.unifiPort);

/**
 * Get new token from UniFi Controller
 *
 * @param data
 */
const createVoucher = (data) => {
    controller.login(config.unifiUsername, config.unifiPassword, (err) => {
        if(err) {
            console.log('UNIFI ERROR: ' + err);
            return;
        }

        // CREATE VOUCHER
        controller.createVouchers(config.unifiSiteID, 480, (err, voucher_data) => {
            controller.getVouchers(config.unifiSiteID, (err, voucher_data_complete) => {
                bot.postMessageToUser(utils.users[data.user], `Your code is ready: ${[voucher_data_complete[0][0].code.slice(0, 5), '-', voucher_data_complete[0][0].code.slice(5)].join('')}`, () => {
                    bot.postMessageToUser(utils.users[data.user], "This code can only be used once and is valid till the end of this day!");
                });

                console.log(`User: ${utils.users[data.user]} | Code: ${[voucher_data_complete[0][0].code.slice(0, 5), '-', voucher_data_complete[0][0].code.slice(5)].join('')}`);
                controller.logout();
            }, voucher_data[0][0].create_time);
        }, 1, 1);
    });
};

/**
 * Bot is ready to start firing events
 */
bot.on('start', () => {
    log.green("[General] I'm alive !!");

    /**
     * Init Utils
     */
    utils = new slackBotUtils(bot);
});

/**
 * All ingoing slack events
 *
 * @see https://api.slack.com/rtm
 */
bot.on('message', (data) => {
    /**
     * Log al unnecessary events like reconnect and hello messages
     */
    if (data.type != "hello" && data.type != "reconnect_url" && data.type != "message") {
        log.yellow("[" + data.type + "] " + "User: " + utils.users[data.user]);
    }

    /**
     * Process user messages from chat
     */
    if (data.type === 'message') {
        if (typeof utils.users[data.user] !== 'undefined' || utils.users[data.user] === config.botName || data.user === '') {
            if (data.channel.charAt(0) === 'D') {
                /**
                 * User sends a direct message
                 */

                bot.postMessageToUser(utils.users[data.user], 'Hi ! Please wait generating your code...');
                createVoucher(data);
            }
        }
    }
});

/**
 * Slack hangup the connection
 *
 * @see https://api.slack.com/events/goodbye
 */
bot.on('close', () => {
    /**
     * Exit with a failure since slack isn't there anymore
     *
     * @see systemctl restart
     */

    process.exit(1);
});

/**
 * Something gone wrong with the slack connection
 */
bot.on('error', () => {
    /**
     * Exit with a failure since we don't know what happened here
     *
     * @see systemctl restart
     */

    process.exit(1);
});
