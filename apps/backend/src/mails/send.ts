import { getLogger } from 'logger'
import nodemailer from 'nodemailer'

import { ProcessedBlueprintResult } from '../definitions/processes'
import { getInfo } from '../helpers/system'
import {
    BlueprintMailTemplateContext,
    aggregateBlueprintResults,
    compileBlueprintsHtml,
} from './mailTemplates'

const logger = getLogger('backend')

export const MAIL_TRANSPORTER = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT ? Number.parseInt(process.env.MAIL_PORT) : 465,
    secure: process.env.MAIL_SECURE ? Boolean(process.env.MAIL_SECURE) : true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: Boolean(process.env.MAIL_TSL_REJECT_UNAUTHORIZED),
    },
})

export const sendProcessedBlueprintResults = async (
    results: ProcessedBlueprintResult[]
): Promise<void> => {
    try {
        // TODO verify once
        // const connectionVerified = await MAIL_TRANSPORTER.verify();
        // if (connectionVerified) {
        const sender = process.env.MAIL_BLUEPRINT_SENDER
        const receivers = process.env.MAIL_BLUEPRINT_RECEIVERS
        const subject = process.env.MAIL_BLUEPRINT_SUBJECT
        const templateContext = {
            date: new Date(),
            database: getInfo().db!,
            resultsAggregate: aggregateBlueprintResults(results),
        } satisfies BlueprintMailTemplateContext

        const mail = {
            from: sender,
            to: receivers,
            subject,
            html: compileBlueprintsHtml(templateContext),
        }

        const sendingResult = await MAIL_TRANSPORTER.sendMail(mail)
        logger.debug(sendingResult)
        // }
    } catch (error) {
        logger.error(error)
    }
}
