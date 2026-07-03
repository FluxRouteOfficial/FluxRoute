import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose';
import { existsSync, readFileSync } from 'fs';

function readPem(name: 'JWT_PRIVATE_KEY' | 'JWT_PUBLIC_KEY', pathName: 'JWT_PRIVATE_KEY_PATH' | 'JWT_PUBLIC_KEY_PATH') {
  const inline = process.env[name]?.trim();
  if (inline) return inline.replace(/\\n/g, '\n');

  const filePath = process.env[pathName]?.trim();
  if (!filePath) {
    throw new Error(`${name} or ${pathName} must be configured`);
  }
  if (!existsSync(filePath)) {
    throw new Error(`${pathName} points to a missing file: ${filePath}`);
  }
  return readFileSync(filePath, 'utf-8');
}

const privateKeyPem = readPem('JWT_PRIVATE_KEY', 'JWT_PRIVATE_KEY_PATH');
const publicKeyPem = readPem('JWT_PUBLIC_KEY', 'JWT_PUBLIC_KEY_PATH');

const privateKey = await importPKCS8(privateKeyPem, 'RS256');
const publicKey = await importSPKI(publicKeyPem, 'RS256');

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(process.env.JWT_ISSUER || 'fluxroute.xyz')
    .setExpirationTime(process.env.JWT_EXPIRY || '1h')
    .setIssuedAt()
    .sign(privateKey);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, publicKey, { issuer: process.env.JWT_ISSUER || 'fluxroute.xyz' });
  return payload;
}
