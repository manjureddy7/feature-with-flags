import getConfigInObjMap from '../utils/getConfigInObjMap';

describe('getConfigInObjMap', () => {
    test('should return proper arrayMap with single stratigies', () => {
        const params = {
            featureFlagName: {
                enable: true,
                activationStrategies: ['b'],
                roleIDs: ["1"]
            }
        }
        expect(getConfigInObjMap(params)).toStrictEqual(params)
    });
    test('should return proper arrayMap with multiple stratigies', () => {
        const params = {
            featureFlagName: {
                enable: true,
                activationStrategies: ['a', 'b'],
                roleIDs: ["1"]
            }
        }
        expect(getConfigInObjMap(params)).toStrictEqual(params)
    });
});