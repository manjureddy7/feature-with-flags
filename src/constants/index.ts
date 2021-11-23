export const ACTIVATION_STRATEGIES = {
    USER_ROLE_ACTIVATION_STRATEGY: 'UserRoleActivationStrategy',
    USER_WITH_ID_ACTIVATION_STRATEGY:'UserWithIDActivationStrategy',
    REGION_ACTIVATION_STRATEGY: 'RegionActivationStrategy',
    DEVICE_TYPE_ACTIVATION_STRATEGY:'DeviceTypeActivationStrategy',
    TENANT_ACTIVATION_STRATEGY: 'TenantActivationStrategy',
    CLIENT_ID_ACTIVATION_STRATEGY: 'ClientIdActivationStrategy',
    RELEASE_DATE_ACTIVATION_STRATEGY: 'ReleaseDateActivationStrategy',
    FLEXIBLE_ROLLOUT_ACTIVATION_STRATEGY: 'FlexibleRolloutActivationStrategy',
    SCHEDULER_ACTIVATION_STRATEGY: 'SchedulerActivationStrategy',
    DATE_TIME_ACTIVATION_STRATEGY: 'DateTimeActivationStrategy', // Format: December 17, 1995 03:24:00,
    DEFAULT: 'default'
};

export const GENERIC_CHECK_MESSAGE = 'please check your feature flag configuration';

export const FEATURE_FLAG_ERROR_MESSAGES = {
    NO_FEATURE_FLAG(featureFlagName: string) {
        return `feature flag name: ${featureFlagName} is not found, ${GENERIC_CHECK_MESSAGE}`;
    },
    VALUE_NOT_FOUND_IN_KEY(key: string, value: string, by: string) {
        return `${by}: ${value} is not found in ${key}`;
    },
    RELEASE_DATE_ERROR(releaseDate: string) {
        return `${releaseDate} is ahead of your current date`;
    },
    PERCENTAGE_ROLLOUT_ERROR(userID: string, percentageRollout: number, by: string, threshold: number) {
        return `The calculated user threshold value(${threshold}) for ${by}: ${userID} is not in the range of percentageRollout(${percentageRollout}) `;
    },
    LOOKUP_KEY_MISSING(featureFlagName:string,activationStrategy: string, by: string) {
        return `Activation strategy: ${activationStrategy} missing lookup ${by} in the context for feature flag: ${featureFlagName}`;
    },
    STRATEGY_NOT_FOUND(featureFlagName:string, activationStrategy: string) {
        return `Unable to find activation strategy: ${activationStrategy} for feature flag: ${featureFlagName}`;
    },
    STRATEGY_KEY_MISSING(featureFlagName:string, activationStrategy: string, strategyKey: string) {
        return `Activation strategy: ${activationStrategy} missing lookup ${strategyKey} in the config for feature flag: ${featureFlagName}`;
    },
    BAD_CONFIG_AND_CONTEXT(featureFlagName:string, activationStrategy: string, strategyKey: string, by: string) {
        return `Activation strategy: ${activationStrategy} requires ${strategyKey} in the config object and ${by} in the context object as lookup for feature flag: ${featureFlagName}`;
    },
    INAVLID_DATE_FORMAT(strategyKey: string) {
        return `Invalid Date. Ensure ${strategyKey} has right format`;
    },
    DATE_EMPTY(strategyKey: string) {
        return `Empty date passed for ${strategyKey}`;
    }
};

export const ACTIVATION_STRATEGY_KEY = {
    [ACTIVATION_STRATEGIES.CLIENT_ID_ACTIVATION_STRATEGY]: 'clientIDs',
    [ACTIVATION_STRATEGIES.DATE_TIME_ACTIVATION_STRATEGY]: 'releaseDateWithTime',
    [ACTIVATION_STRATEGIES.DEVICE_TYPE_ACTIVATION_STRATEGY]: 'deviceTypes',
    [ACTIVATION_STRATEGIES.FLEXIBLE_ROLLOUT_ACTIVATION_STRATEGY]: 'percentageRollout',
    [ACTIVATION_STRATEGIES.REGION_ACTIVATION_STRATEGY]: 'regions',
    [ACTIVATION_STRATEGIES.RELEASE_DATE_ACTIVATION_STRATEGY]: 'releaseDate',
    [ACTIVATION_STRATEGIES.TENANT_ACTIVATION_STRATEGY]: 'tenantIDs',
    [ACTIVATION_STRATEGIES.USER_ROLE_ACTIVATION_STRATEGY]: 'userRoles',
    [ACTIVATION_STRATEGIES.USER_WITH_ID_ACTIVATION_STRATEGY]: 'userIDs',
};

export default ACTIVATION_STRATEGIES;
