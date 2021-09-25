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

  if (!response.rows[0]) {
    return null;
  }

  console.log("found story:", response.rows[0].id);

  const foundStory = {
    id: response.rows[0].id,
    title: response.rows[0].title,
    lead: response.rows[0].lead,
    created_at: response.rows[0].created_at,
    updated_at: response.rows[0].updated_at,
    thumbnail: response.rows[0].thumbnail,
    body: JSON.parse(response.rows[0].body),
    tags: response.rows[0].tags.split(","),
    consume_time: response.rows[0].consume_time,
    rating: response.rows[0].rating,
  };

  return foundStory;
};

exports.handler = async (event, context) => {
  const { pathParameters } = event;
  const { story } = pathParameters;
  console.log("called get story endpoint");
  console.log("story id received:", story);

  const foundStory = await getStoryById(story);

  if (!foundStory) {
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
      storyId: story,
      story: foundStory,
    }),
  };
  return response;
};
