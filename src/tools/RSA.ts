import { Buffer } from 'buffer/';
import * as crypto from 'crypto-browserify';

export class RsaService {
  private privateKey: string;
  private publicKey: string;
  private enabled: boolean;

  constructor() {
    this.privateKey = process.env.RSA_PRIVATE_KEY;
    this.publicKey = process.env.RSA_PUBLIC_KEY;
    this.enabled = Boolean(+process.env.RSA_ENABLED);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  encrypt(plaintext: string): string {
    if (!this.enabled) return plaintext;

    // eslint-disable-next-line security/detect-new-buffer
    let buffer = new Buffer(plaintext);
    let encrypted = crypto.privateEncrypt(this.privateKey, buffer);

    return encrypted.toString('base64');
  }

  decrypt(cypher: string): string {
    if (!this.enabled) return cypher;

    let buffer = Buffer.from(cypher, 'base64');
    let plaintext = crypto.publicDecrypt(this.publicKey, buffer);

    return plaintext.toString('utf8');
  }
}
