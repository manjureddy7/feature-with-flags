import { FEATURE_FLAG_ERROR_MESSAGES } from "../constants";
import { ActivationStrategyFeatureParams, FeatureFlagReturnType } from "../types";

/**
 * This method returns the enable key from the feature flag
 * @param featureParams 
 * @returns boolean
 */
const getFeatureFlagEnableProp = (featureParams: ActivationStrategyFeatureParams): FeatureFlagReturnType => {

    const { featureFlagDetails, key, value, by, featureFlagName, strategyKey, activationStrategy } = featureParams;

    if(!value && !(strategyKey in featureFlagDetails)) return ({ status: false, message: FEATURE_FLAG_ERROR_MESSAGES.BAD_CONFIG_AND_CONTEXT(featureFlagName, activationStrategy, strategyKey, by)});

    if(!value) return ({ status: false, message: FEATURE_FLAG_ERROR_MESSAGES.LOOKUP_KEY_MISSING(featureFlagName, activationStrategy, by)});

    if(!(strategyKey in featureFlagDetails)) return ({ status: false, message: FEATURE_FLAG_ERROR_MESSAGES.STRATEGY_KEY_MISSING(featureFlagName, activationStrategy, strategyKey)});

    if(featureFlagDetails[key]?.includes(value)) {
        return ({ status: featureFlagDetails.enable || false, message: null })
    }
    
    return ({ status: false, message: FEATURE_FLAG_ERROR_MESSAGES.VALUE_NOT_FOUND_IN_KEY(key, value, by)});
};

export default getFeatureFlagEnableProp;
