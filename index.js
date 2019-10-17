const { rfPromisify, accessPromisify } = require('./src/helpers')

const { naiveClean } = require('./src/contentPreprocessor')

const { MarkovChain } = require('./src/markovChain')
const { MarkovChainGenerator } = require('./src/markovChainGenerator')

async function main(filePath, numIterations = 40, tokenLength = 30) {
    await accessPromisify(filePath)

    const data = await rfPromisify(filePath)

    const topicsWords = naiveClean(data.toString())

    const markovChain = new MarkovChain(topicsWords)

    const generator = new MarkovChainGenerator(
        word =>
            markovChain.getNextWord(word),
        topicsWords
    )

    const res = Array.from(
        { length: numIterations },
        () =>
            generator.generate(tokenLength)
    )

    console.log(res)
    return res
}
main(...process.argv.slice(2))
