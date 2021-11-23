import { ActivationStrategies, GetFeatureFlagParams, FeatureFlagReturnType } from "../types";
import getFeatureFlagValueBasedOnActivationStrategy from './getFeatureFlag'

const getFeatureFlagStatus = ({ featureFlagContext, activationStrategies, featureFlagName, featureFlagDetails }: GetFeatureFlagParams): FeatureFlagReturnType[] => {
    const { 
        userRole= '', 
        userID='', 
        region='', 
        deviceUserAgent = '',
        tenantID = '',
        clientID = '',
        releaseDate = '',
        expression = '',
        releaseDateWithTime = ''
    } = featureFlagContext;
    const activeFlagsStatus =  activationStrategies?.map((strategyType: ActivationStrategies) => {
        return getFeatureFlagValueBasedOnActivationStrategy({
            featureFlagName,
            strategyType,
            featureFlagDetails,
            userRole,
            userID,
            region,
            deviceUserAgent,
            tenantID,
            clientID,
            releaseDate,
            expression,
            releaseDateWithTime
        });
    });
    return activeFlagsStatus;
};

export default getFeatureFlagStatus;