// React
import { MouseEventHandler, FormEvent, useState } from 'react';

// Libs
import classnames from 'classnames';

// Components
import { HUDWindow } from '../../../components/HUDWindow';
import { Form } from '../../../components/Form';
import { HUDInput } from '../../../components/HUDInput';
import { HUDButton } from '../../../components/HUDButton';
import { Flexbox } from '../../../components/Flexbox';
import { HUDSelect } from '../../../components/HUDSelect';

// API
import {
  CreateUpdateAstronautRequestBody,
  Astronaut,
} from '../../../api/astronaut.api';

// Styles
import styles from './AstronautForm.module.css';
import { Planet } from '../../../api/planet.api.ts';

type AstronautFormProps = {
  astronautForUpdate?: Astronaut | null;
  planetList: Planet[];
  className?: string;
  mode?: string;
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSubmit: (astronaut: CreateUpdateAstronautRequestBody) => void;
};

type FormStateType = {
  firstname?: string;
  lastname?: string;
  planet?: string;
};

export function AstronautForm({
  astronautForUpdate,
  planetList,
  className,
  mode = 'create',
  onCancel,
  onSubmit,
}: AstronautFormProps) {
  const componentClassNames = classnames(styles.astronautform, className);

  const [formState, setFormState] = useState<FormStateType>({});
  const [astronautFirstname, setAstronautFirstname] = useState(astronautForUpdate?.firstname || '');
  const [astronautLastname, setAstronautLastname] = useState(astronautForUpdate?.lastname || '');
  const [astronautOriginPlanet, setAstronautOriginPlanet] = useState(
    mode === 'create' 
    ? planetList[0]?.id.toString() ?? '' 
    : astronautForUpdate?.originPlanet?.id.toString() ?? ''
  );

  const validateAndSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: FormStateType = {};
    if (
      astronautFirstname === ''
    ) {
      validationErrors.firstname = 'firstname is required';
    }
    if (
      astronautLastname === ''
    ) {
      validationErrors.lastname = 'lastname is require';
    }
    if (
      astronautOriginPlanet === ''
    ) {
      validationErrors.planet = 'planet of origin is required';
    }

    // submit the form if there is no validation error
    if (
      !Object.keys(validationErrors).length &&
      astronautFirstname &&
      astronautLastname &&
      astronautOriginPlanet
    ) {
      onSubmit({
        firstname: astronautFirstname,
        lastname: astronautLastname,
        originPlanetId: parseInt(astronautOriginPlanet),
      });
    } else {
      setFormState(validationErrors);
    }
  };

  return (
    <Flexbox className={componentClassNames} flexDirection="column">
      <HUDWindow>
        {mode === 'create' ? (
          <h2>Create an Astronaut</h2>
        ) : (
          <h2>Edit an Astronaut</h2>
        )}
        <Form
          onSubmit={validateAndSubmit}
          className={styles.astronautformForm}
          noValidate
        >
          <HUDInput
            name="firstname"
            label="firstname"
            placeholder="John"
            required
            defaultValue={astronautFirstname}
            error={formState.firstname}
            onChange={(e) => setAstronautFirstname(e.target.value)}
          />
          <HUDInput
            name="lastname"
            label="lastname"
            placeholder="Doe"
            required
            defaultValue={astronautLastname}
            error={formState.lastname}
            onChange={(e) => setAstronautLastname(e.target.value)}
          />
          <HUDSelect
            name="originPlanet"
            label="originPlanet"
            required
            value={astronautOriginPlanet}
            options={planetList.map((planet) => ({
              value: planet.id.toString(),
              label: planet.name,
            }))}
            onChange={(e) => setAstronautOriginPlanet(e.target.value)}
          />
          <Flexbox
            className={styles.astronautformButtons}
            alignItems="center"
            justifyContent="center"
          >
            <HUDButton onClick={onCancel}>CANCEL</HUDButton>
            {mode === 'create' ? (
              <HUDButton>CREATE</HUDButton>
            ) : (
              <HUDButton>EDIT</HUDButton>
            )}
          </Flexbox>
        </Form>
      </HUDWindow>
      {mode === 'create' && !planetList.find((planet) => planet.id === parseInt(astronautOriginPlanet)) && (
        <HUDWindow className={styles.astronautformCannotCreate}>
          <h2>Warning !</h2>
          <p>
            Cannot create an astronaut because the current planet don \'t
            shelters life.
          </p>
          <p>Travel to an another planet to add an astronaut.</p>
        </HUDWindow>
      )}
    </Flexbox>
  );
}
