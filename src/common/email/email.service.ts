import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, login: string, password: string) {
    const subject = 'Login Credentials for CRM';
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login credentials</title>
</head>
<body>
  <h1>Login Credentials for CRM</h1>
  <p>Your login: ${login}</p>
  <p>Your password: ${password}</p>
</body>
</html>`;
    
    return this.mailerService.sendMail({
      to,
      subject,
      html: htmlContent,
    });
  }
}
