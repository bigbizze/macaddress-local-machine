import os from 'os';
import macAddressModule from "../src/index";

// Mock os.networkInterfaces
jest.mock('os', () => ({
  networkInterfaces: jest.fn()
}));

describe('createMacAddressGetter', () => {
  it('should return the first non-internal MAC address when all is false', () => {
    // Set up mock network interfaces
    (os.networkInterfaces as jest.Mock).mockReturnValue({
      'Loopback Pseudo-Interface 1': [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.1/8'
        }
      ],
      'Ethernet': [
        {
          address: '192.168.1.2',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: '01:23:45:67:89:ab',
          internal: false,
          cidr: '192.168.1.2/24'
        }
      ]
    });

    const first = macAddressModule.first;

    expect(first).toEqual({
      interface: 'Ethernet',
      mac: '01:23:45:67:89:ab'
    });
  });

  it('should return all non-internal MAC addresses when all is true', () => {
    // Set up mock network interfaces
    (os.networkInterfaces as jest.Mock).mockReturnValue({
      'Loopback Pseudo-Interface 1': [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.1/8'
        }
      ],
      'Ethernet': [
        {
          address: '192.168.1.2',
          netmask: '255.255.255.0',
          family: 'IPv4',
          mac: '01:23:45:67:89:ab',
          internal: false,
          cidr: '192.168.1.2/24'
        }
      ]
    });

    const all = macAddressModule.all;

    expect(all).toEqual([
      {
        interface: 'Ethernet',
        mac: '01:23:45:67:89:ab'
      }
    ]);
  });

  it('should throw an error when no non-internal MAC addresses are found', () => {
    // Set up mock network interfaces
    (os.networkInterfaces as jest.Mock).mockReturnValue({
      'Loopback Pseudo-Interface 1': [
        {
          address: '127.0.0.1',
          netmask: '255.0.0.0',
          family: 'IPv4',
          mac: '00:00:00:00:00:00',
          internal: true,
          cidr: '127.0.0.1/8'
        }
      ]
    });

    expect(() => macAddressModule.all).toThrowError("No local MAC addresses found");
    expect(() => macAddressModule.first).toThrowError("No local MAC addresses found");
  });
});
