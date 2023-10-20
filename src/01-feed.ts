import { Bee } from '@ethersphere/bee-js'
import { Wallet } from 'ethers'
import { readFile } from 'fs/promises'
const PK = 'cafebabe2c379e713fc8d98bcf7170e452f150f5accb6453aec62d45143b2c7a'
const STAMP = 'ae2969ba894bf2a97cc100a1a8532694f4b4a1de8bb415d007be96ed58c2b871'

main()

async function main() {
    const wallet = new Wallet(PK)
    const bee = new Bee('http://localhost:1633')
    const feedManifest = await bee.createFeedManifest(STAMP, 'sequence', '0f'.repeat(32), wallet.address)
    console.log('feedManifest', feedManifest)
    const firstUploadResults = await bee.uploadFile(STAMP, await readFile('1.jpg'), '1.jpg', {
        contentType: 'image/jpeg'
    })
    const writer = bee.makeFeedWriter('sequence', '0f'.repeat(32), wallet.privateKey)
    writer.upload(STAMP, firstUploadResults.reference)
}
