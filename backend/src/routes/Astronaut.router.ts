// src/routes/AstronautRouter.ts
import express from 'express';
import AstronautController from '../controllers/Astronaut.controller';

const router = express.Router({ strict: true });

// Middleware to parse JSON bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', AstronautController.getAll);
router.get('/:id', AstronautController.getById);
router.post('/', AstronautController.create);
router.put('/:id', AstronautController.update);
router.delete('/:id', AstronautController.delete);

export default router;
