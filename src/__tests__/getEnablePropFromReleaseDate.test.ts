import { FeatureFlagReturnType, ReleaseActivationStrategyFeatureParams } from '../types';
import getFeatureFlagEnablePropForReleaseDate from '../utils/getEnablePropFromReleaseDate';

describe('getFeatureFlagEnablePropForReleaseDate with Release Date', () => {

    /**
     * Possible scenarios to test
     * 1. When enable is true & releaseDate less than currentDateTime
     * 2. When enable is true & releaseDate more than currentDateTime
     * 3. When enable is false & releaseDate less than currentDateTime
     * 4. When enable is false & releaseDate more than currentDateTime
    */

    // Case: 1
    test('When enable is true & releaseDate less than currentDateTime', () => {
        const featureParams: ReleaseActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: true,
                releaseDate: 'November 16, 2021'
            },
            key: 'releaseDate',
            strategyKey: 'releaseDate',
            activationStrategy: "ReleaseDateActivationStrategy",
            featureFlagName: 'flagReleaseDate'
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true};
        expect(getFeatureFlagEnablePropForReleaseDate(featureParams)).toStrictEqual(output);
    });

    // Case: 2
    test('When enable is true & releaseDate more than currentDateTime', () => {
        const featureParams: ReleaseActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: true,
                releaseDate: 'November 16, 2031'
            },
            key: 'releaseDate',
            strategyKey: 'releaseDate',
            activationStrategy: "ReleaseDateActivationStrategy",
            featureFlagName: 'flagReleaseDate'
        };
        const output: FeatureFlagReturnType = {"message": "November 16, 2031 is ahead of your current date", "status": false};
        expect(getFeatureFlagEnablePropForReleaseDate(featureParams)).toStrictEqual(output);
    });

    // Case: 3
    test('When enable is false & releaseDate less than currentDateTime', () => {
        const featureParams: ReleaseActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: false,
                releaseDate: 'November 11, 2021'
            },
            key: 'releaseDate',
            strategyKey: 'releaseDate',
            activationStrategy: "ReleaseDateActivationStrategy",
            featureFlagName: 'flagReleaseDate'
        };
        const output: FeatureFlagReturnType = {"message": null, "status": false};
        expect(getFeatureFlagEnablePropForReleaseDate(featureParams)).toStrictEqual(output);
    });

    // Case: 4
    test('When enable is false & releaseDate more than currentDateTime', () => {
        const featureParams: ReleaseActivationStrategyFeatureParams = {
            featureFlagDetails: {
                enable: false,
                releaseDate: 'November 11, 2031'
            },
            key: 'releaseDate',
            strategyKey: 'releaseDate',
            activationStrategy: "ReleaseDateActivationStrategy",
            featureFlagName: 'flagReleaseDate'
        };
        const output: FeatureFlagReturnType = {"message": "November 11, 2031 is ahead of your current date", "status": false};
        expect(getFeatureFlagEnablePropForReleaseDate(featureParams)).toStrictEqual(output);
    });
});