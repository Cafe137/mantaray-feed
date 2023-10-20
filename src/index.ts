import { Bee } from '@ethersphere/bee-js'
import { Wallet } from 'ethers'
import { readFile } from 'fs/promises'
import { MantarayNode, Reference } from 'mantaray-js'

const STAMP = '429696f39f4c03c850d03ba63e53715de9dcadc434fbf494b7bb5c82e2854745'
const PRIVATE_KEY = 'ffff96f39f4c03c850d03ba63e53715de9dcadc434fbf494b7bb5c82e2854745'
const TOPIC = '00'.repeat(32)
const NULL_ENTRY = '00'.repeat(32)

main()

async function main() {
    const bee = new Bee('http://localhost:1633')
    const wallet = new Wallet(PRIVATE_KEY)
    const results = await bee.createFeedManifest(STAMP, 'sequence', TOPIC, wallet.address)

    console.log('Our feed is:', results)

    const indexHtml = await readFile('./index.html')
    const firstImage = await readFile('./1.jpg')
    const secondImage = await readFile('./2.jpg')

    const indexHtmlResults = await bee.uploadData(STAMP, indexHtml)
    const firstResults = await bee.uploadData(STAMP, firstImage)
    const secondResults = await bee.uploadData(STAMP, secondImage)

    const mantaray = new MantarayNode()
    mantaray.addFork(pathToBytes('/'), hexStringToReference(NULL_ENTRY), {
        'website-index-document': 'index.html'
    })
    mantaray.addFork(pathToBytes('index.html'), hexStringToReference(indexHtmlResults.reference))
    mantaray.addFork(pathToBytes('1.jpg'), hexStringToReference(firstResults.reference))
    mantaray.addFork(pathToBytes('2.jpg'), hexStringToReference(secondResults.reference))

    // put the new mantaray node on the swarm network
    const savedMantaray = await mantaray.save(async (data: Uint8Array) => {
        const uploadResults = await bee.uploadData(STAMP, data)
        return hexStringToReference(uploadResults.reference)
    })

    const writer = bee.makeFeedWriter('sequence', TOPIC, PRIVATE_KEY)
    writer.upload(STAMP, Buffer.from(savedMantaray).toString('hex') as any)
}

function hexStringToReference(reference: string): Reference {
    return new Uint8Array(Buffer.from(reference, 'hex')) as Reference
}

function pathToBytes(string: string): Uint8Array {
    return new TextEncoder().encode(string)
}
