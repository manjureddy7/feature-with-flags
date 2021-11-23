import { FEATURE_FLAG_ERROR_MESSAGES } from "../constants";
import { FeatureFlagReturnType, ReleaseTimeActivationStrategyFeatureParams } from "../types";

/**
 * This method helps to compare current date time & release date time
 * @param featureParams 
 * @returns 
 */
const getFeatureFlagEnablePropForReleaseTimeDate = (featureParams: ReleaseTimeActivationStrategyFeatureParams): FeatureFlagReturnType => {

    const { featureFlagDetails, key, featureFlagName, activationStrategy, strategyKey } = featureParams;
    let flagReleaseDate = '';

    // Check if releaseDateWithTime key is present
    if(!(key in featureFlagDetails)) return ({ status: false, message: FEATURE_FLAG_ERROR_MESSAGES.STRATEGY_KEY_MISSING(featureFlagName, activationStrategy, strategyKey)});

    if(Array.isArray(featureFlagDetails[key])) {
        const data = <string[]>featureFlagDetails[key];
        // Check if releaseDateWithTime key is empty
        if(!data.join("")) return({
            status: false,
            message: FEATURE_FLAG_ERROR_MESSAGES.DATE_EMPTY(strategyKey)
        });
        flagReleaseDate = data?.join(":")!;
    } else {
        flagReleaseDate = <string>featureFlagDetails[key];
        // Check if releaseDateWithTime key is empty
        if(!flagReleaseDate) return({
            status: false,
            message: FEATURE_FLAG_ERROR_MESSAGES.DATE_EMPTY(strategyKey)
        });
    }

    const currentDateTime = new Date().getTime();
    const releaseDateTime = new Date(flagReleaseDate).getTime();

    // Check if releaseDateWithTime key is not valid
    if(isNaN(releaseDateTime)) return({
        status: false,
        message: FEATURE_FLAG_ERROR_MESSAGES.INAVLID_DATE_FORMAT(strategyKey)
    });
    
    if(currentDateTime >= releaseDateTime) return ({
        status: featureFlagDetails.enable || false,
        message: null
    });

    return ({
        status: false,
        message: FEATURE_FLAG_ERROR_MESSAGES.RELEASE_DATE_ERROR(flagReleaseDate)
    });
};

export default getFeatureFlagEnablePropForReleaseTimeDate;