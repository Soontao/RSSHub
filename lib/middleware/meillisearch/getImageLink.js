

/**
 * get image link from content
 * @param {string} content
 * @returns {string|undefined}
 */
function getImageLink(content) {
    if (typeof content === 'string') {
        const r = /(https?:\/\/.*\/.*\.(png|gif|jpeg|jpg))/.exec(content);
        if (r !== null) {
            return r[0];
        }
    }
}

module.exports = getImageLink;
