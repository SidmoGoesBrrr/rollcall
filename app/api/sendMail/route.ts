import { NextResponse } from "next/server";
import axios from "axios";

interface MailRequestBody {
  to: string;
  firstName: string;
  likedBy: string;
  social_media: string;
  SiteURL: string;
}

export async function POST(request: Request) {
  const body: MailRequestBody = await request.json();

  const { to, firstName, likedBy, social_media, SiteURL } = body;

  if (!to || !firstName || !likedBy || !social_media || !SiteURL) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const mailgunDomain = "auth.stunite.tech";
  const mailgunApiKey = process.env.MAILGUN_API_KEY as string;

  if (!mailgunApiKey) {
    return NextResponse.json(
      { error: "Mailgun API key is missing" },
      { status: 500 }
    );
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

    return NextResponse.json(
      { message: "Email sent successfully!", data: response.data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Error sending email",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
