const express = require('express');
const auth = require('./middlewares/auth');
const validateAge = require('./middlewares/validateAge');
const validateLogin = require('./middlewares/validateLogin');
const validateName = require('./middlewares/validateName');
const validateRate = require('./middlewares/validateRate');
const validateTalk = require('./middlewares/validateTalk');
const validateWatchedAt = require('./middlewares/validateWatchedAt');

const talkerFile = require('./talkerFile');
const generateToken = require('./utils/tokenGenerator');

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

app.post('/talker', 
  auth,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const talkers = await talkerFile.getAllTalkers();
    const newTalker = {
      id: talkers[talkers.length - 1].id + 1,
      name,
      age,
      talk,
    };
    await talkerFile.writeTalkerFile(newTalker);
    res.status(201).json(newTalker);
});