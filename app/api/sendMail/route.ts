import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface MailRequestBody {
    to: string;
    firstName: string;
    likedBy: string;
    social_media: string;
    SiteURL: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { to, firstName, likedBy, social_media, SiteURL }: MailRequestBody = req.body;

    if (!to || !firstName || !likedBy || !social_media || !SiteURL) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    const mailgunDomain = "auth.stunite.tech";
    const mailgunApiKey = process.env.MAILGUN_API_KEY as string;

    if (!mailgunApiKey) {
        return res.status(500).json({ error: "Mailgun API key is missing" });
    }

    try {
        const response = await axios.post(
            `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
            new URLSearchParams({
                from: "Mailgun Sandbox <postmaster@auth.stunite.tech>",
                to,
                subject: `Hey ${firstName}, You Might Have a New Friend!`,
                template: "like_alert",
                "h:X-Mailgun-Variables": JSON.stringify({
                    FirstName: firstName,
                    LikedBy: likedBy,
                    social_media: social_media,
                    SiteURL: SiteURL,
                }),
            }),
            {
                auth: {
                    username: "api",
                    password: mailgunApiKey,
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return res.status(200).json({ message: "Email sent successfully!", data: response.data });
    } catch (error: any) {
        return res.status(500).json({
            error: "Error sending email",
            details: error.response?.data || error.message,
        });
    }
}
