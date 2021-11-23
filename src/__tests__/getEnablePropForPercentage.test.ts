import { FeatureFlagKey, FeatureFlagReturnType, PercentageRolloutFeatureParams } from '../types';
import getFeatureFlagEnablePropForPercentageRollout from '../utils/getEnablePropForPercentage';

/**
 * Possible scenarios to test
 * 1. When enable is true & userThreshold less than percentageRollout
 * 2. When enable is false & userThreshold less than percentageRollout
 * 3. When enable is false & userThreshold more than percentageRollout
 * 4. When enable is true & userThreshold is more than percentageRollout
 * 5. When user don't pass percentageRollout in their config
 * 6. When user don't pass userID in their context
 * 7. When user dont pass percentageRollout & userID
 */

describe('getFeatureFlagEnablePropForPercentageRollout', () => {

    // Case: 1
    test('When enable is true & userThreshold less than percentageRollout', () => {
        const featureParams: PercentageRolloutFeatureParams = {
            featureFlagDetails: {
                activationStrategies:['FlexibleRolloutActivationStrategy'],
                enable: true,
                percentageRollout: '40'
            },
            key: FeatureFlagKey.PercentageRollout,
            userID: 'ggggg',
            featureFlagName: 'percentageRollout',
            strategyKey: 'percentageRollout',
            activationStrategy: "FlexibleRolloutActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true};
        expect(getFeatureFlagEnablePropForPercentageRollout(featureParams)).toStrictEqual(output);
    });

    // Case: 2
    test('When enable is false & userThreshold less than percentageRollout', () => {
        const featureParams: PercentageRolloutFeatureParams = {
            featureFlagDetails: {
                activationStrategies:['FlexibleRolloutActivationStrategy'],
                enable: false,
                percentageRollout: '40'
            },
            key: FeatureFlagKey.PercentageRollout,
            userID: 'ggggg',
            featureFlagName: 'percentageRollout',
            strategyKey: 'percentageRollout',
            activationStrategy: "FlexibleRolloutActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": null, "status": false};
        expect(getFeatureFlagEnablePropForPercentageRollout(featureParams)).toStrictEqual(output);
    });

    // Case: 3
    test('When enable is false & userThreshold more than percentageRollout', () => {
        const featureParams: PercentageRolloutFeatureParams = {
            featureFlagDetails: {
                activationStrategies:['FlexibleRolloutActivationStrategy'],
                enable: false,
                percentageRollout: '40'
            },
            key: FeatureFlagKey.PercentageRollout,
            userID: 'm0k05u9',
            featureFlagName: 'percentageRollout',
            strategyKey: 'percentageRollout',
            activationStrategy: "FlexibleRolloutActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "The calculated user threshold value(45) for userID: m0k05u9 is not in the range of percentageRollout(40) ", "status": false};
        expect(getFeatureFlagEnablePropForPercentageRollout(featureParams)).toStrictEqual(output);
    });

    // Case: 4
    test('When enable is true & userThreshold is more than percentageRollout', () => {
        const featureParams: PercentageRolloutFeatureParams = {
            featureFlagDetails: {
                activationStrategies:['FlexibleRolloutActivationStrategy'],
                enable: true,
                percentageRollout: '40'
            },
            key: FeatureFlagKey.PercentageRollout,
            userID: 'm0k05u9',
            featureFlagName: 'percentageRollout',
            strategyKey: 'percentageRollout',
            activationStrategy: "FlexibleRolloutActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "The calculated user threshold value(45) for userID: m0k05u9 is not in the range of percentageRollout(40) ", "status": false};
        expect(getFeatureFlagEnablePropForPercentageRollout(featureParams)).toStrictEqual(output);
    });
   
    // Case: 5
    test(`When user don't pass percentageRollout in their config`, () => {
        const featureParams: PercentageRolloutFeatureParams = {
            featureFlagDetails: {
                activationStrategies:['FlexibleRolloutActivationStrategy'],
                enable: true
            },
            key: FeatureFlagKey.PercentageRollout,
            userID: 'M0K05U9',
            featureFlagName: 'percentageRollout',
            strategyKey: 'percentageRollout',
            activationStrategy: "FlexibleRolloutActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: FlexibleRolloutActivationStrategy missing lookup percentageRollout in the config for feature flag: percentageRollout", "status": false}
        expect(getFeatureFlagEnablePropForPercentageRollout(featureParams)).toStrictEqual(output);
    });

    // Case: 6
    test(`When user don't pass userID in their context`, () => {
        const featureParams = {
            featureFlagDetails: {
                activationStrategies:['FlexibleRolloutActivationStrategy'],
                enable: true,
                percentageRollout: '40'
            },
            key: FeatureFlagKey.PercentageRollout,
            featureFlagName: 'percentageRollout',
            strategyKey: 'percentageRollout',
            activationStrategy: "FlexibleRolloutActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: FlexibleRolloutActivationStrategy missing lookup userID in the context for feature flag: percentageRollout", "status": false};
        expect(getFeatureFlagEnablePropForPercentageRollout(featureParams as any)).toStrictEqual(output);
    });

    // Case: 7
    test('When user dont pass percentageRollout & userID', () => {
        const featureParams = {
            featureFlagDetails: {
                activationStrategies:['FlexibleRolloutActivationStrategy'],
                enable: true,
            },
            key: FeatureFlagKey.PercentageRollout,
            featureFlagName: 'percentageRollout',
            strategyKey: 'percentageRollout',
            activationStrategy: "FlexibleRolloutActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: FlexibleRolloutActivationStrategy requires percentageRollout in the config object and userID in the context object as lookup for feature flag: percentageRollout", "status": false};
        expect(getFeatureFlagEnablePropForPercentageRollout(featureParams as any)).toStrictEqual(output);
    });
});
