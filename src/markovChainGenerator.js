const _ = require('lodash')

const { acumulatedProbWordChooser } = require('./helpers')


class MarkovChainGenerator {
    /**
     * @param {(word: string) => string} wordGenerator
     * @param {string[][]} wordsBulk
     */
    constructor(wordGenerator, wordsBulk) {
        this._wordGenerator = wordGenerator
        this._firstWords = this._generateFirstWords(wordsBulk)
        this._lastWords = this._generateLastWords(wordsBulk)
    }

    /**
     * @param {number} numOfIterations
     */
    generate(numOfIterations) {
        const first = acumulatedProbWordChooser(this._firstWords)()

        return _.chain(Array(numOfIterations - 1))
            .fill('')
            .reduce(
                res =>
                    (this._lastWords.includes(_.last(res))
                        ? res
                        : [...res, this._wordGenerator(_.last(res))]),
                [first]
            )
            .join(' ')
            .value()
    }

    /**
     * @param {string[][]} wordsBulk
     * @private
     */
    _generateFirstWords(wordsBulk) {
        return this._generateDictHelper(wordsBulk, 10, _.first)
    }

    /**
     * @param {string[][]} wordsBulk
     * @returns {string[]}
     * @private
     */
    _generateLastWords(wordsBulk) {
        return this._generateDictHelper(wordsBulk, 20, _.last)
            .map(_.first)
    }

    /**
     * @param {{string[][]}} bulk
     * @param {number} num
     * @param {(words: string[]) => string)} picker
     * @private
     */
    _generateDictHelper(bulk, num, picker) {
        return _.chain(bulk)
            .map(picker)
            .countBy()
            .toPairs()
            .sortBy(_.last)
            .takeRight(num)
            .value()
    }
}

module.exports = {
    MarkovChainGenerator
}
