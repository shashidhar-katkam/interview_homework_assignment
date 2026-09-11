import fs from 'fs';
import path from 'path';
import { GraphQLError } from 'graphql';
import { Addresses, Address, Args, AddAddressArgs } from './types';

const addressesFilePath = path.join(__dirname, '../../../data/addresses.json');

const readAddresses = (): Addresses => {
  const raw = fs.readFileSync(addressesFilePath, 'utf-8');
  return JSON.parse(raw) as Addresses;
};

const writeAddresses = (addresses: Addresses): void => {
  fs.writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2));
};

const _getAddress = (username: string): Address | null => {
  const addresses = readAddresses();
  return addresses[username] ?? null;
};

export const getAddress = (_: any, args: Args, context: any): Address => {
  context.logger.info('getAddress: Enter resolver');
  const address = _getAddress(args.username);
  if (address) {
    context.logger.info('getAddress: Returning address');
    return address;
  }
  context.logger.error('getAddress: No address found');
  throw new GraphQLError('No address found in getAddress resolver');
};

export const addAddress = (_: any, args: AddAddressArgs, context: any): Address => {
  context.logger.info('addAddress: Enter resolver');
  const addresses = readAddresses();

  if (addresses[args.username]) {
    context.logger.error('addAddress: Address already exists for username');
    throw new GraphQLError(`Address already exists for username: ${args.username}`);
  }

  addresses[args.username] = args.address;
  writeAddresses(addresses);
  context.logger.info('addAddress: Address created');
  return addresses[args.username];
};
