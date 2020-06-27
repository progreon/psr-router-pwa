import { RouterMessage } from 'SharedModules/psr-router-util';

test('init', () => {
    let rm: RouterMessage = new RouterMessage("This is an informational message", RouterMessage.Type.Info);
    expect(rm.toString()).toBe("Info: This is an informational message");
});