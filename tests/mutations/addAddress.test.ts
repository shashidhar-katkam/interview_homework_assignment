import fs from 'fs';
import path from 'path';
import { parse } from 'graphql';
import { executor } from '../exectuor';

const addressesFilePath = path.join(__dirname, '../../data/addresses.json');
const testUsername = 'shashi';

const mutation = `
    mutation AddAddress($username: String!, $address: AddressInput!) {
        addAddress(username: $username, address: $address) {
            street
            city
            zipcode
            state
        }
    }
`;

describe('addAddress', () => {
  afterEach(() => {
    const addresses = JSON.parse(fs.readFileSync(addressesFilePath, 'utf-8'));
    delete addresses[testUsername];
    fs.writeFileSync(addressesFilePath, JSON.stringify(addresses, null, 2));
  });

  test('Success', async () => {
    const variables = {
      username: testUsername,
      address: { street: 'Alexan', city: 'Monroe', zipcode: '28112', state: 'NC' },
    };

    const result = await executor({
      document: parse(mutation),
      variables,
      extensions: { headers: { client: 'web-client' } },
    });

    expect(result).toEqual({
      data: {
        addAddress: { street: 'Alexan', city: 'Monroe', zipcode: '28112', state: 'NC' },
      },
      metadata: {
        requestId: expect.any(String),
      },
    });

    const persisted = JSON.parse(fs.readFileSync(addressesFilePath, 'utf-8'));
    expect(persisted[testUsername]).toEqual({ street: 'Alexan', city: 'Monroe', zipcode: '28112', state: 'NC' });
  });

  test('Rejects a create for a username that already exists', async () => {
    const variables = {
      username: 'jack',
      address: { street: 'Alexan', city: 'Monroe', zipcode: '28112', state: 'NC' },
    };

    const result = await executor({
      document: parse(mutation),
      variables,
      extensions: { headers: { client: 'web-client' } },
    });

    expect(result).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({ message: expect.stringContaining('Address already exists') }),
        ]),
      }),
    );
  });
});
