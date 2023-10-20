import { Bee } from '@ethersphere/bee-js'
import { Strings } from 'cafe-utility'
import { readFile } from 'fs/promises'
import { MantarayNode, Reference } from 'mantaray-js'

const STAMP = 'f283d88af0ed45376c12e49455743234b6c3da9e9c979a6762bb589257379c2a'

main()

async function main() {
    const bee = new Bee('http://localhost:1633')
    const firstImage = await bee.uploadData(STAMP, await readFile('1.jpg'))
    const secondImage = await bee.uploadData(STAMP, await readFile('2.jpg'))
    const mantaray = new MantarayNode()
    mantaray.addFork(new TextEncoder().encode('/'), Strings.hexToUint8Array('00'.repeat(32)) as Reference, {
        'website-index-document': '1.jpg'
    })
    mantaray.addFork(new TextEncoder().encode('1.jpg'), Strings.hexToUint8Array(firstImage.reference) as Reference)
    mantaray.addFork(new TextEncoder().encode('2.jpg'), Strings.hexToUint8Array(secondImage.reference) as Reference)
    const mantarayReference = await mantaray.save(async (data: Uint8Array): Promise<Reference> => {
        const uploadResults = await bee.uploadData(STAMP, data)
        return Strings.hexToUint8Array(uploadResults.reference) as Reference
    })
    console.log(Strings.uint8ArrayToHex(mantarayReference))
}
