import 'dotenv/config';
import {APIGatewayProxyEventV2} from 'aws-lambda';
import {handler} from './index';

const BASE_EVENT: Partial<APIGatewayProxyEventV2> = {
  requestContext: {
    http: {
      method: 'POST',
      path: '/',
      protocol: 'HTTP/1.1',
      sourceIp: '127.0.0.1',
      userAgent: 'test',
    },
    accountId: 'test',
    apiId: 'test',
    domainName: 'test',
    domainPrefix: 'test',
    requestId: 'test',
    routeKey: 'POST /',
    stage: 'test',
    time: new Date().toISOString(),
    timeEpoch: Date.now(),
  },
  headers: {},
  isBase64Encoded: false,
};

const main = async () => {
  const result = await handler({
    ...BASE_EVENT,
    headers: {authorization: `Bearer ${process.env.TEST_TOKEN}`},
    body: JSON.stringify({
      message: 'Test message from jordan',
      categories: ['Short Term'],
    }),
  } as APIGatewayProxyEventV2);

  console.log(JSON.stringify(result, null, 2));
};

main().catch(err => {
  console.error(err);
  process.exit(1);
});
