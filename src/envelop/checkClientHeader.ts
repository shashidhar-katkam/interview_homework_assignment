import type { Plugin } from '@envelop/core';
import { DefinitionNode, GraphQLError, Kind, OperationDefinitionNode } from 'graphql';
import { ContextType } from '../types';

const RESTRICTED_CLIENTS = ['strata'];

export const checkClientHeader = (): Plugin<ContextType> => {
  return {
    onExecute({ args, setResultAndStopExecution }) {
      const client = args.contextValue.request?.headers.get('client') ?? '';

      if (!client) {
        setResultAndStopExecution({
          errors: [new GraphQLError("Missing required 'client' header")],
        });
        return;
      }

      if (RESTRICTED_CLIENTS.includes(client)) {
        const operation = args.document.definitions.find(
          (definition: DefinitionNode): definition is OperationDefinitionNode =>
            definition.kind === Kind.OPERATION_DEFINITION,
        );

        if (operation?.operation === 'mutation') {
          setResultAndStopExecution({
            errors: [new GraphQLError(`Client '${client}' is not permitted to perform mutations`)],
          });
        }
      }
    },
  };
};
