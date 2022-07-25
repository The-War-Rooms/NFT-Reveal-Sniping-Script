const axios = require("axios");
const md5 = require("md5");
const TrackingUrl = "https://opensea.mypinata.cloud/ipfs/QmfZNoPiSfyYjruksDzTn8VSDpYsCjUkYXGpeeYCtpSTfp/8704";
var metaData = null;
var sniperCall = false;


function main() {
    while (!sniperCall) {
        var curMetaData = getMetadata();
        if (curMetaData == null) {
            return "Unable to get Metadata, the url may not be functional"
        }
        if (metaData != null) {
            if (curMetaData != metaData) {
                sniperCall = true;
                callRaritySniper();
            };
        } else {
            metaData = curMetaData;
        }
    }
};

async function getMetadata() {
    try {
        var resp = await axios.get(TrackingUrl);
        if (resp.status != 200) {
            return null;
        }
        var hashedData = md5(resp.data);
        console.log(hashedData);
        return hashedData;
    } catch (err) {
        console.error(err);
        return null;
    }

};


function callRaritySniper() {
    var nume = 1;
};

main();