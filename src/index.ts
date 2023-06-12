import * as os from "os";

interface MACAddress {
  iface: string,
  macAddr: string
}

function createMacAddressGetter(all: true, throwErrorIfNoneFound: boolean): MACAddress[];
function createMacAddressGetter(all: false, throwErrorIfNoneFound: true): MACAddress;
function createMacAddressGetter(all: false, throwErrorIfNoneFound: false): MACAddress | undefined;
function createMacAddressGetter(all: boolean, throwErrorIfNoneFound: boolean): (MACAddress | undefined) | MACAddress[] {
  const networkInterfaces = os.networkInterfaces();

  let macAddresses: MACAddress[] | undefined = undefined;
  for (const interfaceKey in networkInterfaces) {
    if (!networkInterfaces.hasOwnProperty(interfaceKey)) {
      continue;
    }
    const networkInterface = networkInterfaces[interfaceKey];
    if (!networkInterface) {
      continue;
    }
    for (const interfaceInfo of networkInterface) {
      if (!interfaceInfo.internal) {
        const address: MACAddress = {
          iface: interfaceKey,
          macAddr: interfaceInfo.mac
        };
        if (!all) {
          return address;
        } else if (macAddresses === undefined) {
          macAddresses = [];
        }
        macAddresses.push(address);
      }
    }
  }
  if (throwErrorIfNoneFound && !macAddresses?.length) {
    throw new Error("No local MAC addresses found");
  } else if (all && macAddresses === undefined) {
    return [];
  }
  return macAddresses;
}

export function all(throwErrorIfNoneFound = true): MACAddress[] {
  return createMacAddressGetter(true, throwErrorIfNoneFound);
}

export function first(throwErrorIfNoneFound: false): MACAddress | undefined;
export function first(throwErrorIfNoneFound?: true): MACAddress;
export function first(throwErrorIfNoneFound?: undefined): MACAddress;
export function first(throwErrorIfNoneFound: boolean = true): MACAddress | undefined {
  if (throwErrorIfNoneFound) {
    return createMacAddressGetter(false, true);
  } else {
    return createMacAddressGetter(false, false);
  }
}

export default {
  first,
  all
};
