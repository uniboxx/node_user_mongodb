import User from '../models/userModel.js';

export async function prendiListaUtenti(req, res) {
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
}

export async function registraUtente(req, res) {
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
}

export async function loginUtente(req, res) {
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
}

export async function resettaDB(req, res) {
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
}
