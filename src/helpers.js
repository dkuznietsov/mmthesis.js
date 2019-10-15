const _ = require('lodash')

const fs = require('fs')

/**
 * Normalizes occurencies count so that each
 * next entry contains acumulated probability of previous entryies, up to 1
 * @param {Array<[string, number]>} dictPairs
 * @returns {Array<[string, number]>}
 */
const normalizeDict = dictPairs => {
    const allOccurencies = _.sumBy(dictPairs, _.last)

    return _.chain(dictPairs)
        .map(([word, count]) =>
            [word, count / allOccurencies])
        .reduce(([res, acumulated], [word, count]) =>
            [[...res, [word, count + acumulated]], count + acumulated], [[], 0])
        .first()
        .value()
}


/**
 * Performs readFile node operation and returns promise
 * @param {string} filename
 * @param {string} format
 * @returns {Promise<Buffer|NodeJS.ErrnoException>} promise with result of operation
 */
const rfPromisify = (filename, format) =>
    new Promise((resolve, reject) =>
        fs.readFile(`${__dirname}/${filename}.${format}`, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        }))

/**
 * finds word from entries by acumulated probability
 * Assumption is that more likely words have bigger acumulated probability intervals
 * @param {Array<[string, number]>} dictPairs normalized pairs of words and acumulated probabilities
 * @returns {string}
 */
const chooseByAcumulatedProb = dictPairs => {
    const key = Math.random()

    return _.chain(dictPairs)
        .find(([, prob]) =>
            prob > key)
        .first()
        .value()
}

/**
 * @param {Array<[string, number]>} dictPairs entries of format word: count of occurencies
 */
const acumulatedProbWordChooser = dictPairs => {
    const normalizedDict = normalizeDict(dictPairs)

    return () =>
        chooseByAcumulatedProb(normalizedDict)
}


module.exports = {
    rfPromisify,
    acumulatedProbWordChooser
}
