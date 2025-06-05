// React
import { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// Error
import { FetchError } from '../errors/FetchError';
import { ContextError } from '../errors/ContextError';

// API
import { Astronaut } from '../api/astronaut.api';

type SpaceshipContextType = {
  astronautList: {
    isLoading: boolean;
    astronautList?: Astronaut[] | null;
    error?: FetchError | null;
  };
  updateSpaceshipContext: (
    stateToUpdate: Partial<SpaceshipContextType>,
  ) => void;
};

const initialSpaceshipContext: SpaceshipContextType = {
  astronautList: {
    isLoading: false,
  },
  updateSpaceshipContext: () => {},
};

const SpaceshipContext = createContext(initialSpaceshipContext);

export function SpaceshipProvider({ children }: { children: ReactNode }) {
  const [spaceshipState, setSpaceshipState] = useState<SpaceshipContextType>(
    initialSpaceshipContext,
  );

  // avoid re-rendering of the context provider when the state is updated
  const updateSpaceshipContext = useCallback(
    (stateToUpdate: Partial<SpaceshipContextType>) => {
    setSpaceshipState((prevState) => ({
      ...prevState,
      ...stateToUpdate,
    }));
  }, [setSpaceshipState]);

  return (
    <SpaceshipContext.Provider
      value={{
        ...spaceshipState,
        updateSpaceshipContext,
      }}
    >
      {children}
    </SpaceshipContext.Provider>
  );
}

export function useSpaceshipContext(): SpaceshipContextType {
  const spaceshipContext = useContext(SpaceshipContext);

  if (!spaceshipContext) {
    throw new ContextError(
      'SpaceshipContext',
      'no SpaceshipContext available, is the Provider was set?',
    );
  }

  return spaceshipContext;
}

export function useAstronautList(): {
  astronautList: SpaceshipContextType['astronautList'];
  setAstronautList: (
    astronautList: SpaceshipContextType['astronautList'],
  ) => void;
} {
  const { astronautList, updateSpaceshipContext } = useSpaceshipContext();

  const setAstronautList = useCallback(
    (astronautList: SpaceshipContextType['astronautList']) => {
      updateSpaceshipContext({ astronautList });
    },
    [updateSpaceshipContext],
  );

  return {
    astronautList,
    setAstronautList,
  };
}
