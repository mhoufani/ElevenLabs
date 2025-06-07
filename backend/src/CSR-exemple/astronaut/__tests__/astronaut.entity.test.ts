import { IAstronautEntity } from '../domain/astronaut.entity';

describe('AstronautEntity Interface', () => {
    class MockAstronautEntity implements IAstronautEntity {
        id: number;
        firstname: string;
        lastname: string; 
        originPlanetId: number;

        constructor(id: number, firstname: string, lastname: string, originPlanetId: number) {
            this.id = id;
            this.firstname = firstname;
            this.lastname = lastname;
            this.originPlanetId = originPlanetId;
        }
    }

    let astronaut: IAstronautEntity;

    beforeEach(() => {
        astronaut = new MockAstronautEntity(1, 'Neil', 'Armstrong', 1);
    });

    it('should create a valid astronaut entity', () => {
        expect(astronaut).toBeDefined();
        expect(astronaut instanceof MockAstronautEntity).toBeTruthy();
    });

    it('should have all required properties with correct types', () => {
        expect(astronaut).toHaveProperty('id', 1);
        expect(astronaut).toHaveProperty('firstname', 'Neil');
        expect(astronaut).toHaveProperty('lastname', 'Armstrong');
        expect(astronaut).toHaveProperty('originPlanetId', 1);

        expect(typeof astronaut.id).toBe('number');
        expect(typeof astronaut.firstname).toBe('string');
        expect(typeof astronaut.lastname).toBe('string');
        expect(typeof astronaut.originPlanetId).toBe('number');
    })
});
