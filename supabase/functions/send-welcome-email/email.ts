// The "Welcome to Fractional First" email (ff-workspace#43). Copy is Daniel's
// approved text from ff-workspace#15 ("Welcome email: approved copy", 12 Oct) —
// keep it verbatim; change it there first.

export const SUBJECT = "Welcome to Fractional First";
export const CTA_LABEL = "Complete your onboarding";
// /dashboard sends a signed-in talent to their next onboarding step, and a
// signed-out one to /login.
export const CTA_URL = "https://talent.fractionalfirst.com/dashboard";
export const LINKEDIN_URL = "https://www.linkedin.com/company/fractionalfirst/";
export const WEBSITE_URL = "https://www.fractionalfirst.com";

const BRAND = "#449889"; // talentflow --primary

type Section = { heading?: string; paragraphs: string[] };

const INTRO: string[] = [
  "Welcome to Fractional First. I'm delighted to have you as part of our growing global network of senior leaders.",
  "Fractional First brings together experienced operators who want to apply what they have learned to meaningful business challenges, whether through fractional, interim, advisory or full-time roles. At its heart, we are a community of operators helping operators.",
  "Our onboarding journey comprises three short steps, each of which should take only a few minutes. If you haven't completed them yet, we encourage you to do so:",
];

const STEPS: Section[] = [
  {
    heading: "Publish your profile",
    paragraphs: [
      "This confirms that you have reviewed your profile, made any necessary edits, and are comfortable with how it reflects your experience, distinctive strengths, working style and approach to leadership. Your published profile becomes our agreed source of truth.",
      "Publishing your profile does not suggest that you are actively seeking or open to a new role. Many leaders publish their profiles even when they are not currently available.",
    ],
  },
  {
    heading: "Set your role preferences",
    paragraphs: [
      "This helps us understand the types of roles and engagements you would consider, your availability, location preferences, where you are eligible to work, and the contexts in which you would most like to contribute.",
    ],
  },
  {
    heading: "Accept your agreement with Fractional First",
    paragraphs: [
      "This allows us to connect you with relevant opportunities that are a strong fit. It also reduces paperwork by serving as the umbrella agreement for future engagements through Fractional First.",
    ],
  },
];

const AFTER_STEPS: Section[] = [
  {
    paragraphs: [
      "Once all three steps are complete, your onboarding is complete and our team can begin considering you for relevant opportunities.",
      "Our aim is to connect you with meaningful business challenges where your experience is relevant and you can make a real contribution.",
    ],
  },
  {
    heading: "A note on discretion",
    paragraphs: [
      "We treat every conversation and potential introduction with the utmost discretion. Before sharing your profile or making an introduction, we will always confirm that you are interested, available and ready to proceed. We apply the same care to confidential client searches.",
    ],
  },
  {
    heading: "Looking ahead",
    paragraphs: [
      "We're exploring new ways to support our network beyond individual engagements, including peer communities, specialist guilds, workshops, and individual and group coaching.",
      "We'd love to hear what would be most valuable to you as a member of the Fractional First community. Simply reply to this email and share your thoughts. We're building this together, and your perspective matters.",
    ],
  },
  { paragraphs: ["Welcome aboard."] },
];

const SIGN_OFF = ["Warmly,", "Reza Behnam", "Founder and CEO", "On behalf of the Fractional First team"];

export function greeting(firstName: string | null | undefined): string {
  const name = firstName?.trim();
  return name ? `Hi ${name},` : "Hi there,";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const P = 'style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1A1A1A;"';
const H = 'style="margin:24px 0 8px;font-size:16px;line-height:1.4;font-weight:700;color:#1A1A1A;"';

function sectionHtml({ heading, paragraphs }: Section): string {
  return (heading ? `<p ${H}>${escapeHtml(heading)}</p>` : "") +
    paragraphs.map((p) => `<p ${P}>${escapeHtml(p)}</p>`).join("");
}

function sectionText({ heading, paragraphs }: Section): string {
  return [heading?.toUpperCase(), ...paragraphs].filter(Boolean).join("\n\n");
}

export function renderWelcomeEmail(firstName: string | null | undefined): { subject: string; html: string; text: string } {
  const hi = greeting(firstName);

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${SUBJECT}</title></head>
<body style="margin:0;padding:0;background:#F9F9F9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9F9F9;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:8px;font-family:Urbanist,'Helvetica Neue',Arial,sans-serif;">
<tr><td style="padding:32px 32px 8px;font-size:20px;font-weight:700;color:${BRAND};">Fractional First</td></tr>
<tr><td style="padding:16px 32px 32px;">
<p ${P}>${escapeHtml(hi)}</p>
${INTRO.map((p) => `<p ${P}>${escapeHtml(p)}</p>`).join("\n")}
${STEPS.map(sectionHtml).join("\n")}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-radius:6px;background:${BRAND};">
<a href="${CTA_URL}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;">${CTA_LABEL}</a>
</td></tr></table>
${AFTER_STEPS.map(sectionHtml).join("\n")}
<p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:#1A1A1A;">${SIGN_OFF.map(escapeHtml).join("<br>")}</p>
<p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#6B6B6B;"><a href="${LINKEDIN_URL}" style="color:${BRAND};">LinkedIn</a> &middot; <a href="${WEBSITE_URL}" style="color:${BRAND};">fractionalfirst.com</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    hi,
    ...INTRO,
    ...STEPS.map(sectionText),
    `${CTA_LABEL}: ${CTA_URL}`,
    ...AFTER_STEPS.map(sectionText),
    SIGN_OFF.join("\n"),
    `LinkedIn: ${LINKEDIN_URL}\nWebsite: ${WEBSITE_URL}`,
  ].join("\n\n");

  return { subject: SUBJECT, html, text };
}
