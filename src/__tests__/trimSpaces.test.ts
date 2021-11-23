import trimAndRemoveSpacesFromConfig from '../utils/trimSpaces';

describe('trimAndRemoveSpacesFromConfig', () => {
    test('trim and remove spaces ', () => {
        expect(trimAndRemoveSpacesFromConfig(['manoj, yoo'])).toEqual(['manoj', 'yoo']);
    });
    test('trim and remove spaces ', () => {
        expect(trimAndRemoveSpacesFromConfig(['true, yoo'])).toEqual(['true', 'yoo']);
    });
});