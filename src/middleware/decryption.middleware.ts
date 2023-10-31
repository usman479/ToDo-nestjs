import { NestMiddleware, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
// import NodeRSA from 'encrypt-rsa';
// const AesEncryption = require('aes-encryption');
const crypto = require('crypto');

const decryptionNotRequiredMethods = ['GET', 'DELETE'];

@Injectable()
export class DecryptionMiddleware implements NestMiddleware {
  // private NodeRSA = new NodeRSA();
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const privateKey = this.configService.get('AES_SECRET_KEY');

    // if methods are GET or DELETE then don't need to decrypt the body
    if (decryptionNotRequiredMethods.includes(req.method)) { 
      next();
    } else {
      if (!req.body.encrypted) {
        throw new Error('encrypted field required');
      }

      const decryptedBody = this.decryption(req.body.encrypted)

      req.body = JSON.parse(decryptedBody);

      next();
    }
  }

  decryption(dataToDecrypt: string) {
    const privateKey = this.configService.get('AES_SECRET_KEY');
    const secretKey = Buffer.from(privateKey)
    const decipher = crypto.createDecipheriv('aes-256-ecb', secretKey, null);

    let decryptedData = decipher.update(dataToDecrypt, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }
}
