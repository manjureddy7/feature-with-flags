import ACTIVATION_STRATEGIES from "../constants";

export type FeatureFlagConfigArrayMap = Record<string, string[]>;

export type FeatureFlagConfigObjMap = Record<string, Record<string, string | string[] | boolean | number>>;

export type FeatureFlagDetails = {
    activationStrategies?: ActivationStrategies[];
    enable: boolean;
    userRoles?: string[];
    userIDs?: string[];
    regions?: string[];
    deviceTypes?: string[];
    tenantIDs?: string[];
    clientIDs?: string[];
    releaseDate?: string;
    releaseDateWithTime?: string[] | string;
    percentageRollout?: string;
    userName?: string;
    expression?: string;
};

export type TFeatureFlag = Record<string, FeatureFlagDetails | any>;

export type ActivationStrategies = 
    | 'UserRoleActivationStrategy'
    | 'SchedulerActivationStrategy'
    | 'DateTimeActivationStrategy'
    | 'QueryParamActivationStrategy'
    | 'ReleaseDateActivationStrategy'
    | 'RegionActivationStrategy'
    | 'ClientIdActivationStrategy'
    | 'DeviceTypeActivationStrategy'
    | 'TenantActivationStrategy'
    | 'UserWithIDActivationStrategy'
    | 'FlexibleRolloutActivationStrategy'
    | 'default';

export type FeatureFlagType = 'OPERATIONAL_FLAG' | 'RELEASE_FLAG';

export type CommonFeatureFlagParams = {
    userRole: string;
    userID: string;
    region: string;
    deviceUserAgent: string;
    tenantID: string;
    clientID: string;
    releaseDate: string;
    expression: string;
    releaseDateWithTime: string;
};

export type FeatureFlagContext = Partial<CommonFeatureFlagParams>;

export type FeatureFlagStrategyParams = {
    strategyType: ActivationStrategies;
    featureFlagDetails: FeatureFlagDetails;
    featureFlagName: string;
} & Partial<CommonFeatureFlagParams>;

export type PercentageRolloutFeatureParams = {
    featureFlagDetails: FeatureFlagDetails;
    key: FeatureFlagKey.PercentageRollout;
    userID: string;
    featureFlagName: string;
    strategyKey: string;
    activationStrategy: string;
};

export type ActivationStrategyFeatureParams = {
    featureFlagDetails: FeatureFlagDetails;
    key: keyof Omit<FeatureFlagDetails, "activationStrategies" | "enable">;
    value: string;
    by: string;
    featureFlagName: string;
    strategyKey: string;
    activationStrategy: string;
};

export type ReleaseActivationStrategyFeatureParams = {
    featureFlagDetails: FeatureFlagDetails;
    key: "releaseDate";
    featureFlagName: string;
    strategyKey: string;
    activationStrategy: string;
};

export type ReleaseTimeActivationStrategyFeatureParams = {
    featureFlagDetails: FeatureFlagDetails;
    key: "releaseDateWithTime";
    featureFlagName: string;
    strategyKey: string;
    activationStrategy: string;
};

export enum FeatureFlagKey {
    Roles = 'userRoles',
    UserIDs = 'userIDs',
    Regions = 'regions',
    DeviceTypes = 'deviceTypes',
    TenantIDs = 'tenantIDs',
    ClientIDs = 'clientIDs',
    ReleaseDate = 'releaseDate',
    PercentageRollout = 'percentageRollout',
    ScheduleExpression = 'expression',
    ReleaseDateWithTime = 'releaseDateWithTime'
};

export enum EnableProp {
    TRUTHY = 'true',
    FALSY = 'false'
};

export enum ConfigType {
    ARRAY_MAP = 'ARRAY_MAP',
    OBJECT_MAP= 'OBJECT_MAP'
}

export type IsActive = (featurefFlagName: string, featureFlagContext?: FeatureFlagContext) => boolean;

export type GetFeatureFlagParams = {
    featureFlagContext: FeatureFlagContext;
    activationStrategies: ActivationStrategies[];
    featureFlagName: string;
    featureFlagDetails: FeatureFlagDetails;
};

export type FeatureFlagReturnType = {
    status: boolean;
    message: null | string;
};

export type FeatureFlagResponseType = {
    isFlagActive: boolean;
    message: null | string;
};