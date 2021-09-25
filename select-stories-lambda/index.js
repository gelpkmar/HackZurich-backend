"use strict";
console.log("Loading selectStories function");
const db = require("./db/client");


const getStoriesByTime = async (minTime,optTime,maxTime) => {
  console.log("started get story by time preference");
  const client = await db.connect();
  const response = await client.query(
    `
        SELECT *
        FROM public.articles
        WHERE articles.consume_time <= ${maxTime};
    `
  );

  client.release();

  if (!response.rows[0]) {
    return null;
  }
  var foundTimeStories = new Array(response.rowCount).fill(null);
  
  for (let i = 0; i < response.rowCount; i++) {
    foundTimeStories[i]={'id':response.rows[i].id, 'title':response.rows[i].title, 'lead':response.rows[i].lead, 'thumbnail':response.rows[i].thumbnail};
  } 

  console.log("found story:", response.rows[0].id);

  return foundTimeStories;
};

const getStoriesByInterest = async (foundTimeStories, interests) => {
  
  
  return ;
};


exports.handler = async (event) => {
    let responseCode = 200;
    var minTime = event.time*0.9;
    var optTime = event.time;
    var maxTime = event.time*1.1;
    var formats = event.formats;
    var interests = event.interests;
    console.log("request: " + JSON.stringify(event));
    
    const foundTimeStories = await getStoriesByTime(minTime,optTime,maxTime);
    
    if (!foundTimeStories) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "stories according to time preference not found",
          }),
        };
    }
    
    const foundInterestStories = await getStoriesByInterest(foundTimeStories, interests);

    
    var response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST"
        },
        body: JSON.stringify({
          message: "success",
          storyIds: foundTimeStories
        }),
    };
  
  return response;


};