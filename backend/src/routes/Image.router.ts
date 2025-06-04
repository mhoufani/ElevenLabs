import express from 'express';
import ImageController from '../controllers/Image.controller';

const router = express.Router({ strict: true });

// Middleware to parse JSON bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', ImageController.getAll);
router.get('/:id', ImageController.getById);
router.post('/', ImageController.create);
router.put('/:id', ImageController.update);
router.delete('/:id', ImageController.delete);

export default router;
