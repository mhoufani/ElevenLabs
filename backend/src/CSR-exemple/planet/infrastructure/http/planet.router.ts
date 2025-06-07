import express from "express";
import { PlanetController } from "./planet.controller";
import { PlanetService } from "../../application/planet.service";
import { MysqlPlanetRepository } from "../../infrastructure/repository/mysql.planet.repository";
import knex from '../../../../db';

/**
 * Router layer for planets
 * This layer is responsible for the HTTP requests of the planets
 * It uses the controller layer to handle the HTTP requests
 * It also uses the service layer to get the data from the database
 */
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const planetController = new PlanetController(
    new PlanetService(
        new MysqlPlanetRepository(
            knex
        )
    )
);

router.get("/", planetController.getPlanets);
router.get("/:id", planetController.getPlanetById);
router.post("/", planetController.createPlanet);
router.put("/:id", planetController.updatePlanet);
router.delete("/:id", planetController.deletePlanet); 

export default router;