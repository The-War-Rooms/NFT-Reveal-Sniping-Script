import axios from 'axios'


const start = Date.now();
var nfts
var data = []
let maxsupply = 3;
for (let i = 1; i <= maxsupply; i++) {

    data.push(i);
}

console.log(data)
console.log("hi")
console.log(data.length)


async function getAttributes(data) {
    console.log("in")
    const nfttokens = await Promise.all(data.map(async i => {
        //console.log("https://opensea.mypinata.cloud/ipfs/QmWPvE1FCxHPDs8ekq31gnm2PmM5TnR5pYcyM3eoV2ho4R/" + i + ".json")
        const metadata = await axios.get("https://ipfs.infura.io/ipfs/QmWPvE1FCxHPDs8ekq31gnm2PmM5TnR5pYcyM3eoV2ho4R/" + i + ".json");

        let itemdata = {
            token_id: i,
            metaattribute: metadata.data.attributes
        }
        console.log(itemdata)
        return itemdata
    }))
    console.log("out")
    console.log(Array.isArray(nfttokens))
    nfts = nfttokens
    return nfttokens
}

let tokens = await getAttributes(data)

async function printerr() {
    // tokens.map((nfts, i) => (

    //     console.log(nfts.metaattribute[1])


    // ))

    //console.log(nfts[0].metaattribute)
    for (const nft of nfts) {

        for (const attribute of nft.metaattribute) {
            console.log(attribute)
        }
    }
}

printerr()
console.log("total time: ")
console.log((Date.now() - start) / 1000)
