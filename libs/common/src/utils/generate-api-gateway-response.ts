import {APIGatewayProxyResultV2} from 'aws-lambda';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':
    process.env.ALLOWED_ORIGIN ?? 'https://fidofostercommunity.dev',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export const generateApiGatewayResponse = (
  statusCode: number,
  body: Record<string, unknown>,
): APIGatewayProxyResultV2 => {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
};
