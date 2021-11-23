import { GENERIC_CHECK_MESSAGE } from '../constants';
import FeatureFlag from '../feature-flag';
import { FeatureFlagConfigArrayMap, FeatureFlagConfigObjMap, FeatureFlagContext, FeatureFlagReturnType } from '../types';

describe('FeatureFlag with ArrayMap Shape', () => {
    /**
     * Possible scenarios to test
     * 1. When enable is true & params matches
     * 2. When enable is true & params not matches
     * 3. When enable is false & params matches
     * 4. When enable is false & params not matches
     * 5. When enable is true & featureFlagContext key is mising
     * 6. When enable is true & featureFlagContext key is mistyped
     * 7. When enable is true & feature flag config is missing
     * 8. When enable is true & On valid active stratigies
     * 9. When enable is false & On valid active stratigies
     * 10. When enable is true & when one active stratigy fails
     * 11. When enable is false & when one active stratigy fails
    */

    // Case: 1
    test('When enable is true & params matches', () => {
        const params =  {
            "clients": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2"
            ],
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client2'
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 2
    test('When enable is true & params not matches', () => {
        const params =  {
            "test": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2",
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'abc'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `feature flag name: clients is not found, ${GENERIC_CHECK_MESSAGE}`
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 3
    test('When enable is false & params matches', () => {
        const params =  {
            "test": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2",
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `feature flag name: clients is not found, ${GENERIC_CHECK_MESSAGE}`
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 4
    test('When enable is false & params not matches', () => {
        const params =  {
            "test": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2",
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'abc'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `feature flag name: clients is not found, ${GENERIC_CHECK_MESSAGE}`
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 5
    test('When enable is true & featureFlagContext key is mising', () => {
        const params =  {
            "clients": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2"
            ],
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            // featureFlagContext: {
            //     clientID: 'client2'
            // }
        } as any;
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: ClientIdActivationStrategy missing lookup clientID in the context for feature flag: clients, please check your feature flag configuration"
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 6
    test('When enable is true & featureFlagContext key is mistyped', () => {
        const params =  {
            "clients": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2"
            ],
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientid: 'client2'
            }
        } as any;
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: ClientIdActivationStrategy missing lookup clientID in the context for feature flag: clients, please check your feature flag configuration"
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

     // Case: 7
     test('When enable is true & feature flag config is missing', () => {
        const params =  {
            "clients": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                // "clientIDs: client1, client2"
            ],
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client2'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: ClientIdActivationStrategy missing lookup clientIDs in the config for feature flag: clients, please check your feature flag configuration"
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 8
    test('When enable is true & On valid active stratigies', () => {
        const params =  {
            "multiple": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy, TenantActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client2',
                tenantID: 'tenant1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 9
    test('When enable is false & On valid active stratigies', () => {
        const params =  {
            "multiple": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy, TenantActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client2',
                tenantID: 'tenant1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `Feature flag multiple is diasbled ${GENERIC_CHECK_MESSAGE}`
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 10
    test('When enable is true & when one active stratigy fails', () => {
        const params =  {
            "multiple": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy, TenantActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client12',
                tenantID: 'tenant12'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `clientID: client12 is not found in clientIDs, tenantID: tenant12 is not found in tenantIDs, ${GENERIC_CHECK_MESSAGE}`
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });
    
    // Case: 11
    test('When enable is false & when one active stratigy fails', () => {
        const params =  {
            "multiple": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy, XYZActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client2',
                tenantID: 'tenant1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `Unable to find activation strategy: XYZActivationStrategy for feature flag: multiple, ${GENERIC_CHECK_MESSAGE}`
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });
});

describe('FeatureFlag with ObjMap shape', () => {
    /**
     * Possible scenarios to test
     * 1. When enable is true & params matches
     * 2. When enable is true & params not matches
     * 3. When enable is false & params matches
     * 4. When enable is false & params not matches
     * 5. When enable is true & featureFlagContext key is mising
     * 6. When enable is true & featureFlagContext key is mistyped
     * 7. When enable is true & feature flag config is missing
     * 8. When enable is true & On valid active stratigies
     * 9. When enable is false & On valid active stratigies
     * 10. When enable is true & when one active stratigy fails
     * 11. When enable is false & when one active stratigy fails
     * 12. When user provides out of bound activation strategy
    */

    // Case: 1
    test('When enable is true & params matches', () => {
        const params =  {
            "clients": {
                enable: true,
                activationStrategies: "default",
                clientIDs: ["client1", "client2"]
            },
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client2'
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 2
    test('When enable is true & params not matches', () => {
        const params =  {
            "test": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2",
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'abc'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `feature flag name: clients is not found, ${GENERIC_CHECK_MESSAGE}`
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 3
    test('When enable is false & params matches', () => {
        const params =  {
            "test": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2",
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `feature flag name: clients is not found, ${GENERIC_CHECK_MESSAGE}`
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 4
    test('When enable is false & params not matches', () => {
        const params =  {
            "test": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2",
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'abc'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `feature flag name: clients is not found, ${GENERIC_CHECK_MESSAGE}`
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 5
    test('When enable is true & featureFlagContext key is mising', () => {
        const params =  {
            "clients": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2"
            ],
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            // featureFlagContext: {
            //     clientID: 'client2'
            // }
        } as any;
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: ClientIdActivationStrategy missing lookup clientID in the context for feature flag: clients, please check your feature flag configuration"
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 6
    test('When enable is true & featureFlagContext key is mistyped', () => {
        const params =  {
            "clients": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                "clientIDs: client1, client2"
            ],
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientid: 'client2'
            }
        } as any;
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: ClientIdActivationStrategy missing lookup clientID in the context for feature flag: clients, please check your feature flag configuration"
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 7
    test('When enable is true & feature flag config is missing', () => {
        const params =  {
            "clients": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy",
                // "clientIDs: client1, client2"
            ],
        }
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client2'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: ClientIdActivationStrategy missing lookup clientIDs in the config for feature flag: clients, please check your feature flag configuration"
        }
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 8
    test('When enable is true & On valid active stratigies', () => {
        const params =  {
            "multiple": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy, TenantActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client2',
                tenantID: 'tenant1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 9
    test('When enable is false & On valid active stratigies', () => {
        const params =  {
            "multiple": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy, TenantActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client2',
                tenantID: 'tenant1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `Feature flag multiple is diasbled ${GENERIC_CHECK_MESSAGE}`
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 10
    test('When enable is true & when one active stratigy fails', () => {
        const params =  {
            "multiple": [
                "enable: true",
                "activationStrategies: ClientIdActivationStrategy, TenantActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client12',
                tenantID: 'tenant12'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `clientID: client12 is not found in clientIDs, tenantID: tenant12 is not found in tenantIDs, ${GENERIC_CHECK_MESSAGE}`
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });
    
    // Case: 11
    test('When enable is false & when one active stratigy fails', () => {
        const params =  {
            "multiple": [
                "enable: false",
                "activationStrategies: ClientIdActivationStrategy, XYZActivationStrategy",
                "clientIDs: client1, client2",
                "tenantIDs: tenant1, tenant2"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                clientID: 'client2',
                tenantID: 'tenant1'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: `Unable to find activation strategy: XYZActivationStrategy for feature flag: multiple, ${GENERIC_CHECK_MESSAGE}`
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    // Case: 12
    test('When user provides out of bound activation strategy', () => {
        const params =  {
            "clients": {
                enable: true,
                activationStrategies: "deafult",
                clientIDs: ["client1", "client2"]
            },
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client2'
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Unable to find activation strategy: deafult for feature flag: clients, please check your feature flag configuration"
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('When user dont pass any activation strategy', () => {
        const params =  {
            "clients": {
                enable: true,
                clientIDs: ["client1", "client2"]
            },
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients',
            featureFlagContext: {
                clientID: 'client2'
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('When user pass empty activation strategies', () => {
        const params =  {
            "clients": {
                enable: true,
                activationStrategies: []
            },
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'clients'
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
    });
    // ----------- MULTIPLE ACTIVATION STRATIGIES ----------
    test('Multiple Activation Stratigies all is well', () => {
        const params: FeatureFlagConfigObjMap =  {
            "multiple": {
                enable: true,
                activationStrategies: [
                    "UserRoleActivationStrategy",
                    "UserWithIDActivationStrategy"
                ],
                userRoles: ["admin"],
                userIDs: "u1"
            },
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                userID: "u1",
                userRole: "admin"
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('Multiple Activation Stratigies all is well with single values', () => {
        const params: FeatureFlagConfigObjMap =  {
            "multiple": {
                enable: true,
                activationStrategies: [
                    "UserRoleActivationStrategy",
                    "UserWithIDActivationStrategy"
                ],
                userRoles: "admin",
                userIDs: "u1"
            },
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                userID: "u1",
                userRole: "admin"
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('Multiple Activation Stratigies all is well with ArrayMap shape', () => {
        const params: FeatureFlagConfigArrayMap =  {
            "multiple": [
                "enable: true",
                "activationStrategies: UserRoleActivationStrategy, UserWithIDActivationStrategy",
                "userRoles: admin",
                "userIDs: u1"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                userID: "u1",
                userRole: "admin"
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('Multiple Activation Stratigies all is well with ArrayMap shape with error', () => {
        const params: FeatureFlagConfigArrayMap =  {
            "multiple": [
                "enable: true",
                "activationStrategies: UserRoleActivationStrategy, UserWithIDActivationStrategy",
                "userIDs: u1"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                userID: "u1",
                userRole: "admin"
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: UserRoleActivationStrategy missing lookup userRoles in the config for feature flag: multiple, please check your feature flag configuration"
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('Multiple Activation Stratigies when config and context are missing', () => {
        const params =  {
            "multiple": {
                enable: true,
                activationStrategies: [
                    "UserRoleActivationStrategy",
                    "UserWithIDActivationStrategy"
                ]
            },
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple'
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: UserRoleActivationStrategy requires userRoles in the config object and userRole in the context object as lookup for feature flag: multiple, Activation strategy: UserWithIDActivationStrategy requires userIDs in the config object and userID in the context object as lookup for feature flag: multiple, please check your feature flag configuration"
        };
        expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
    });

    //------ 3+ stratigies ---------
    test('Multiple Activation Stratigies all is well with ArrayMap shape missing config', () => {
        const params: FeatureFlagConfigArrayMap =  {
            "multiple": [
                "enable: true",
                "activationStrategies: ReleaseDateActivationStrategy, FlexibleRolloutActivationStrategy, DateTimeActivationStrategy",
                "releaseDate: November 21, 2020"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                userID: "u1",
                userRole: "admin"
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: FlexibleRolloutActivationStrategy missing lookup percentageRollout in the config for feature flag: multiple, Activation strategy: DateTimeActivationStrategy missing lookup releaseDateWithTime in the config for feature flag: multiple, please check your feature flag configuration"
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });
    test('Multiple Activation Stratigies all is well with ArrayMap shape missing context', () => {
        const params: FeatureFlagConfigArrayMap =  {
            "multiple": [
                "enable: true",
                "activationStrategies: ReleaseDateActivationStrategy, FlexibleRolloutActivationStrategy, DateTimeActivationStrategy",
                "releaseDate: November 21, 2020",
                "percentageRollout: 20",
                "releaseDateWithTime: 11/11/2021/16:50:10"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                userRole: "admin"
            }
        };
        const output: FeatureFlagReturnType = {
            status: false,
            message: "Activation strategy: FlexibleRolloutActivationStrategy missing lookup userID in the context for feature flag: multiple, please check your feature flag configuration"
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('Multiple Activation Stratigies along with deafult', () => {
        const params: FeatureFlagConfigArrayMap =  {
            "multiple": [
                "enable: true",
                "activationStrategies: ReleaseDateActivationStrategy, FlexibleRolloutActivationStrategy, DateTimeActivationStrategy, default",
                "releaseDate: November 21, 2020",
                "percentageRollout: 90",
                "releaseDateWithTime: 11/11/2021/16:50:10"
            ],
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple',
            featureFlagContext: {
                userRole: "admin",
                userID: "manoj"
            }
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName, flagParams.featureFlagContext)).toEqual(output);
    });

    test('Test releaseDateWithTime with Obj Map', () => {
        const params: FeatureFlagConfigObjMap =  {
            multiple: {
                enable: true,
                activationStrategies: ["DateTimeActivationStrategy"],
                releaseDateWithTime: "11/11/2021/16:50:10"
            }
        };
        const featureFlag = new FeatureFlag(params);
        const flagParams = {
            featureFlagName: 'multiple'
        };
        const output: FeatureFlagReturnType = {
            status: true,
            message: null
        };
        expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
    });
});


test('Test releaseDateWithTime with Obj Map future date', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy"],
            releaseDateWithTime: "25/11/2021/16:50:10"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Invalid Date. Ensure releaseDateWithTime has right format, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Obj Map future date', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy"],
            releaseDateWithTime: "11/26/2021/16:50:10"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "11/26/2021/16:50:10 is ahead of your current date, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Obj Map future date', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy"],
            releaseDateWithTime: "11/26/2021/16:50:10"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "11/26/2021/16:50:10 is ahead of your current date, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Obj Map empty date', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy"],
            releaseDateWithTime: ""
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Empty date passed for releaseDateWithTime, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Obj Map invalid date', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy"],
            releaseDateWithTime: "26/26/2021/16:50:10"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Invalid Date. Ensure releaseDateWithTime has right format, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Obj Map valid date', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy"],
            releaseDateWithTime: "10/26/2021/16:50:10"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: true,
        message: null
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Obj Map key missing', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy"],
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Activation strategy: DateTimeActivationStrategy missing lookup releaseDateWithTime in the config for feature flag: multiple, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});
test('Test releaseDateWithTime with Array Map empty date', () => {
    const params: FeatureFlagConfigArrayMap =  {
        multiple: [
            "enable: true",
            "activationStrategies: DateTimeActivationStrategy",
            "releaseDateWithTime: "
        ]
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Empty date passed for releaseDateWithTime, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Array Map invalid date', () => {
    const params: FeatureFlagConfigArrayMap =  {
        multiple: [
            "enable: true",
            "activationStrategies: DateTimeActivationStrategy",
            "releaseDateWithTime: 26/26/2021/16:50:10"
        ]
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Invalid Date. Ensure releaseDateWithTime has right format, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Test releaseDateWithTime with Array Map valid date', () => {
    const params: FeatureFlagConfigArrayMap =  {
        multiple: [
            "enable: true",
            "activationStrategies: DateTimeActivationStrategy",
            "releaseDateWithTime: 10/26/2021/16:50:10"
        ]
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: true,
        message: null
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

// MULTIPLE VALID
test('Multiple date stratigies with Array Map', () => {
    const params: FeatureFlagConfigArrayMap =  {
        multiple: [
            "enable: true",
            "activationStrategies: DateTimeActivationStrategy, ReleaseDateActivationStrategy",
            "releaseDateWithTime: 10/26/2021/16:50:10",
            "releaseDate: 10/26/2021"
        ]
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: true,
        message: null
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Multiple date stratigies with Obj Map', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy", "ReleaseDateActivationStrategy"],
            releaseDateWithTime: "10/26/2021/16:50:10",
            releaseDate: "10/26/2021"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: true,
        message: null
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

// MULTIPLE FUTURE DATE

test('Multiple date stratigies with Array Map ', () => {
    const params: FeatureFlagConfigArrayMap =  {
        multiple: [
            "enable: true",
            "activationStrategies: DateTimeActivationStrategy, ReleaseDateActivationStrategy",
            "releaseDateWithTime: 12/26/2021/16:50:10",
            "releaseDate: 12/26/2021"
        ]
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "12/26/2021/16:50:10 is ahead of your current date, 12/26/2021 is ahead of your current date, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Multiple date stratigies with Obj Map', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy", "ReleaseDateActivationStrategy"],
            releaseDateWithTime: "12/26/2021/16:50:10",
            releaseDate: "12/26/2021"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "12/26/2021/16:50:10 is ahead of your current date, 12/26/2021 is ahead of your current date, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

// MULTIPLE INAVLID DATE

test('Multiple date stratigies with Array Map ', () => {
    const params: FeatureFlagConfigArrayMap =  {
        multiple: [
            "enable: true",
            "activationStrategies: DateTimeActivationStrategy, ReleaseDateActivationStrategy",
            "releaseDateWithTime: 26/26/2021/16:50:10",
            "releaseDate: 26/26/2021"
        ]
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Invalid Date. Ensure releaseDateWithTime has right format, Invalid Date. Ensure releaseDate has right format, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Multiple date stratigies with Obj Map', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy", "ReleaseDateActivationStrategy"],
            releaseDateWithTime: "26/26/2021/16:50:10",
            releaseDate: "26/26/2021"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Invalid Date. Ensure releaseDateWithTime has right format, Invalid Date. Ensure releaseDate has right format, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

// MULTIPLE ONE VALID ONE INVALID

test('Multiple date stratigies with Array Map ', () => {
    const params: FeatureFlagConfigArrayMap =  {
        multiple: [
            "enable: true",
            "activationStrategies: DateTimeActivationStrategy, ReleaseDateActivationStrategy",
            "releaseDateWithTime: 26/26/2021/16:50:10",
            "releaseDate: 10/26/2021"
        ]
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Invalid Date. Ensure releaseDateWithTime has right format, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});

test('Multiple date stratigies with Obj Map', () => {
    const params: FeatureFlagConfigObjMap =  {
        multiple: {
            enable: true,
            activationStrategies: ["DateTimeActivationStrategy", "ReleaseDateActivationStrategy"],
            releaseDateWithTime: "26/26/2021/16:50:10",
            releaseDate: "10/26/2021"
        }
    };
    const featureFlag = new FeatureFlag(params);
    const flagParams = {
        featureFlagName: 'multiple'
    };
    const output: FeatureFlagReturnType = {
        status: false,
        message: "Invalid Date. Ensure releaseDateWithTime has right format, please check your feature flag configuration"
    };
    expect(featureFlag.isActive(flagParams.featureFlagName)).toEqual(output);
});