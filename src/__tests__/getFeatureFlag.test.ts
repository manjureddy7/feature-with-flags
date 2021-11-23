import { FeatureFlagReturnType, FeatureFlagStrategyParams } from '../types';
import getFeatureFlagValueBasedOnActivationStrategy from '../utils/getFeatureFlag';

 /**
    * Possible scenarios to test
    * 1. When enable is true & condition matches
    * 2. When enable is false & condition matches
    * 3. When enable is true & condition not matches
    * 4. When enable is false & condition not matches
    * 5. Test UserRoleActivationStrategy
    * 6. When enable is true & user pass releaseDateWithTime as string
    * 7. Test UserRoleActivationStrategy - When user passes proper config and context
    * 8. Test UserRoleActivationStrategy - When user passes proper config and context, but context mismatches
    * 9. Test UserWithIDActivationStrategy
 */

describe('getFeatureFlagValueBasedOnActivationStrategy', () => {

    // Case: 1
    test('When enable is true & condition matches', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'TenantActivationStrategy',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['abc'],
            },
            tenantID: 'abc',
            featureFlagName: 'tenants',
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true};
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    // Case: 2
    test('When enable is false & condition matches', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'TenantActivationStrategy',
            featureFlagDetails: {
                enable: false,
                tenantIDs: ['abc'],
            },
            tenantID: 'abc',
            featureFlagName: 'tenants',
        };
        const output: FeatureFlagReturnType = {"message": null, "status": false};
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });
    
    // Case: 3
    test('When enable is true & condition not matches', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'TenantActivationStrategy',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['abc'],
            },
            tenantID: 'xyz',
            featureFlagName: 'tenants',
        };
        const output: FeatureFlagReturnType = {"message": "tenantID: xyz is not found in tenantIDs", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    // Case: 4
    test('When enable is false & condition not matches', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'TenantActivationStrategy',
            featureFlagDetails: {
                enable: false,
                tenantIDs: ['abc'],
            },
            tenantID: 'xyz',
            featureFlagName: 'tenants',
        };
        const output: FeatureFlagReturnType = {"message": "tenantID: xyz is not found in tenantIDs", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    // Case: 5
    test('Test UserRoleActivationStrategy - When user passes differnt lookup key & config', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserRoleActivationStrategy',
            featureFlagDetails: {
                enable: false,
                tenantIDs: ['abc'],
            },
            userID: 'xyz',
            featureFlagName: 'withUserRole',
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: UserRoleActivationStrategy requires userRoles in the config object and userRole in the context object as lookup for feature flag: withUserRole", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

     // Case: 6
     test('Test UserRoleActivationStrategy - When user passes differnt config', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserRoleActivationStrategy',
            featureFlagDetails: {
                enable: false,
                tenantIDs: ['abc'],
            },
            userRole: 'xyz',
            featureFlagName: 'withUserRole',
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: UserRoleActivationStrategy missing lookup userRoles in the config for feature flag: withUserRole", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

     // Case: 7
     test('Test UserRoleActivationStrategy - When user passes proper config and context', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserRoleActivationStrategy',
            featureFlagDetails: {
                enable: true,
                userRoles: ['abc'],
            },
            userRole: 'abc',
            featureFlagName: 'withUserRole',
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });
     // Case: 8
     test('Test UserRoleActivationStrategy - When user passes proper config and context, but context mismatches', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserRoleActivationStrategy',
            featureFlagDetails: {
                enable: true,
                userRoles: ['abc'],
            },
            userRole: 'xyz',
            featureFlagName: 'withUserRole',
        };
        const output: FeatureFlagReturnType = {"message": "userRole: xyz is not found in userRoles", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    // Case: 8
    test('Test UserWithIDActivationStrategy - When user passes proper config and context', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserWithIDActivationStrategy',
            featureFlagDetails: {
                enable: true,
                userIDs: ['m0k05u9'],
            },
            userID: 'm0k05u9',
            featureFlagName: 'withUserID',
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    // Case: 9
    test('Test UserWithIDActivationStrategy - When user passes proper config and context, but context mismatches', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserWithIDActivationStrategy',
            featureFlagDetails: {
                enable: true,
                userIDs: ['m0k05u9'],
            },
            userID: 'M0K05U9',
            featureFlagName: 'withUserID',
        };
        const output: FeatureFlagReturnType = {"message": "userID: M0K05U9 is not found in userIDs", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

     // Case: 10
     test('Test UserWithIDActivationStrategy - When user passes proper config and bad context', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserWithIDActivationStrategy',
            featureFlagDetails: {
                enable: true,
                userIDs: ['m0k05u9'],
            },
            userRole: 'M0K05U9',
            featureFlagName: 'withUserID',
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: UserWithIDActivationStrategy missing lookup userID in the context for feature flag: withUserID", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

      // Case: 11
      test('Test UserWithIDActivationStrategy - When user passes bad config and context', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'UserWithIDActivationStrategy',
            featureFlagDetails: {
                enable: true,
                userRoles: ['m0k05u9'],
            },
            userRole: 'M0K05U9',
            featureFlagName: 'withUserID',
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: UserWithIDActivationStrategy requires userIDs in the config object and userID in the context object as lookup for feature flag: withUserID", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    // Case: 12
    test('Test DateTimeActivationStrategy on future dates', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'DateTimeActivationStrategy',
            featureFlagDetails: {
                enable: true,
                releaseDateWithTime: "11/28/2031/16:50:10",
            },
            featureFlagName: 'withDateTime',
        };
        const output: FeatureFlagReturnType = {"message": "11/28/2031/16:50:10 is ahead of your current date", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test DateTimeActivationStrategy on previous dates', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'DateTimeActivationStrategy',
            featureFlagDetails: {
                enable: true,
                releaseDateWithTime: "11/28/2011/16:50:10",
            },
            featureFlagName: 'withDateTime',
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test DateTimeActivationStrategy on previous dates and enable false', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'DateTimeActivationStrategy',
            featureFlagDetails: {
                enable: false,
                releaseDateWithTime: "11/28/2011/16:50:10",
            },
            featureFlagName: 'withDateTime',
        };
        const output: FeatureFlagReturnType = {"message": null, "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test DateTimeActivationStrategy on future dates and enable false', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'DateTimeActivationStrategy',
            featureFlagDetails: {
                enable: false,
                releaseDateWithTime: "11/28/2011/16:50:10",
            },
            featureFlagName: 'withDateTime',
        };
        const output: FeatureFlagReturnType = {"message": null, "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test DateTimeActivationStrategy when you dont pass releaseDateWithTime key', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'DateTimeActivationStrategy',
            featureFlagDetails: {
                enable: true,
            },
            featureFlagName: 'withDateTime',
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: DateTimeActivationStrategy missing lookup releaseDateWithTime in the config for feature flag: withDateTime", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test FlexibleRolloutActivationStrategy when you dont pass required params', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'FlexibleRolloutActivationStrategy',
            featureFlagDetails: {
                enable: true,
            },
            featureFlagName: 'withFlexibleRollout',
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: FlexibleRolloutActivationStrategy requires percentageRollout in the config object and userID in the context object as lookup for feature flag: withFlexibleRollout", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test FlexibleRolloutActivationStrategy when percentageRollout missing', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'FlexibleRolloutActivationStrategy',
            featureFlagDetails: {
                enable: true,
            },
            featureFlagName: 'withFlexibleRollout',
            userID: 'manoj'
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: FlexibleRolloutActivationStrategy missing lookup percentageRollout in the config for feature flag: withFlexibleRollout", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test FlexibleRolloutActivationStrategy when userID missing', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'FlexibleRolloutActivationStrategy',
            featureFlagDetails: {
                enable: true,
                percentageRollout: '10'
            },
            featureFlagName: 'withFlexibleRollout',
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: FlexibleRolloutActivationStrategy missing lookup userID in the context for feature flag: withFlexibleRollout", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test FlexibleRolloutActivationStrategy when passing both but user threshold more', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'FlexibleRolloutActivationStrategy',
            featureFlagDetails: {
                enable: true,
                percentageRollout: '10'
            },
            featureFlagName: 'withFlexibleRollout',
            userID: "manoj"
        };
        const output: FeatureFlagReturnType = {"message": "The calculated user threshold value(47) for userID: manoj is not in the range of percentageRollout(10) ", "status": false}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });

    test('Test FlexibleRolloutActivationStrategy when passing both', () => {
        const featureParams: FeatureFlagStrategyParams = {
            strategyType: 'FlexibleRolloutActivationStrategy',
            featureFlagDetails: {
                enable: true,
                percentageRollout: '90'
            },
            featureFlagName: 'withFlexibleRollout',
            userID: "manoj"
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true}
        expect(getFeatureFlagValueBasedOnActivationStrategy(featureParams)).toStrictEqual(output);
    });
    
});