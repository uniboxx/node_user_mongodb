import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router
  .get('/listaUtenti', userController.prendiListaUtenti)
  .post('/registrazioneUtente', userController.registraUtente)
  .delete('/resetUtenti', userController.resettaDB)
  .post('/loginUtente', userController.loginUtente);

export default router;
