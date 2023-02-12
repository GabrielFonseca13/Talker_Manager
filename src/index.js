const express = require('express');
// const fs = require('fs').promises;
// const { join } = require('path');

// const path = '/src/talker.json';
const talkerFile = require('./talkerFile');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

//  STARTS

app.get('/talker', async (req, res) => {
  const allTalkers = await talkerFile.getAllTalkers();
  res.status(200).json(allTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await talkerFile.getTalkerById(Number(id));
  if (!talker) { 
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' }); 
  }
  res.status(200).json(talker);
});