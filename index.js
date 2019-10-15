const { rfPromisify } = require('./src/helpers')

const { MarkovChain } = require('./src/markovChain')
const { MarkovChainGenerator } = require('./src/markovChainGenerator')


async function main() {
    const data = await rfPromisify('data', 'csv')

    const text = data.toString()

    // split data by row
    // remove empty, 'no' and 'відраховано' strings (found by inspecting file contents)
    const topics = text
        .replace(',', '')
        .split('\r\n')
        .filter(str =>
            !!str && !str.includes('no') && !str.includes('відраховано'))

    const topicsWords = topics
        .map(topic =>
            topic.split(' '))

    const markovChain = new MarkovChain(topicsWords)

    const generator = new MarkovChainGenerator(
        word =>
            markovChain.getNextWord(word),
        topicsWords
    )

    return Array.from(
        { length: 40 },
        () =>
            generator.generate(30)
    )
}

main()
