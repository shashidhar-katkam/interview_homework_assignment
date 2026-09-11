import type { Plugin } from '@envelop/core';
import { ExecutionResult } from 'graphql';
import { ContextType } from '../types';

export const appendRequestId = (): Plugin<ContextType> => {
  return {
    onExecute({ args }) {
      return {
        onExecuteDone({ result, setResult }) {
          setResult({
            ...(result as ExecutionResult),
            metadata: { requestId: args.contextValue.requestId },
          } as ExecutionResult);
        },
      };
    },
  };
};
