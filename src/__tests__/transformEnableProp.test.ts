import transformEnableProp from '../utils/transformEnableProp';

describe('transformEnableProp', () => {
    test('should transform and emit correct value', () => {
        expect(transformEnableProp(['true'])).toEqual(true);
    });
    test('should transform and emit correct value', () => {
        expect(transformEnableProp(['false'])).toEqual(false);
    });
});