import { Bee } from '@ethersphere/bee-js'
import { readFile } from 'fs/promises'
import { MantarayNode, Reference } from 'mantaray-js'

const NULL_ENTRY = '00'.repeat(32)
const STAMP = '429696f39f4c03c850d03ba63e53715de9dcadc434fbf494b7bb5c82e2854745'

main()

async function main() {
    const bee = new Bee('http://localhost:1633')

    // upload content as data (not file!) on swarm
    const indexHtml = await readFile('./index.html')
    const errorHtml = await readFile('./404.html')
    const firstImage = await readFile('./1.jpg')
    const secondImage = await readFile('./2.jpg')

    const indexHtmlResults = await bee.uploadData(STAMP, indexHtml)
    const errorHtmlResults = await bee.uploadData(STAMP, errorHtml)
    const firstResults = await bee.uploadData(STAMP, firstImage)
    const secondResults = await bee.uploadData(STAMP, secondImage)

    // create mantaray node and add paths
    const mantaray = new MantarayNode()
    mantaray.addFork(pathToBytes('/'), hexStringToReference(NULL_ENTRY), {
        'website-index-document': 'index.html',
        'website-error-document': 'error.html'
    })
    mantaray.addFork(pathToBytes('index.html'), hexStringToReference(indexHtmlResults.reference))
    mantaray.addFork(pathToBytes('error.html'), hexStringToReference(errorHtmlResults.reference))
    mantaray.addFork(pathToBytes('1.jpg'), hexStringToReference(firstResults.reference))
    mantaray.addFork(pathToBytes('2.jpg'), hexStringToReference(secondResults.reference))

    // put the new mantaray node on the swarm network
    const savedMantaray = await mantaray.save(async (data: Uint8Array) => {
        const uploadResults = await bee.uploadData(STAMP, data)
        return hexStringToReference(uploadResults.reference)
    })

    console.log(Buffer.from(savedMantaray).toString('hex'))
}

function hexStringToReference(reference: string): Reference {
    return new Uint8Array(Buffer.from(reference, 'hex')) as Reference
}

function pathToBytes(string: string): Uint8Array {
    return new TextEncoder().encode(string)
}
