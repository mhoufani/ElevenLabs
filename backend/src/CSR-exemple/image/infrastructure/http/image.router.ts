import express from "express";
import { ImageController } from "./image.controller";
import { ImageService } from "../../application/image.service";
import { MysqlImageRepository } from "../../infrastructure/repository/mysql.image.repository";
import knex from '../../../../db';

/**
 * Router layer for images
 * This layer is responsible for the HTTP requests of the images
 * It uses the controller layer to handle the HTTP requests
 * It also uses the service layer to get the data from the database
 */
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const imageController = new ImageController(
    new ImageService(
        new MysqlImageRepository(
            knex
        )
    )
);

router.get("/", imageController.getImages);
router.get("/:id", imageController.getImageById);
router.post("/", imageController.createImage);
router.put("/:id", imageController.updateImage);
router.delete("/:id", imageController.deleteImage);

export default router;