import { getAddress, addAddress } from "./address/address";
import { Address, Args, AddAddressArgs } from "./address/types";
import { getNearEarthObjects } from "./nearEarthObjects/nearEarthObjects";
import { NearEarthObjectFeed, Args as NearEarthObjectsArgs } from "./nearEarthObjects/types";

export const resolvers = {
  Query: {
    address: (parent: any, args: Args, context: any, info: any): Address => {
      return getAddress(parent, args, context);
    },
    nearEarthObjects: (parent: any, args: NearEarthObjectsArgs, context: any): Promise<NearEarthObjectFeed> => {
      return getNearEarthObjects(parent, args, context);
    },
  },
  Mutation: {
    addAddress: (parent: any, args: AddAddressArgs, context: any, info: any): Address => {
      return addAddress(parent, args, context);
    },
  },
};
