import { headers } from "next/headers";
import { Webhook } from "svix";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: { type: string; data: { email_addresses: { email_address: string }[]; first_name?: string } };
  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof event;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created") {
    const email = event.data.email_addresses?.[0]?.email_address;
    const firstName = event.data.first_name ?? "Explorer";

    if (email) {
      await resend.emails.send({
        from: "CashQuest <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to CashQuest! Here's how to get started 🎮",
        html: buildWelcomeEmail(firstName),
      });
    }
  }

  return new Response("OK", { status: 200 });
}

function buildWelcomeEmail(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to CashQuest</title>
</head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">🪙</div>
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Welcome to CashQuest!</h1>
              <p style="margin:8px 0 0;color:#bbf7d0;font-size:15px;">Your financial literacy adventure starts now</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <p style="margin:0 0 24px;color:#166534;font-size:16px;font-weight:600;">Hey ${name}! 👋</p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                You've just unlocked CashQuest — the game that teaches you real money skills through missions, simulations, and challenges. Here's everything you need to know to get started:
              </p>

              <!-- Section: How it works -->
              <h2 style="margin:0 0 16px;color:#15803d;font-size:18px;font-weight:700;">🗺️ How CashQuest Works</h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#f0fdf4;border-radius:12px;padding:16px 20px;border-left:4px solid #16a34a;margin-bottom:12px;">
                    <p style="margin:0;color:#166534;font-weight:700;font-size:14px;">📚 Learn Path</p>
                    <p style="margin:4px 0 0;color:#374151;font-size:13px;line-height:1.5;">Complete bite-sized lessons on Credit, Taxes, and Budgeting. Answer quizzes correctly to earn XP and Arcade Tokens.</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#faf5ff;border-radius:12px;padding:16px 20px;border-left:4px solid #9333ea;">
                    <p style="margin:0;color:#6b21a8;font-weight:700;font-size:14px;">🏠 Life Simulator</p>
                    <p style="margin:4px 0 0;color:#374151;font-size:13px;line-height:1.5;">Live a virtual financial life. Manage your salary, pay bills, handle surprise events (flat tire? medical bill?), and try not to go bankrupt!</p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#fffbeb;border-radius:12px;padding:16px 20px;border-left:4px solid #f59e0b;">
                    <p style="margin:0;color:#92400e;font-weight:700;font-size:14px;">🕹️ Mini-Game Arcade</p>
                    <p style="margin:4px 0 0;color:#374151;font-size:13px;line-height:1.5;">Spend your earned tokens on 7 fast-paced games: Budget Blitz, Credit Climb, Tax Trivia, and more. Build streaks to multiply your score!</p>
                  </td>
                </tr>
              </table>

              <!-- Tips -->
              <h2 style="margin:0 0 16px;color:#15803d;font-size:18px;font-weight:700;">⚡ Quick Tips</h2>
              <ul style="margin:0 0 32px;padding-left:20px;color:#374151;font-size:14px;line-height:2;">
                <li>Start with the <strong>Learn Path</strong> to earn your first Arcade Tokens</li>
                <li>Log in every day to keep your <strong>streak alive</strong> and earn bonus XP</li>
                <li>In the Life Simulator, always keep an <strong>emergency fund</strong> — life is unpredictable!</li>
                <li>Combo multipliers in the Arcade can <strong>triple your score</strong> — stay on a streak</li>
              </ul>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://cashquest-two.vercel.app/dashboard"
                       style="display:inline-block;background:#16a34a;color:#ffffff;font-weight:800;font-size:16px;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                      Start Playing →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">
                All game content and financial advice is for educational purposes only and does not constitute professional financial advice.<br/>
                © 2026 CashQuest — Team #4
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
