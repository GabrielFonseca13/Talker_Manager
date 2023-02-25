const express = require('express');
const validateLogin = require('./middlewares/validateLogin');
// const fs = require('fs').promises;
// const { join } = require('path');
// const path = '/src/talker.json';
const talkerFile = require('./talkerFile');
const generateToken = require('./utils/tokenGenerator');

// const talkerPath = path.resolve(__dirname, './talker.json');

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

app.post('/login', validateLogin, async (_req, res) => {
  const token = generateToken();
  return res.status(200).json({ token });
});

// rascunho req 5 
// app.post('/talker', async (req, res) => {
//   try {
//     const { name, age, watchedAt, rate } = req.body;
//     const talkers = await talkerFile.getAllTalkers();
//     const newTalker = {
//       id: talkers[talkers.length - 1].id + 1,
//       name,
//       age,
//       talk: { watchedAt, rate },
//     };
//     const allTalkers = JSON.stringify([...talkers, newTalker]);
//     await fs.writeFile(talkerFile, allTalkers);
//     res.status(201).json(newTalker);
//   } catch (error) {
//     return null;
//   }
// });