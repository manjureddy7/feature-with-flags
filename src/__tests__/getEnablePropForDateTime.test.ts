import { FeatureFlagReturnType, ReleaseTimeActivationStrategyFeatureParams } from '../types';
import getFeatureFlagEnablePropForReleaseTimeDate from '../utils/getEnablePropForReleaseWithTime'


describe('getFeatureFlagEnablePropForReleaseTimeDate with Release Date and Time', () => {

    /**
     * Possible scenarios to test
     * 1. When enable is true & releaseDateWithTime less than currentDateTime
     * 2. When enable is true & releaseDateWithTime more than currentDateTime
     * 3. When enable is false & releaseDateWithTime less than currentDateTime
     * 4. When enable is false & releaseDateWithTime more than currentDateTime
     * 5. When enable is true & user didnt pass releaseDateWithTime config
     * 6. When enable is true & user pass releaseDateWithTime as string
    */

    // Case: 1 
    test('When enable is true & releaseDateWithTime less than currentDateTime', () => {
        const featureParams: ReleaseTimeActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: true,
                releaseDateWithTime: ['11/18/2021/16', '50', '10']
            },
            key: 'releaseDateWithTime',
            featureFlagName: 'flagReleaseDate',
            strategyKey: 'releaseDateWithTime',
            activationStrategy: "DateTimeActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true};
        expect(getFeatureFlagEnablePropForReleaseTimeDate(featureParams)).toStrictEqual(output);
    });

    // Case: 2
    test('When enable is true & releaseDateWithTime more than currentDateTime', () => {
        const featureParams: ReleaseTimeActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: true,
                releaseDateWithTime: ['11/21/2031/16', '50', '10']
            },
            key: 'releaseDateWithTime',
            featureFlagName: 'flagReleaseDate',
            strategyKey: 'releaseDateWithTime',
            activationStrategy: "DateTimeActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "11/21/2031/16:50:10 is ahead of your current date", "status": false};
        expect(getFeatureFlagEnablePropForReleaseTimeDate(featureParams)).toStrictEqual(output);
    });

    // Case: 3
    test('When enable is false & releaseDateWithTime less than currentDateTime', () => {
        const featureParams: ReleaseTimeActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: false,
                releaseDateWithTime: ['11/11/2021/16', '50', '10']
            },
            key: 'releaseDateWithTime',
            featureFlagName: 'flagReleaseDate',
            strategyKey: 'releaseDateWithTime',
            activationStrategy: "DateTimeActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": null, "status": false};
        expect(getFeatureFlagEnablePropForReleaseTimeDate(featureParams)).toStrictEqual(output);
    });

    // Case: 4
    test('When enable is false & releaseDateWithTime more than currentDateTime', () => {
        const featureParams: ReleaseTimeActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: false,
                releaseDateWithTime: ['11/11/2031/16', '50', '10']
            },
            key: 'releaseDateWithTime',
            featureFlagName: 'flagReleaseDate',
            strategyKey: 'releaseDateWithTime',
            activationStrategy: "DateTimeActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "11/11/2031/16:50:10 is ahead of your current date", "status": false};
        expect(getFeatureFlagEnablePropForReleaseTimeDate(featureParams)).toStrictEqual(output);
    });

     // Case: 5
     test('When enable is true & user didnt pass releaseDateWithTime config', () => {
        const featureParams: ReleaseTimeActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: true
            },
            key: 'releaseDateWithTime',
            featureFlagName: 'flagReleaseDate',
            strategyKey: 'releaseDateWithTime',
            activationStrategy: "DateTimeActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: DateTimeActivationStrategy missing lookup releaseDateWithTime in the config for feature flag: flagReleaseDate", "status": false};
        expect(getFeatureFlagEnablePropForReleaseTimeDate(featureParams)).toStrictEqual(output);
    });

    // Case: 6
    test('When enable is true & user pass releaseDateWithTime as string', () => {
        const featureParams: ReleaseTimeActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: true,
                releaseDateWithTime: "11/28/2031/16:50:10"
            },
            key: 'releaseDateWithTime',
            featureFlagName: 'flagReleaseDate',
            strategyKey: 'releaseDateWithTime',
            activationStrategy: "DateTimeActivationStrategy"
        };
        const output: FeatureFlagReturnType = {"message": "11/28/2031/16:50:10 is ahead of your current date", "status": false};
        expect(getFeatureFlagEnablePropForReleaseTimeDate(featureParams)).toStrictEqual(output);
    });
});