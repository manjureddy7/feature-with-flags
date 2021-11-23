import { ConfigType, FeatureFlagConfigArrayMap, FeatureFlagConfigObjMap } from "../types";
import getConfigInArrayMap from "./getConfigInArrayMap";
import getConfigInObjMap from "./getConfigInObjMap";
import returnTypeOfConfig from "./returnTypeOfConfig";


const mapFeatureFlags = (featureFlagConfig: FeatureFlagConfigArrayMap | FeatureFlagConfigObjMap) => {
    const CONFIG_TYPE = returnTypeOfConfig(featureFlagConfig);
    let featureFlagConfiguration = {};
    switch (CONFIG_TYPE) {
        case ConfigType.ARRAY_MAP:
            featureFlagConfiguration = getConfigInArrayMap(featureFlagConfig as FeatureFlagConfigArrayMap)
            break;
        case ConfigType.OBJECT_MAP:
            featureFlagConfiguration = getConfigInObjMap(featureFlagConfig as FeatureFlagConfigObjMap)
            break;
        default:
            break;
    };
    return featureFlagConfiguration;
}

export default mapFeatureFlags;