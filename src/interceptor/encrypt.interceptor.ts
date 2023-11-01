import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const crypto = require('crypto');
require('dotenv').config();

export class EncryptInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    return next.handle().pipe(
      map((data: any) => {
        console.log('interceptor: ',data)
        // Run something before the response is sent out
        const encryptedBody = this.encryption(JSON.stringify(data.response));

        return {
          response: encryptedBody,
          status: data.status,
        };
      }),
    );
  }

  encryption(dataToEncrypt: string) {
    const secretKey = Buffer.from(process.env.AES_SECRET_KEY); // 32 bytes for AES-256

    // Create an AES-256-ECB cipher
    const cipher = crypto.createCipheriv('aes-256-ecb', secretKey, null);

    // Update the cipher with the data and finalize
    let encryptedData = cipher.update(dataToEncrypt, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    return encryptedData;
  }
}
