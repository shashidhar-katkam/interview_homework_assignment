import { getAddress, addAddress } from "./address/address";
import { Address, Args, AddAddressArgs } from "./address/types";

export const resolvers = {
  Query: {
    address: (parent: any, args: Args, context: any, info: any): Address => {
      return getAddress(parent, args, context);
    },
  },
  Mutation: {
    addAddress: (parent: any, args: AddAddressArgs, context: any, info: any): Address => {
      return addAddress(parent, args, context);
    },
  },
};
