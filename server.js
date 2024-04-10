import 'dotenv/config';
import app from './API/app.js';
import connectDB from './API/utils/connectDB.js';

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

const port = process.env.PORT || 10000;

connectDB;

const server = app.listen(port, () => {
  console.log(`Environment: ${process.env.NODE_ENV}
Server listening on: http://127.0.0.1:${port}/ ✅`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHADLER REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
