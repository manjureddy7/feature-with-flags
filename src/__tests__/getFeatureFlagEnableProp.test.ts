import { ActivationStrategyFeatureParams, FeatureFlagReturnType } from '../types';
import getFeatureFlagEnableProp from '../utils/getEnableProp';

describe('getFeatureFlagEnableProp', () => {
    test('get enable prop as TRUE ', () => {
        const featureParams: ActivationStrategyFeatureParams = {
            featureFlagDetails: {
                userRoles: ['m0k05u9'],
                enable: true,
            },
            key: 'userRoles',
            value: 'm0k05u9',
            by: 'userRole',
            featureFlagName: 'flagRole',
            strategyKey: 'userRoles',
            activationStrategy: 'default'
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true}
        expect(getFeatureFlagEnableProp(featureParams)).toStrictEqual(output);
    });
    
    test('when enable prop is TRUE  when condition not met', () => {
        const featureParams: ActivationStrategyFeatureParams = {
            featureFlagDetails: {
                userRoles: ['m0k05u9'],
                enable: true,
            },
            key: 'userRoles',
            value: 'abc',
            by: 'userRole',
            featureFlagName: 'flagRole',
            strategyKey: 'userRoles',
            activationStrategy: 'default'
        };
        const output: FeatureFlagReturnType = {"message": "userRole: abc is not found in userRoles", "status": false}
        expect(getFeatureFlagEnableProp(featureParams)).toStrictEqual(output);
    });
    test('when enable prop is TRUE  when condition met', () => {
        const featureParams: ActivationStrategyFeatureParams = {
            featureFlagDetails: {
                userRoles: ['m0k05u9'],
                enable: false,
            },
            key: 'userRoles',
            value: 'm0k05u9',
            by: 'userRole',
            featureFlagName: 'flagRole',
            strategyKey: 'userRoles',
            activationStrategy: 'default'
        };
        const output: FeatureFlagReturnType = {"message": null, "status": false}
        expect(getFeatureFlagEnableProp(featureParams)).toStrictEqual(output);
    });
});