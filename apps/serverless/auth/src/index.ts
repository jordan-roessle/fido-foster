import {APIGatewayProxyEventV2} from 'aws-lambda';
import jwt from 'jsonwebtoken';

import {
  generateApiGatewayResponse,
  StatusCodes,
  validateEnv,
} from '@fido-foster-twilio/common';

const requiredEnvVars = ['ALLOWED_ORIGIN', 'AUTH_PASSWORD', 'JWT_SECRET'];
const tokenExpiration = '1h';

export const handler = async (event: APIGatewayProxyEventV2) => {
  // Validate env, grab env vars
  let expectedPassword: string;
  let jwtSecret: string;
  try {
    ({AUTH_PASSWORD: expectedPassword, JWT_SECRET: jwtSecret} =
      validateEnv(requiredEnvVars));
  } catch (e) {
    console.error(e);
    return generateApiGatewayResponse(StatusCodes.InternalError, {
      message: 'Missing env variables, please contact chelsea/jordan',
    });
  }

  // Validate request, grab password
  if (!event.body) {
    return generateApiGatewayResponse(StatusCodes.BadRequest, {
      message: 'Missing request body',
    });
  }

  let password: string;
  try {
    ({password} = JSON.parse(event.body));
  } catch {
    return generateApiGatewayResponse(StatusCodes.BadRequest, {
      message: 'Invalid JSON',
    });
  }

  if (!password) {
    return generateApiGatewayResponse(StatusCodes.BadRequest, {
      message: 'Password is required',
    });
  }

  // Check correct password and return token
  if (password !== expectedPassword) {
    return generateApiGatewayResponse(StatusCodes.Unauthorized, {
      message: 'Invalid password',
    });
  }

  const token = jwt.sign({}, jwtSecret, {expiresIn: tokenExpiration});
  return generateApiGatewayResponse(StatusCodes.OK, {token});
};
