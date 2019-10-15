const _ = require('lodash')

const { acumulatedProbWordChooser } = require('./helpers')

class MarkovChain {
    /**
     * @param {string[][]} wordsBulk
     */
    constructor(wordsBulk) {
        this._graph = this._generateMatrixGraph(wordsBulk)
    }

    /**
     * generate array of all 2-word sequences of all topics, group them by first word
     * then for every first word count all occurencies of following words
     * normalize following word occurencies by acumulated probability
     * @param {string[][]} wordsBulk
     * @private
     */
    _generateMatrixGraph(wordsBulk) {
        return _.chain(wordsBulk)
            .flatMap(topic =>
                _.zip(_.initial(topic), _.tail(topic)))
            .groupBy(_.first)
            .mapValues(arr =>
                _.chain(arr)
                    .map(_.last)
                    .countBy()
                    .value())
            .mapValues(_.toPairs)
            .value()
    }

    /**
     * returns next word if it exists in graph
     * @param {string} word
     */
    getNextWord(word) {
        const wordDictionary = this._graph[word]

        const wordChooser = acumulatedProbWordChooser(wordDictionary)

        return wordDictionary
            ? wordChooser()
            : ''
    }
}

module.exports = {
    MarkovChain
}
