import { FeatureFlagConfigObjMap } from "../types";

/**
 * This method returns passed in config in the shape of objMap
 * @param featureFlagConfig 
 * @returns 
*/
const getConfigInObjMap = (featureFlagConfig: FeatureFlagConfigObjMap) =>  {
    return({
        ...featureFlagConfig
    })
};

export default getConfigInObjMap;