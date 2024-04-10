import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

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

export default User;
