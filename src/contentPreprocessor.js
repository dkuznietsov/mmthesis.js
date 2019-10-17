/**
 * remove commas and technical notifications
 * @param {string} text
 */
const naiveClean = text =>
    text
        .replace(',', '')
        .split('\r\n')
        .filter(str =>
            !!str && !str.includes('no') && !str.includes('відраховано'))
        .map(topic =>
            topic.split(' '))

module.exports = {
    naiveClean
}
