# MAC Address Getter

MAC Address Getter is a Node.js library for retrieving the MAC addresses from a machine's network interfaces. It provides functionalities to get either the first MAC address or all MAC addresses.

----
## Installation

Use the package manager [npm](https://www.npmjs.com) to install MAC Address Getter.
```bash
npm install --save-dev macaddress-local-machine
```
#### *OR*
```bash
yarn add -D macaddress-local-machine
```
----
## Usage

```ts
import { first, all } from "macaddress-local-machine";

// Get the first MAC address
const macAddress = first();
console.log(macAddress);

// Get all MAC addresses
const macAddresses = all();
console.log(macAddresses);
```

#### *OR*
```ts
import macAddr from "macaddress-local-machine";
// Get the first MAC address
const macAddress = macAddr.first();
console.log(macAddress);

// Get all MAC addresses
const macAddresses = macAddr.all();
console.log(macAddresses);
```
----

## Interface

```ts
interface MACAddress {
  iface: string,
  macAddr: string
}

// Example object:
{
  "iface": "eno2",
  "macAddr": "01:23:45:67:89:ab"
}
```

```ts
/**
 *  Returns the first MAC address found. If throwErrorIfNoneFound is set to true and no MAC 
 *  address is found, an error will be thrown.
 */
function first(throwErrorIfNoneFound: boolean = false): MACAddress | undefined;
function first(throwErrorIfNoneFound: boolean = true): MACAddress;
```

```ts
/**
 *  Returns an array of all MAC addresses found. If throwErrorIfNoneFound is set to true and 
 *  no MAC address is found, an error will be thrown. Otherwise, if none are found, return an
 *  empty array.
 */
function all(throwErrorIfNoneFound: boolean = true): MACAddress[]
```