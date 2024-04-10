import express from 'express';
import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

main().catch(err => console.error(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/auth');
}

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'La password deve essere minimo 8 caratteri'],
  },
  passwordConferma: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Le password non sono uguali',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConferma = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  passwordNormale,
  passwordCriptata
) {
  return await bcrypt.compare(passwordNormale, passwordCriptata);
};

const User = mongoose.model('User', userSchema);

//
const prendiListaUtenti = async (req, res) => {
  try {
    let prendiUtenti = await User.find();

    res.status(200).json({
      status: 'success',
      data: prendiUtenti,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: 'Errore nel prendere utenti',
    });
  }
};

const registraUtente = async (req, res) => {
  try {
    let checkEmail = await User.find({ email: req.body.email });
    if (checkEmail.length > 0) throw new Error('Email già in uso');

    let salvaUtente = await User.create({
      email: req.body.email,
      password: req.body.password,
      passwordConferma: req.body.passwordConferma,
    });

    const token = jwt.sign({ id: salvaUtente._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: 'success',
      data: salvaUtente,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: 'prova',
    });
  }
};

const loginUtente = async (req, res) => {
  try {
    // const {email,password} = req.body

    let trovaUtente = await User.findOne({ email: req.body.email });
    console.log(trovaUtente);
    if (!trovaUtente) throw new Error('Email non valida!');

    // const confrontaPassword = User.correctPassword(req.body.password,trovaUtente.password)

    if (
      !trovaUtente ||
      !(await trovaUtente.correctPassword(
        req.body.password,
        trovaUtente.password
      ))
    ) {
      throw new Error('Incorrect email or password', 401);
    }

    const token = jwt.sign({ id: trovaUtente._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: 'prova',
    });
  }
};

const resettaDB = async (req, res) => {
  try {
    await User.deleteMany({});

    res.status(200).json({
      status: 'correct',
      message: null,
    });
  } catch (error) {
    res.status(404).json({
      stauts: 'fails',
      message: "Error nell'elmiinazione",
    });
  }
};

const router = express.Router();

router
  .get('/listaUtenti', prendiListaUtenti)
  .post('/registrazioneUtente', registraUtente)
  .delete('/resetUtenti', resettaDB)
  .post('/loginUtente', loginUtente);

app.use(router);

app.listen(port, () => {
  console.log(`Il server sta ascoltando sulla port ${port}`);
});
