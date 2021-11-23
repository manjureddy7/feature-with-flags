import getFeatureFlagStatus from '../utils';
import { FeatureFlagReturnType, GetFeatureFlagParams } from '../types';

describe('getFeatureFlagStatus', () => {
    test('with all correct params, it should return true ', () => {
        const params: GetFeatureFlagParams = {
            featureFlagContext: {
                tenantID: 'tenant123'
            },
            activationStrategies: ['TenantActivationStrategy'],
            featureFlagName: 'tenants',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['tenant123', 'tenant456']
            }
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true};
        expect(getFeatureFlagStatus(params)).toEqual([output]);
    });
    test('with all incorrect params of strategy, it should return false ', () => {
        const params: GetFeatureFlagParams = {
            featureFlagContext: {
                tenantID: 'tenant123'
            },
            activationStrategies: ['DeviceTypeActivationStrategy'],
            featureFlagName: 'tenants',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['tenant123', 'tenant456']
            }
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: DeviceTypeActivationStrategy missing lookup deviceTypes in the config for feature flag: tenants", "status": false};
        expect(getFeatureFlagStatus(params)).toEqual([output]);
    });
    test('with all incorrect params of tenantID, it should return false ', () => {
        const params: GetFeatureFlagParams = {
            featureFlagContext: {
                tenantID: 'tenant678'
            },
            activationStrategies: ['TenantActivationStrategy'],
            featureFlagName: 'tenants',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['tenant123', 'tenant456']
            }
        };
        const output: FeatureFlagReturnType = {"message": "tenantID: tenant678 is not found in tenantIDs", "status": false};
        expect(getFeatureFlagStatus(params)).toEqual([output]);
    });
    test('Multiple correct stratigies it should return true ', () => {
        const params: GetFeatureFlagParams = {
            featureFlagContext: {
                tenantID: 'tenant123',
                region: 'IND'
            },
            activationStrategies: ['TenantActivationStrategy', 'RegionActivationStrategy'],
            featureFlagName: 'tenants',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['tenant123', 'tenant456'],
                regions: ['IND']
            }
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true};
        expect(getFeatureFlagStatus(params)).toEqual([output, output]);
    });
    test('Multiple incorrect stratigies it should return false', () => {
        const params: GetFeatureFlagParams = {
            featureFlagContext: {
                tenantID: 'tenant123',
                region: 'IND'
            },
            activationStrategies: ['ClientIdActivationStrategy', 'ReleaseDateActivationStrategy'],
            featureFlagName: 'tenants',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['tenant123', 'tenant456'],
                regions: ['IND']
            }
        };
        const output: FeatureFlagReturnType = {"message": "Activation strategy: ClientIdActivationStrategy requires clientIDs in the config object and clientID in the context object as lookup for feature flag: tenants", "status": false};
        const output1: FeatureFlagReturnType = {"message": "Activation strategy: ReleaseDateActivationStrategy missing lookup releaseDate in the config for feature flag: tenants", "status": false};
        expect(getFeatureFlagStatus(params)).toEqual([output, output1]);
    });
    test('Multiple one correct & one wrong stratigies it should return true,false ', () => {
        const params: GetFeatureFlagParams = {
            featureFlagContext: {
                tenantID: 'tenant123',
                region: 'IND'
            },
            activationStrategies: ['TenantActivationStrategy', 'ReleaseDateActivationStrategy'],
            featureFlagName: 'tenants',
            featureFlagDetails: {
                enable: true,
                tenantIDs: ['tenant123', 'tenant456'],
                regions: ['IND']
            }
        };
        const output: FeatureFlagReturnType = {"message": null, "status": true};
        const output1: FeatureFlagReturnType = {"message": "Activation strategy: ReleaseDateActivationStrategy missing lookup releaseDate in the config for feature flag: tenants", "status": false};
        expect(getFeatureFlagStatus(params)).toEqual([output, output1]);
    });
});