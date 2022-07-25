const start = Date.now();
const basePath = process.cwd()
import fs from 'fs'
import path from 'path'
import axios from 'axios'



var nfts
var data = [];
let maxsupply = 5555;
for (let i = 1; i <= maxsupply; i++) {

    data.push(i);
}

const getRarity = async () => {

    //////////////////////////////////////////////

    let tokens = await getAttributes(data)
    processRarity(nfts)
}


async function getAttributes(data) {

    console.log("in")
    const nfttokens = await Promise.all(data.map(async i => {
        const metadata = await axios.get("https://ipfs.infura.io/ipfs/QmWPvE1FCxHPDs8ekq31gnm2PmM5TnR5pYcyM3eoV2ho4R/" + i + ".json");

        let itemdata = {
            token_id: i,
            metaattribute: metadata.data.attributes
        }

        return itemdata
    }))
    console.log("out")
    console.log(Array.isArray(nfttokens))
    nfts = nfttokens
    return nfttokens

}

function processRarity(nfts) {
    console.log('Processing Rarity')
    const rarity = {}

    // loop through all nfts
    for (const nft of nfts) {
        // check if attributes exist
        if (nft.metaattribute?.length > 0) {
            // loop through all attributes
            console.log("inside if statement")
            console.log(nft)
            for (const attribute of nft.metaattribute) {
                // add trait type to rarity object if it doesn't exist
                if (!rarity[attribute.trait_type]) {
                    rarity[attribute.trait_type] = {}
                }
                // add attribute value to rarity object if it doesn't exist and set count to 0
                if (!rarity[attribute.trait_type][attribute.value]) {
                    rarity[attribute.trait_type][attribute.value] = {
                        count: 0
                    }
                }
                // increment count of trait type
                rarity[attribute.trait_type][attribute.value].count++
                // add rarity score to rarity object for each trait type
                rarity[attribute.trait_type][attribute.value].rarityScore = (1 / (rarity[attribute.trait_type][attribute.value].count / nfts.length)).toFixed(2)
            }
        }
    }

    // create a total rarity score for each nft by adding up all the rarity scores for each trait type
    let filterAndTotal = nfts
        .filter(nft => !!nft?.metaattribute)
        .map(nft => {
            let totalScore = 0;
            for (const attribute of nft.metaattribute) {
                attribute.rarity_score = rarity[attribute.trait_type][attribute.value].rarityScore
                totalScore += parseFloat(attribute.rarity_score)
            }
            nft.total_rarity_score = +parseFloat(totalScore).toFixed(2)
            return nft
        })

    // sort and rank nfts by total rarity score
    let sortAndRank = filterAndTotal
        .sort((a, b) => b.total_rarity_score - a.total_rarity_score)
        .map((nft, index) => {
            nft.rank = index + 1
            return nft
        })
        .sort((a, b) => a.token_id - b.token_id)

    if (!fs.existsSync(path.join(`${basePath}`, "/rarity"))) {
        fs.mkdirSync(path.join(`${basePath}`, "rarity"));
    }
    fs.writeFileSync(`${basePath}/rarity/_rarity_data.json`, JSON.stringify(sortAndRank, null, 2))
}

await getRarity();
console.log("Total time: " + ((Date.now() - start) / 1000) + "seconds");