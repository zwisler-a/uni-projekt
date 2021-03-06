import { Response, Request } from 'express';
import { User, USER_PATCH } from '../models/user';
import { UserModel } from '../../database/models/user';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function receivingResetRequest(req: Request, res: Response) {
    const emailAddress = req.body.email;
    try {
        const user = await UserModel.getByEmail(emailAddress.trim());
        const payload = {
            id: user.id,
            email: user.email
        };
        // the secret contains the hash of the former password, thus it is not possible to use the same reset link again after password reset
        const secret = user.password + user.id + user.companyId;
        // the token expires after half an hour
        const token = generateToken(secret, '0.5h', payload);

        const resetLink = req.body.baseURL + '/' + payload.id + '/' + token;

        res.status(200).send();

        sendResetLinkViaEmail(emailAddress, user.name, resetLink);
    } catch (e) {
        console.log('Password reset requested by unknown email address (' + emailAddress + ')');
        res.status(404).send();
    }
}


export async function validate(req: Request, res: Response) {
    const token = req.body.token;
    const user = await UserModel.get(Number.parseInt(req.body['id']));
    const secret = user.password + user.id + user.companyId;

    jsonwebtoken.verify(token, secret, function (err: Error, data: any) {
        if (err) {
            res.status(400).json({success: false, message: 'Password reset token is invalid or expired'});
        } else {
            res.status(200).json({success: true, username: user.name});
        }
    });
}


export async function changePassword(req: Request, res: Response) {

    // let user: User = USER_PATCH.validate(req.body);
    const userId = Number.parseInt(req.body['id']);
    const user = await UserModel.get(userId);
    if (req.body['pass1'] == req.body['pass2']) {

        user.password = await bcrypt.hash(req.body['pass1'], 12);
    } else {
        return res.status(409).send;
    }

    try {
        await UserModel.update(user.id, user, user.companyId);
    } catch (e) {
        console.log(e);
    }

    sendConfirmationEmail(user.email, user.name);
    res.status(200).send();
}

function generateToken(secret: any, expiresIn: string, payload: any = {}) {
    return jsonwebtoken.sign(payload, secret, {expiresIn});
}

function sendResetLinkViaEmail(recipient: string, username: string, resetLink: string) {
    sendMail(recipient, 'Password help has arrived!', getResetLinkMailTemplate(username, resetLink));
}

function sendConfirmationEmail(recipient: string, username: string) {
    sendMail(recipient, 'Your Password has been changed.', getPasswordResetConfirmationTemplate(username));
}

function sendMail(recipient: string, subject: string, template: string) {
    const config = require('../../../config.json').mailer;
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        service: config.service,
        secure: config.secure,
        port: config.port,
        auth: {
            user: config.user,
            pass: config.pass
        },
        tls: {
            rejectUnauthorized: config.tlsRejectUnauthorized
        }
    });

    const mailData = {
        from: '"ak18b" ' + config.user,
        to: recipient,
        subject: subject,
        html: template
    };

    transporter.sendMail(mailData, (error: any, info: any) => {
        if (error) {
            return console.log(error);
        }
        // console.log(info);
    });
}

function getResetLinkMailTemplate(username: string, resetLink: string): string {
    return '<h3>Dear ' + username + ',</h3>' +
        '<p>You requested for a password reset, kindly use this <a href="' + resetLink + '">link</a>' +
        ' to reset your password</p>' +
        '<p>This password reset is only valid for the next 30 minutes.</p>';
}

function getPasswordResetConfirmationTemplate(username: string): string {
    return '<h3>Dear ' + username + ',</h3> ' +
        '<p>Your password has been successful reset, you can now login with your new password.</p>';
}
