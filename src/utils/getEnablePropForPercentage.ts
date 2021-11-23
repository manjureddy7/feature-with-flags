import { FEATURE_FLAG_ERROR_MESSAGES } from "../constants";
import { FeatureFlagReturnType, PercentageRolloutFeatureParams } from "../types";
import getUserThreshold from "./getUserThreshold";

/**
 * With given percentage rollout & unique user threshold value this method checks if the user falls in the percentage bucket
 * @param featureParams 
 * @returns 
 */
const getFeatureFlagEnablePropForPercentageRollout = (featureParams: PercentageRolloutFeatureParams): FeatureFlagReturnType => {
    const { userID, featureFlagName, featureFlagDetails, key, strategyKey, activationStrategy } = featureParams;
    const userThresholdValue = getUserThreshold(userID, featureFlagName);
    let percentageRollout = 0;
    
    if(featureFlagDetails?.percentageRollout) {
        percentageRollout = +featureFlagDetails.percentageRollout
    };

    if(!featureFlagDetails[key] && !userID) return ({
        status: false,
        message: FEATURE_FLAG_ERROR_MESSAGES.BAD_CONFIG_AND_CONTEXT(featureFlagName, activationStrategy, strategyKey, 'userID')
    });

    if(!userID) return ({
        status: false,
        message: FEATURE_FLAG_ERROR_MESSAGES.LOOKUP_KEY_MISSING(featureFlagName, activationStrategy, 'userID')
    });

    if(!featureFlagDetails[key]) return ({
        status: false,
        message: FEATURE_FLAG_ERROR_MESSAGES.STRATEGY_KEY_MISSING(featureFlagName, activationStrategy, strategyKey)
    });

    if(userThresholdValue < +percentageRollout) {
        return({
            status: featureFlagDetails.enable || false,
            message: null
        });
    }
    return ({
        status: false,
        message: FEATURE_FLAG_ERROR_MESSAGES.PERCENTAGE_ROLLOUT_ERROR(userID, percentageRollout, 'userID', userThresholdValue)
    });
};

export default getFeatureFlagEnablePropForPercentageRollout;