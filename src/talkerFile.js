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

const writeTalkerFile = async (newTalker) => {
  try {
    const allTalkers = await readTalkerFile();
    allTalkers.push(newTalker);
    await fs.writeFile(talkerPath, JSON.stringify(allTalkers));
  } catch (error) {
    console.error('error: ', error.message);
  }
};

const getAllTalkers = async () => {
  const allTalkers = await readTalkerFile();
  if (allTalkers.lenght === 0) return [];
  return allTalkers;
};

const getTalkerById = async (id) => {
  const allTalkers = await readTalkerFile();
  return allTalkers.find((talker) => Number(talker.id) === id);
};

module.exports = {
  readTalkerFile,
  writeTalkerFile,
  getAllTalkers,
  getTalkerById,
};
