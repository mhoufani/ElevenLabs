// Libs
import { useNavigate, useParams } from "react-router-dom";

// Components
import { Flexbox } from "../../components/Flexbox";
import { AstronautForm } from "./AstronautForm";
import { HUDPlanetDescription } from "../../components/HUDPlanetDescription";
import { HUDWindowWarning } from "../../components/HUDWindowWarning";
import { HUDWindowLoader } from "../../components/HUDWindowLoader";

// API
import {
  Astronaut,
  createAstronautAPICall,
  CreateUpdateAstronautRequestBody,
  getOneAstronautFromAPI,
  updateAstronautAPICall,
} from "../../api/astronaut.api";

// Hooks
import { useFetch } from "../../hooks/useFetch";

// Context
import { useCurrentPlanet } from "../../contexts/SpaceTravelContext.tsx";

// Styles
import styles from "./CreateOrEditAstronaut.module.css";
import { useCallback } from "react";
import { getPlanetListFromAPI, Planet } from "../../api/planet.api.ts";

export function CreateOrEditAstronaut() {
  const navigate = useNavigate();
  const { astronautId } = useParams();
  const handleCreateOrEditCancel = () => navigate("/spaceship-admin");
  const handleAstronautFormCreate = async (
    astronaut: CreateUpdateAstronautRequestBody,
  ) => {
    await createAstronautAPICall(astronaut);
    navigate("/spaceship-admin");
  };
  const handleAstronautFormEdit = async (
    astronaut: CreateUpdateAstronautRequestBody,
  ) => {
    if (!astronautId) {
      throw new Error("Missing astronautId, WRONG URL!");
    }
    await updateAstronautAPICall(astronautId, astronaut);
    navigate("/spaceship-admin");
  };

  const mode = astronautId ? "edit" : "create";
  const handleAstronautFormSubmit =
    mode === "create" ? handleAstronautFormCreate : handleAstronautFormEdit;

  const { currentPlanet } = useCurrentPlanet();
  const { data: planetList, isLoading: isLoadingPlanetList } = useFetch<Planet[]>(getPlanetListFromAPI);
  
  // avoid re-rendering of the getOneAstronaut function when the astronautId not changes
  const getOneAstronaut = useCallback<((options?: RequestInit) => Promise<Astronaut | undefined>)>(
    (options?: RequestInit) => getOneAstronautFromAPI(astronautId, options),
    [astronautId],
  );
  // useFetch is not re-rendering when the getOneAstronaut function is re-created
  const { isLoading, data } = useFetch<Astronaut | undefined>(getOneAstronaut);

  return (
    <Flexbox flexDirection="column" className={styles.createoreditastronaut}>
      {currentPlanet === "NO_WHERE" ? (
        <HUDWindowWarning
          warning="current planet: UnKnow"
          className={styles.createoreditastronautCurrentPlanetWarning}
        />
      ) : (
        <HUDPlanetDescription
          name={`current planet: ${currentPlanet.name}`}
          isHabitable={currentPlanet.isHabitable}
          className={styles.createoreditastronautCurrentPlanet}
        />
      )}
      <Flexbox justifyContent="center" alignItems="center">
        {isLoading || isLoadingPlanetList ? (
          <HUDWindowLoader />
        ) : (
          <AstronautForm
            astronautForUpdate={data}
            planetList={planetList || []}
            mode={mode}
            onCancel={handleCreateOrEditCancel}
            onSubmit={handleAstronautFormSubmit}
            className={styles.createoreditastronautForm}
          />
        )}
      </Flexbox>
    </Flexbox>
  );
}
