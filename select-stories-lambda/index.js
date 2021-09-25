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
        WHERE articles.consume_time = $1::integer;
    `,
    [optTime]
  );

  client.release();

  if (!response.rows[0]) {
    return null;
  }

  console.log("found story:", response.rows[0].id);

  const foundStory = {
    id: response.rows[0].id
  };

  return foundStory;
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
            message: "not found",
          }),
        };
    }
    
    var response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "success",
          storyIds: foundTimeStories
        }),
    };
  
  return response;


};