import { Fixture } from './fixture';

/**
 * Create injector function for tests
 * @param constructorFunc - function used for constructing fixtures
 * @returns function which can be used to inject fixtures in tests
 */
export function createInjector(constructorFunc: () => Fixture) {
    return <T extends void | Promise<void>>(testFunc: (fixture: Fixture, ...args: any[]) => T) => {
        return (...args: any[]) => {
            const fixture = constructorFunc();

            try {
                return testFunc(fixture, ...args);
            } finally {
                fixture.reset();
            }
        };
    };
}
