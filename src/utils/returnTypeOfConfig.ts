import { ConfigType, FeatureFlagConfigArrayMap, FeatureFlagConfigObjMap } from "../types";

/**
 * This method takes feature flag configuration as input and return the type of passed in config
 * @param configuration 
 * @returns 
 */
const returnTypeOfConfig = (configuration: FeatureFlagConfigArrayMap | FeatureFlagConfigObjMap) => {
    const isConfigAnArray = Object.values(configuration)
        .map(config => Array.isArray(config))
        .every(val => val === true);
    const isConfigObjMap = Object.values(configuration)
        .map(config => typeof config === 'object' && config !== null)
        .every(val => val === true);
    if(isConfigAnArray) return ConfigType.ARRAY_MAP;
    if(isConfigObjMap) return ConfigType.OBJECT_MAP;
    return null;
};

export default returnTypeOfConfig;