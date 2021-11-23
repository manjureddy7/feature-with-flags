import mapFeatureFlags from '../utils/mapFeatureFlags';

describe('mapFeatureFlags', () => {
    test('should map feature flags correctly for arrayMap', () => {
        const input = {
            featureFlagName:[
                "enable: true",
                "activationStrategies: b",
                "roleIDs: 1"
            ]
        };
        const output = {
            featureFlagName: {
                enable: true,
                activationStrategies: ['b'],
                roleIDs: ["1"]
            }
        };
        expect(mapFeatureFlags(input)).toStrictEqual(output)
    });

    test('should map feature flags correctly for Objap', () => {
        const input = {
            featureFlagName: {
                enable: true,
                activationStrategies: ['b'],
                roleIDs: ["1"]
            }
        };
        const output = {
            featureFlagName: {
                enable: true,
                activationStrategies: ['b'],
                roleIDs: ["1"]
            }
        };
        expect(mapFeatureFlags(input)).toStrictEqual(output)
    });

    test('should return empty feature flags correctly for others', () => {
        const input = "outofbound";
        const output = {};
        expect(mapFeatureFlags(input as any)).toStrictEqual(output)
    });
    
});