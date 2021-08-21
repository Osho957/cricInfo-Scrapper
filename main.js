const request = require("request");
const cheerio = require("cheerio");
const scoreObj = require("./score");
const fs = require("fs");
const path = require("path");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

const iplPath = path.join(__dirname,"ipl");
dirCreator(iplPath);
request(url, cb);

function cb(error, respose, html) {
  if (error) {
    console.log(error);
  } else if (respose.statusCode == 404) {
    console.log("Page Not Found");
  } else {
    dataExtractor(html);
  }
}

function dataExtractor(html) {
  let $ = cheerio.load(html);
  let anchor = $('a[data-hover="View All Results"]');
  let link = anchor.attr("href");
  let fullLink = `https://www.espncricinfo.com${link}`;
 // console.log(fullLink);
  request(fullLink, allMatchPageCb);
}

function allMatchPageCb(error, respose, html) {
  if (error) {
    console.log(error);
  } else if (respose.statusCode == 404) {
    console.log("Page Not Found");
  } else {
    getAllScoreCard(html);
  }
}

function getAllScoreCard(html) {

    let $ = cheerio.load(html);
   let boards = $('a[data-hover="Scorecard"]');
   for(let i=0;i<boards.length;i++){
       let link = $(boards[i]).attr("href");
       let fullUrl =`https://www.espncricinfo.com${link}`;
       scoreObj.processSingleMatch(fullUrl);
   }
  
   
}

function dirCreator(filePath){
  if(fs.existsSync(filePath)==false){
  fs.mkdirSync(filePath);
  }
}

