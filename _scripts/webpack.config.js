const webpack = require('webpack');

module.exports = {
    watchOptions: {
        poll: true
    },

    entry: `${__dirname}/../public/js/main.js`,

    stats: {
        colors: true,
    }
};
