import getUserThreshold from '../utils/getUserThreshold';

describe('getUserThreshold', () => {
    test('will equal to exact threshold value ', () => {
        const userThreshold = getUserThreshold('flag', 'manoj');
        expect(userThreshold).toEqual(20);
    });
    test('will not equal threshold value ', () => {
        const userThreshold = getUserThreshold('flag', 'manoj');
        expect(userThreshold).not.toEqual(55)
    });
});