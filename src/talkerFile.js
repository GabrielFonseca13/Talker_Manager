const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const talkerPath = path.resolve(__dirname, './talker.json');

const app = express();
app.use(express.json());

const readTalkerFile = async () => {
  try {
    const contentFile = await fs.readFile(talkerPath);
    return JSON.parse(contentFile);
  } catch (error) {
    console.error('error: ', error.message);
    return null;
  }
};

const getAllTalkers = async () => {
  const allTalkers = await readTalkerFile();
  if (allTalkers.lenght === 0) return [];
  return allTalkers;
};

module.exports = {
  readTalkerFile,
  getAllTalkers,
};
