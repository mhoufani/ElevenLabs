// DO NOT TOUCH

import express from 'express';
import cors from 'cors';
import ImageRouter from './src/routes/Image.router';
import PlanetRouter from './src/routes/Planet.router';
import AstronautRouter from './src/routes/Astronaut.router';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/images', ImageRouter);
app.use('/planets', PlanetRouter);
app.use('/astronauts', AstronautRouter);

app.listen(4000, () => {});

