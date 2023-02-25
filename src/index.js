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

app.get('/talker/search', 
  auth,
  async (req, res) => {
  const searchTerm = req.query.q;
  const talkers = await talkerFile.getAllTalkers();
  if (searchTerm.length === 0) {
    return res.status(200).json(talkers);
  }
  const filteredTalkers = talkers.filter((talker) => talker.name.includes(searchTerm));
  
  if (filteredTalkers.length === 0) {
    return res.status(200).json([]);
  }
  return res.status(200).json(filteredTalkers);
});

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

app.put('/talker/:id', 
auth,
validateName,
validateAge,
validateTalk,
validateWatchedAt,
validateRate,
async (req, res) => {
  const id = Number(req.params.id);
  const talkers = await talkerFile.getAllTalkers();
  const talker = talkers.find((person) => person.id === id);
  const index = talkers.indexOf(talker);
  const updated = { id, ...req.body };
  talkers.splice(index, 1, updated);
  await talkerFile.writeTalkerFile(updated);
  res.status(200).json(updated);
});

app.delete('/talker/:id',
  auth,
  async (req, res) => {
  const id = Number(req.params.id);
  const talkers = await talkerFile.getAllTalkers();
  const removedTalker = talkers.filter((person) => person.id !== id);
  await talkerFile.deleteTalker(removedTalker);
  res.status(204).json();
});