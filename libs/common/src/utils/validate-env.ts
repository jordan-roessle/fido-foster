export const validateEnv = <T extends string>(
  requiredKeys: T[],
): Record<T, string> => {
  const config: Record<T, string> = {} as Record<T, string>;
  const errors: string[] = [];

  for (const key of requiredKeys) {
    if (!process.env[key]) {
      errors.push(key);
    } else {
      config[key] = process.env[key];
    }
  }

  if (errors.length) {
    throw new Error(`Missing required env vars: ${errors.join(', ')}`);
  }

  return config;
};
