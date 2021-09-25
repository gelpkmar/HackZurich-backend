"use strict";
console.log("Loading function");
const db = require("./db/client");
const R = require("rambda");

const getStoryById = async (storyId) => {
  console.log("started get story by id function");
  const client = await db.connect();
  const response = await client.query(
    `
        SELECT *
        FROM public.articles
        WHERE articles.id = $1::integer;
    `,
    [storyId]
  );

  client.release();

  console.log("found story:", response);
  return response.rows;
};

exports.handler = async (event, context) => {
  const { pathParameters } = event;
  const { story } = pathParameters;
  console.log("called get story endpoint");
  console.log("story id received:", story);

  const fullStory = await getStoryById(story);

  var response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "success",
      storyId: story,
      story: fullStory,
    }),
  };
  return response;
};
