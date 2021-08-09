let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let scorecardobj = require("./scorecard");
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url,cb);

function cb(error,response,html){
    if(error){
        console.log(error)
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        dataExtractor(html);
    }
}

function dataExtractor(html){
    let searchTool = cheerio.load(html);
    let anchorrep = searchTool('a[data-hover = "View All Results"]');
    let link = anchorrep.attr("href");
    let fullMatchPageLink = `https://www.espncricinfo.com${link}`;
    request(fullMatchPageLink,allMatchPageCB);
    // console.log(fullMatchPageLink);
}

function allMatchPageCB(error,response,html){
    if(error){
        console.log(error)
    }else if(response.statusCode==404){
        console.log("Page Not Found");
    }else{
        getAllScoreCardLink(html);
    }
}

function getAllScoreCardLink(html){
    let searchTool = cheerio.load(html);
    let scorecardArr = searchTool('a[data-hover="Scorecard"]');
    // console.log(scorecardArr.length);
    for(let i=0 ; i<scorecardArr.length ; i++){

        let teamlink = searchTool(scorecardArr[i]).attr("href");
        let teamPageLink = `https://www.espncricinfo.com${teamlink}`;
        // console.log(teamPageLink);
        
        scorecardobj.psm(teamPageLink);
    }
    console.log("----------------------------");
}




