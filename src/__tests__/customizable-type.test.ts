import * as uuid from 'uuid/v4';

import CustomizableType from '../customizable-type';
import { FixtureContext } from '../fixture';

describe('Customizable Type', () => {
    test('should use fixture context to create type', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => ({value}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        }
        const sut = new CustomizableType<{value: string}>(type, mockContext);

        // Act
        const createdType = sut.create();

        // Assert
        expect(createdType.value).toBe(value);
        expect(mockCreateFunction.mock.calls.length).toBe(1);
        expect(mockCreateFunction.mock.calls[0][0]).toBe(type);
    })

    test('throw error when type is not an object', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => value);
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        }
        
        // Act and assert
        expect(() => new CustomizableType<any>(type, mockContext))
            .toThrowError('CustomizableType can only be used for type \'object\'');
    })

    test('should apply functions to type created by the fixture context', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => ({value}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        }
        const sut = new CustomizableType<{value: string}>(type, mockContext);
        const updatedValue = uuid();
        const mockModifierFunctionOne = jest.fn(() => uuid());
        const mockModifierFunctionTwo = jest.fn(m => m.value = updatedValue);
        
        // Act
        const createdType = sut
            .do(mockModifierFunctionOne)
            .do(mockModifierFunctionTwo)
            .create();

        // Assert
        expect(createdType.value).toBe(updatedValue);
        expect(mockModifierFunctionOne.mock.calls.length).toBe(1);
        expect(mockModifierFunctionTwo.mock.calls.length).toBe(1);
    })

    test('should change value of property on type when using \'with\'', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => ({value}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        }
        const sut = new CustomizableType<{value: string}>(type, mockContext);
        const additionalData = uuid();
        
        // Act
        const createdType = sut
            .with('value', v => v + additionalData)
            .create();

        // Assert
        expect(createdType.value).toBe(value + additionalData);
    })
})