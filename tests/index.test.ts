import os from 'os';
import { all, first } from "../src";
import macAddr from "../src";

describe('MAC Address Getter', () => {
  let networkInterfacesSpy: jest.SpyInstance;

  beforeEach(() => {
    networkInterfacesSpy = jest.spyOn(os, 'networkInterfaces');
  });

  afterEach(() => {
    networkInterfacesSpy.mockRestore();
  });

  it('returns all MAC addresses when calling all()', () => {
    networkInterfacesSpy.mockReturnValue({
      lo: [
        {
          internal: true,
          macAddr: '00:00:00:00:00:00',
        },
        {
          internal: false,
          macAddr: '01:23:45:67:89:ab',
        },
      ],
      eth0: [
        {
          internal: false,
          macAddr: 'cd:ef:01:23:45:67',
        },
      ],
    });

    const result = all();

    expect(result).toEqual([
      { iface: 'lo', macAddr: '01:23:45:67:89:ab' },
      { iface: 'eth0', macAddr: 'cd:ef:01:23:45:67' },
    ]);
  });

  it('returns the first MAC address when calling first()', () => {
    networkInterfacesSpy.mockReturnValue({
      lo: [
        {
          internal: true,
          macAddr: '00:00:00:00:00:00',
        },
        {
          internal: false,
          macAddr: '01:23:45:67:89:ab',
        },
      ],
      eth0: [
        {
          internal: false,
          macAddr: 'cd:ef:01:23:45:67',
        },
      ],
    });

    const result = first();

    expect(result).toEqual({ iface: 'lo', macAddr: '01:23:45:67:89:ab' });
  });

  it('throws an error when no MAC addresses found and throwErrorIfNoneFound is true', () => {
    networkInterfacesSpy.mockReturnValue({
      lo: [
        {
          internal: true,
          macAddr: '00:00:00:00:00:00',
        },
      ],
    });

    expect(() => macAddr.all()).toThrow('No local MAC addresses found');
    expect(() => first()).toThrow('No local MAC addresses found');
  });

  it('does not throw an error when no MAC addresses found and throwErrorIfNoneFound is false', () => {
    networkInterfacesSpy.mockReturnValue({
      lo: [
        {
          internal: true,
          macAddr: '00:00:00:00:00:00',
        },
      ],
    });

    expect(() => all(false)).not.toThrow();
    expect(() => macAddr.first(false)).not.toThrow();
  });

  it('returns undefined when first is called with throwErrorIfNoneFound set to false and none are found', () => {
    networkInterfacesSpy.mockReturnValue({
      lo: [
        {
          internal: true,
          macAddr: '00:00:00:00:00:00',
        },
      ],
    });
    expect(first(false)).toBeUndefined();
  });

  it('returns an empty list when all is called with throwErrorIfNoneFound set to false and none are found', () => {
    networkInterfacesSpy.mockReturnValue({
      lo: [
        {
          internal: true,
          macAddr: '00:00:00:00:00:00',
        },
      ],
    });
    expect(all(false)?.length).toBe(0);
  });
});
