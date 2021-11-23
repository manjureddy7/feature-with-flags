import getConfigInArrayMap from '../utils/getConfigInArrayMap';

describe('getConfigInArrayMap', () => {
    test('should return proper arrayMap with single stratigies', () => {
        const input = {
            featureFlagName:[
                "enable: true",
                "activationStrategies: b",
                "roleIDs: 1"
            ]
        }
        const output = {
            featureFlagName: {
                enable: true,
                activationStrategies: ['b'],
                roleIDs: ["1"]
            }
        }
        expect(getConfigInArrayMap(input)).toStrictEqual(output)
    });
    test('should return proper arrayMap with multiple stratigies', () => {
        const input = {
            featureFlagName:[
                "enable: true",
                "activationStrategies: a,b",
                "roleIDs: 1"
            ]
        }
        const output = {
            featureFlagName: {
                enable: true,
                activationStrategies: ['a', 'b'],
                roleIDs: ["1"]
            }
        }
        expect(getConfigInArrayMap(input)).toStrictEqual(output)
    });
    test('When the config is empty', () => {
        const input = {
            featureFlagName:[]
        }
        const output = {
            featureFlagName: {}
        }
        expect(getConfigInArrayMap(input)).toStrictEqual(output)
    });

    test('When the config input is empty', () => {
        const input = {
        }
        const output = {
        }
        expect(getConfigInArrayMap(input)).toStrictEqual(output)
    });
});