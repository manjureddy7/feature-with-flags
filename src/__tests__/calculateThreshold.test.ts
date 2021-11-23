import calculateUserEnablementThreshold from '../utils/threshold';

describe('calculateUserEnablementThreshold', () => {
    test('return exact threshold value ', () => {
        expect(calculateUserEnablementThreshold('flag', 'manoj')).toEqual(20);
    });
    test('return exact threshold value ', () => {
        expect(calculateUserEnablementThreshold('flag', 'name')).toEqual(61);
    });
    test('return exact threshold value ', () => {
        expect(calculateUserEnablementThreshold('flag', 'manoj')).not.toEqual(30);
    });
});
