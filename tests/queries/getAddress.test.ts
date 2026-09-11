import { parse } from 'graphql';
import { executor } from '../exectuor';

const query = `
    query GetAddress($username: String!) {
        address(username: $username) {
            street
            city
            zipcode
            state
        }
    }
`;

describe('getAddress', () => {
  test('Success', async () => {
    const variables = { username: 'jack' };

    const result = await executor({
      document: parse(query),
      variables,
      extensions: { headers: { client: 'web-client' } },
    });

    expect(result).toEqual({
      data: {
        address: {
          street: '123 Street St.',
          city: 'Sometown',
          zipcode: '43215',
          state: 'NC',
        },
      },
      metadata: {
        requestId: expect.any(String),
      },
    });
  });

  test('Error', async () => {
    const variables = { username: 'john' };

    const result = await executor({
      document: parse(query),
      variables,
      extensions: { headers: { client: 'web-client' } },
    });

    expect(result).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'No address found in getAddress resolver',
          }),
        ]),
        metadata: {
          requestId: expect.any(String),
        },
      }),
    );
  });
});
