import { ConfigType, FeatureFlagConfigArrayMap, FeatureFlagConfigObjMap } from '../types';
import returnTypeOfConfig from '../utils/returnTypeOfConfig';

describe('returnTypeOfConfig', () => {
    test('should return type of config as Array Map', () => {
        const input:FeatureFlagConfigArrayMap | FeatureFlagConfigObjMap = {
            featureFlagOne: [
                "enable: true",
                "value: value1"
            ]
        };
        expect(returnTypeOfConfig(input)).toStrictEqual(ConfigType.ARRAY_MAP);
    });
    test('should return type of config as Obj Map', () => {
        const input:FeatureFlagConfigArrayMap | FeatureFlagConfigObjMap = {
            featureFlagOne: {
                enable: true,
                value: 'value1',
                percentage: 50
            }
        };
        expect(returnTypeOfConfig(input)).toStrictEqual(ConfigType.OBJECT_MAP);
    });
    test('should return null', () => {
        const input: any = ["yoo", "yoo2"];
        expect(returnTypeOfConfig(input)).toStrictEqual(null)
    });
    test('should return null', () => {
        const input: any = "helloo";
        expect(returnTypeOfConfig(input)).toStrictEqual(null);
    });
});