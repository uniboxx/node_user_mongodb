import mongoose from 'mongoose';

//- DATABASE CONNECTION
const DB =
  //- local database url
  process.env.DATABASE_LOCAL + process.env.DATABASE_NAME_LOCAL;
//- atlas databse url
// process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD) +
// process.env.DATABASE_NAME;

const connectDB = mongoose.connect(DB).then(connection => {
  if (DB?.match(/127.0.0.1/)) {
    console.log(`Connected to local MongoDB database! ✅`);
  } else console.log(`Connected to remote MongoDB database! ✅`);
});

export default connectDB;
