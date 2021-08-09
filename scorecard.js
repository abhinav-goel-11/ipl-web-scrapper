// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
function processSingleMatch(url){

    request(url,cb);
}
function cb(error,response,html){
    if(error){
        console.log(error)
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        playerStats(html);
    }
}

function playerStats(html){
    let folderPath = "C:\\Users\\avipc\\Desktop\\dev pp\\module_2_WebScraping\\activity\\cricket_info"
    folderPath = path.join(folderPath,"IPL");
    if(fs.existsSync(folderPath)==false){
        fs.mkdirSync(folderPath);
    }
    let searchTool = cheerio.load(html);
    let bothInningsArr = searchTool(".Collapsible");
//    let scorecard = "";
   for(let i=0 ; i<bothInningsArr.length ; i++){
       teamNameElem = searchTool(bothInningsArr[i]).find("h5")
       let teamName = searchTool(teamNameElem).text();
       teamName = teamName.split("INNINGS")[0];
       teamName = teamName.trim();
       let bothTableAllRows = searchTool(bothInningsArr[i]).find(".table.batsman>tbody>tr");
        //   console.log(teamName);
       for(let j=0 ; j<bothTableAllRows.length ; j++){
           let numberOfTds = searchTool(bothTableAllRows[j]).find("td");
           if(numberOfTds.length==8){
               let playerName = searchTool(numberOfTds[0]).text().trim();
               console.log(playerName);

               let R = searchTool(numberOfTds[2]).text().trim();
               console.log(R);

               let B = searchTool(numberOfTds[3]).text().trim();
               console.log(B);

               let FOURS = searchTool(numberOfTds[5]).text().trim();
               console.log(FOURS);

               let SIXES = searchTool(numberOfTds[6]).text().trim();
               console.log(SIXES);

               let SR = searchTool(numberOfTds[7]).text().trim();
               console.log(SR);

               matchObj = {
                   "name" : playerName,
                   "runs" : R,
                   "bowls":B,
                   "fours":FOURS,
                   "sixes":SIXES,
                   "sr":SR
                }
                let matchArr = [matchObj];
                let teamFolder = path.join(folderPath,teamName);
                if(fs.existsSync(teamFolder)==false){
                    fs.mkdirSync(teamFolder);
                }

                let playerFile = path.join(teamFolder,playerName+".json");
                if(fs.existsSync(playerFile)==false){
                    let jsonWriteAble = JSON.stringify(matchArr);   //write data
                    fs.writeFileSync(playerFile,jsonWriteAble);
                }else{                                              // append data 
                    let content = fs.readFileSync(playerFile);
                    let jsonData = JSON.parse(content);

                    jsonData.push(matchObj);
                    let jsonWriteAble = JSON.stringify(jsonData);
                    fs.writeFileSync(playerFile, jsonWriteAble);
                }
           }
       }
       console.log("```````````````````````````");
    }
   
}

module.exports = {
    psm : processSingleMatch
}