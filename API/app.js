import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routers/userRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use(router);

export default app;