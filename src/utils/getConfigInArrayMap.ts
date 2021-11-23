import { FeatureFlagConfigArrayMap } from "../types";
import trimAndRemoveSpacesFromConfig from "./trimSpaces";

/**
    * This Method will tune the passed in dirty config and return a neat Config Object 
    * @param {*} featureFlagConfig 
 */
const getConfigInArrayMap = (featureFlagConfig: FeatureFlagConfigArrayMap) => {
    let flags = {};
    for(const featureFlagName in featureFlagConfig) {
        const featureFlag = featureFlagConfig[featureFlagName] || [];
        const featureFlagDetails = featureFlag.reduce((configs, config)=> {
          let [configName, ...restConfigValues] = config.split(":");
          const configValues = trimAndRemoveSpacesFromConfig(restConfigValues);
          return ({...configs, [configName]: configValues})
        }, {});
        flags = {
            ...flags,
            [featureFlagName] : featureFlagDetails
        }
    }
    return flags;
};

export default getConfigInArrayMap;