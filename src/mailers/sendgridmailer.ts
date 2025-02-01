import * as fs from 'fs';
import * as path from 'path';
import * as sgMail from '@sendgrid/mail';
import { ENV } from '../config/env';
import * as MAILER_CONFIG from '../config/mailer';

interface SendGridConfig {
    email: string;
    subject: string;
    templateName: string;
    paramFunc: (html: string) => string;
}

const SendGridMailer = async (config: SendGridConfig): Promise<void> => {
    sgMail.setApiKey(ENV.SENDGRID_API_KEY);
    console.log(config.email)
    console.log(config.subject)

    const htmlTemplate = fs.readFileSync(
        path.resolve(__dirname, '../' + MAILER_CONFIG.TEMPLATE_PATH + config.templateName),
        'utf8'
    );

    const processedHtml = config.paramFunc(htmlTemplate);

    const msg = {
        to: config.email,
        from: {
            name: MAILER_CONFIG.SENDER_NAME,
            email: ENV.MAIL_USER,
        },
        subject: config.subject,
        html: processedHtml,
        attachments: [
            {
                filename: 'logo.png',
                content: fs.readFileSync(
                    path.resolve(__dirname, '../../public/logo.png')
                ).toString('base64'),
                type: 'image/png',
                disposition: 'inline',
                content_id: 'logo'
            }
        ]
    };

    await sgMail.send(msg);
};

export default SendGridMailer;