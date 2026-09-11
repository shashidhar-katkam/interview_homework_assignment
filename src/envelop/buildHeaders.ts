import type { Plugin } from '@envelop/core';
import { v4 as uuid } from 'uuid';
import { ContextType } from '../types';

export const buildHeaders = (): Plugin<ContextType> => {
  return {
    onEnveloped({ context, extendContext }) {
      const requestId = uuid();
      const client = context?.request?.headers.get('client') ?? '';
      extendContext({ requestId: requestId, client });
    },
  };
};
