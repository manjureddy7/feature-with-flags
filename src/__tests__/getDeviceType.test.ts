import getDeviceType from '../utils/getDeviceType';

describe('getDeviceType', () => {
    test('get device type as Desktop ', () => {
        const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36';
        expect(getDeviceType(userAgent)).toStrictEqual('desktop')
    });
    
    test('get device type as Mobile ', () => {
        const userAgent = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Mobile Safari/537.36';
        expect(getDeviceType(userAgent)).toStrictEqual('mobile')
    });
    
    test('get device type as Tablet', () => {
        const userAgent = 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1';
        expect(getDeviceType(userAgent)).toStrictEqual('tablet')
    });
});