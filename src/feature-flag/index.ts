import { FEATURE_FLAG_ERROR_MESSAGES, GENERIC_CHECK_MESSAGE } from '../constants';
import { 
    FeatureFlagConfigArrayMap,
    FeatureFlagConfigObjMap,
    FeatureFlagDetails, 
    TFeatureFlag,
    FeatureFlagContext,
    FeatureFlagReturnType,
} from '../types';
import getFeatureFlagStatus from '../utils';
import mapFeatureFlags from '../utils/mapFeatureFlags';

class FeatureFlag {

    private featureFlags: TFeatureFlag;

    constructor(featureFlagConfig: FeatureFlagConfigArrayMap | FeatureFlagConfigObjMap) {
        this.featureFlags = mapFeatureFlags(featureFlagConfig);
    }

    /**
     * This method takes in an feature flag inputs & return if the flag is active/not
     * @param {*} featureFlagParams
     */
    isActive = (featureFlagName: string, featureFlagContext: FeatureFlagContext = {}): FeatureFlagReturnType => {

        if(!this.featureFlags[featureFlagName]) return ({status: false, message: FEATURE_FLAG_ERROR_MESSAGES.NO_FEATURE_FLAG(featureFlagName)});

        const featureFlagDetails: FeatureFlagDetails = this.featureFlags[featureFlagName];
        let { activationStrategies = ['default'] } = featureFlagDetails;

        if(activationStrategies?.length! <= 0) return ({status: featureFlagDetails.enable, message: null});

        if(typeof activationStrategies === 'string') {
            activationStrategies = [activationStrategies]
        }

        const activeFlags = getFeatureFlagStatus({ featureFlagContext, activationStrategies, featureFlagName, featureFlagDetails });
        const isFeatureActive =  activeFlags.every(({ status }) => status === true);
        const message = activeFlags
            .filter(({ message }) => message !== null)
            .reduce((prevMessage: string, { message }) => {
                return `${prevMessage} ${message},`
             }, '') || `Feature flag ${featureFlagName} is diasbled`;
        return isFeatureActive ? ({
            status: isFeatureActive,
            message: null
        }) : ({
            status: false,
            message: message.length > 0 ? `${message} ${GENERIC_CHECK_MESSAGE}`.trim() : null
        });
        
        // TODO: SchedulerActivationStrategy needs to be groomed well
        // if(featureFlagName === 'scheduler') return activeFlags;
    }
};

export default FeatureFlag;
