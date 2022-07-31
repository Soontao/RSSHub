
const cheerio = require('cheerio');
const createJieba = require('js-jieba');
const {
    JiebaDict, HMMModel, UserDict, IDF, StopWords
} = require('jieba-zh-cn');

const jieba = createJieba(
    JiebaDict,
    HMMModel,
    UserDict,
    IDF,
    StopWords
);

/**
 *
 * @param {string} content
 */
function getKeyWords(content) {
    if (typeof content === 'string' && content.length > 0) {
        const plainText = cheerio.load(content).root().text();
        return jieba.extract(plainText, 5).map((key) => key.word);
    }
    return [];
}


module.exports = getKeyWords;
