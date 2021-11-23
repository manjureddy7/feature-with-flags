import ACTIVATION_STRATEGIES, { ACTIVATION_STRATEGY_KEY, FEATURE_FLAG_ERROR_MESSAGES } from "../constants";
import { 
    FeatureFlagStrategyParams, 
    FeatureFlagKey,
    FeatureFlagReturnType,
    FeatureFlagResponseType, 
} from "../types";
import getDeviceType from "./getDeviceType";
import getFeatureFlagEnableProp from "./getEnableProp";
import getFeatureFlagEnablePropForPercentageRollout from "./getEnablePropForPercentage";
import getFeatureFlagEnablePropForReleaseTimeDate from "./getEnablePropForReleaseWithTime";
import getFeatureFlagForScheduler from "./getEnablePropForScheduler";
import getFeatureFlagEnablePropForReleaseDate from "./getEnablePropFromReleaseDate";
import updateStatusAndMessage from "./updateStatusAndMessage";

/**
 * This method returns the feature flag final value based on 
 * @param featureFlagParams 
 * @returns boolean
 */
const getFeatureFlagValueBasedOnActivationStrategy = (featureFlagParams: FeatureFlagStrategyParams): FeatureFlagReturnType => {
    const { 
        featureFlagName = '',
        strategyType = '', 
        featureFlagDetails, 
        userRole = '', 
        userID = '', 
        region = '', 
        deviceUserAgent = '',
        tenantID = '',
        clientID = '',
        expression = '',
    } = featureFlagParams;
    let featureFlag: FeatureFlagResponseType = {
        isFlagActive: false,
        message: null 
    }
    switch (strategyType) {
        case ACTIVATION_STRATEGIES.USER_ROLE_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnableProp({
                    featureFlagDetails,
                    key: FeatureFlagKey.Roles,
                    value: userRole,
                    by: 'userRole',
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.USER_ROLE_ACTIVATION_STRATEGY
                }),
                featureFlag
            )
            break;
        case ACTIVATION_STRATEGIES.USER_WITH_ID_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnableProp({
                    featureFlagDetails,
                    key: FeatureFlagKey.UserIDs,
                    value: userID,
                    by: 'userID',
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.USER_WITH_ID_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.REGION_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnableProp({
                    featureFlagDetails,
                    key: FeatureFlagKey.Regions,
                    value: region,
                    by: 'region',
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.REGION_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.DEVICE_TYPE_ACTIVATION_STRATEGY:
            const deviceType = getDeviceType(deviceUserAgent);
            updateStatusAndMessage(
                getFeatureFlagEnableProp({
                    featureFlagDetails,
                    key: FeatureFlagKey.DeviceTypes,
                    value: deviceType,
                    by: 'deviceType',
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.DEVICE_TYPE_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.TENANT_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnableProp({
                    featureFlagDetails,
                    key: FeatureFlagKey.TenantIDs,
                    value: tenantID,
                    by: 'tenantID',
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.TENANT_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.CLIENT_ID_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnableProp({
                    featureFlagDetails,
                    key: FeatureFlagKey.ClientIDs,
                    value: clientID,
                    by: 'clientID',
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.CLIENT_ID_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.RELEASE_DATE_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnablePropForReleaseDate({
                    featureFlagDetails,
                    key: FeatureFlagKey.ReleaseDate,
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.RELEASE_DATE_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.DATE_TIME_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnablePropForReleaseTimeDate({
                    featureFlagDetails,
                    key: FeatureFlagKey.ReleaseDateWithTime,
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.DATE_TIME_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.FLEXIBLE_ROLLOUT_ACTIVATION_STRATEGY:
            updateStatusAndMessage(
                getFeatureFlagEnablePropForPercentageRollout({
                    featureFlagDetails,
                    key: FeatureFlagKey.PercentageRollout,
                    userID,
                    featureFlagName,
                    strategyKey: ACTIVATION_STRATEGY_KEY[strategyType],
                    activationStrategy: ACTIVATION_STRATEGIES.FLEXIBLE_ROLLOUT_ACTIVATION_STRATEGY
                }),
                featureFlag
            );
            break;
        case ACTIVATION_STRATEGIES.DEFAULT:
            featureFlag.isFlagActive = featureFlagDetails.enable;
            featureFlag.message = null;
            break;
        default:
            featureFlag.isFlagActive = false;
            featureFlag.message = FEATURE_FLAG_ERROR_MESSAGES.STRATEGY_NOT_FOUND(featureFlagName, strategyType);
            break;
        // TODO: tune this strategy
        // case ACTIVATION_STRATEGIES.SCHEDULER_ACTIVATION_STRATEGY:
        //     isFlagActive = getFeatureFlagForScheduler({
        //         featureFlagDetails,
        //         key: FeatureFlagKey.ScheduleExpression,
        //         value: expression
        //     });
        //     updateStatusAndMessage(
        //         ,
        //         isFlagActive,
        //         message
        //     );
        //     break;
    }
    return ({ status: featureFlag.isFlagActive, message: featureFlag.message });
}

export default getFeatureFlagValueBasedOnActivationStrategy;