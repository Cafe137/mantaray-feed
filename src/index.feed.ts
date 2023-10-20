import { Bee } from '@ethersphere/bee-js'
import { Wallet } from 'ethers'
import { readFile } from 'fs/promises'

const STAMP = '429696f39f4c03c850d03ba63e53715de9dcadc434fbf494b7bb5c82e2854745'
const PRIVATE_KEY = 'ffff96f39f4c03c850d03ba63e53715de9dcadc434fbf494b7bb5c82e2854745'
const TOPIC = '00'.repeat(32)

main()

async function main() {
    const bee = new Bee('http://localhost:1633')

    const wallet = new Wallet(PRIVATE_KEY)
    const results = await bee.createFeedManifest(STAMP, 'sequence', TOPIC, wallet.address)

    const uploadResults = await bee.uploadFile(STAMP, await readFile('2.jpg'), '2.jpg', {
        contentType: 'image/jpeg'
    })
    const writer = bee.makeFeedWriter('sequence', TOPIC, PRIVATE_KEY)
    writer.upload(STAMP, uploadResults.reference)
}
