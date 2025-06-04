import express from 'express';
import PlanetController from '../controllers/Planet.controller';

const router = express.Router({ strict: true });

// Middleware to parse JSON bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', PlanetController.getAll);
router.get('/:id', PlanetController.getById);
router.post('/', PlanetController.create);
router.put('/:id', PlanetController.update);
router.delete('/:id', PlanetController.delete);

export default router;
