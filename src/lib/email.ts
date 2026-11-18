import nodemailer from "nodemailer";

export interface TaskSummaryItem {
  key: string;
  title: string;
  status?: string;
  priority?: string;
  assigneeName?: string | null;
}

export interface ProjectEmailNotificationParams {
  toEmail: string;
  toName?: string | null;
  projectName: string;
  projectKey: string;
  projectId: string;
  description?: string | null;
  priority?: string | null;
  organizationName?: string | null;
  tasksCount?: number;
  subjectPrefix?: string;
  headline?: string;
  recipientRole?: string | null;
  tasksList?: TaskSummaryItem[];
}

/**
 * Resolve the public base URL for actionable notification links.
 * Prioritizes production deployment URL so email links are always functional.
 */
function getAppBaseUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  // Always use the registered production domain so Google OAuth callback never fails
  return "https://coresync-bay.vercel.app";
}

/**
 * Configure Nodemailer transport using Gmail SMTP or standard SMTP credentials.
 */
function getEmailTransporter() {
  const user = (process.env.GMAIL_USER || process.env.SMTP_USER || "").trim();
  const rawPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").trim();
  const pass = rawPass.replace(/\s+/g, "");

  if (!user || !pass) {
    return null;
  }

  // Create reusable transporter object using Google Gmail SMTP service
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

/**
 * Dispatch an enterprise project creation email to the Project Owner's Gmail inbox.
 * Gracefully logs and falls back if SMTP credentials are not yet configured in .env.
 */
export async function sendProjectCreatedEmail(params: ProjectEmailNotificationParams) {
  const {
    toEmail,
    toName,
    projectName,
    projectKey,
    projectId,
    description,
    priority,
    organizationName,
    tasksCount,
    recipientRole,
    tasksList,
  } = params;

  if (!toEmail) {
    console.warn("[CoreSync Email] No recipient email specified for project creation notification.");
    return { success: false, reason: "No recipient email" };
  }

  const transporter = getEmailTransporter();
  const baseUrl = getAppBaseUrl();
  const projectUrl = `${baseUrl}/dashboard/project/${projectId}`;
  const senderEmail = process.env.GMAIL_USER || process.env.SMTP_USER || "notifications@coresync.io";
  const priorityLabel = (priority || "MEDIUM").toUpperCase();
  const orgLabel = organizationName || "Global CyberTech Solutions";

  const subjectText = params.subjectPrefix
    ? `${params.subjectPrefix}: ${projectName} [${projectKey}]`
    : `⚡ [CoreSync] Project Notification: ${projectName} [${projectKey}]`;
  const headlineText = params.headline || "Project Workspace Overview";

  // If credentials are not set, log clean telemetry for previewing
  if (!transporter) {
    console.log("------------------------------------------------------------");
    console.log("[CoreSync Email Telemetry - Mock Dispatch]");
    console.log(`To: ${toName ? `${toName} <${toEmail}>` : toEmail}`);
    console.log(`Subject: ${subjectText}`);
    console.log(`Project URL: ${projectUrl}`);
    console.log(`Notice: Configure GMAIL_USER and GMAIL_APP_PASSWORD in .env to dispatch live emails.`);
    console.log("------------------------------------------------------------");

    return {
      success: true,
      delivered: false,
      simulated: true,
      reason: "GMAIL_USER or GMAIL_APP_PASSWORD not set in environment variables",
    };
  }

  // Enterprise HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CoreSync - Project Created</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06); overflow: hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; border-bottom: 3px solid #2563eb;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      ⚡ CoreSync <span style="font-size: 13px; font-weight: 500; color: #94a3b8; margin-left: 8px;">Enterprise</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: rgba(37, 99, 235, 0.25); color: #60a5fa; border: 1px solid #2563eb; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
                      Active
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Body -->
          <tr>
            <td style="padding: 32px 32px 20px 32px;">
              <div style="font-size: 13px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                ${headlineText}
              </div>
              <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; line-height: 1.3;">
                ${projectName}
              </h1>
              <p style="font-size: 14px; color: #475569; margin: 0 0 24px 0; line-height: 1.6;">
                Hello <strong>${toName || "Team Member"}</strong>, ${
                  recipientRole
                    ? `you have been allocated deliverables as <span style="display: inline-block; background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">${recipientRole}</span> on project <strong>${projectName}</strong> in <strong>${orgLabel}</strong>.`
                    : `this project briefing has been dispatched for <strong>${orgLabel}</strong>.`
                } Your allocated sprint tasks and workspace links are provided below.
              </p>

              <!-- Specs Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; width: 140px;">Project Key</td>
                        <td style="font-size: 14px; font-weight: 700; color: #1e293b;">
                          <span style="display: inline-block; font-family: monospace; background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 4px; border: 1px solid #c7d2fe;">
                            [${projectKey}]
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; width: 140px;">Priority</td>
                        <td style="font-size: 13px; font-weight: 700; color: ${priorityLabel === "URGENT" || priorityLabel === "HIGH" ? "#dc2626" : "#2563eb"};">
                          ${priorityLabel}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                ${tasksCount !== undefined && tasksCount > 0 ? `
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; width: 140px;">Sprint Backlog</td>
                        <td style="font-size: 13px; font-weight: 700; color: #059669;">
                          ${tasksCount} Autonomous Work Items Generated
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>` : ""}

                ${description ? `
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; width: 140px; vertical-align: top;">Description</td>
                        <td style="font-size: 13px; color: #334155; line-height: 1.5;">
                          ${description}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>` : ""}
              </table>

              <!-- Role-Specific Split Task Backlog Table (MNC Enterprise) -->
              ${tasksList && tasksList.length > 0 ? `
              <div style="margin-bottom: 28px;">
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">
                  📋 Allocated Work Items (${tasksList.length})
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; font-size: 12px; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f1f5f9; text-align: left; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1;">
                      <th style="padding: 10px 12px; width: 85px;">Key</th>
                      <th style="padding: 10px 12px;">Task Description</th>
                      <th style="padding: 10px 12px; width: 85px;">Priority</th>
                      <th style="padding: 10px 12px; width: 95px;">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tasksList.map((t, idx) => `
                      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-top: 1px solid #e2e8f0;">
                        <td style="padding: 10px 12px; font-family: monospace; font-weight: bold; color: #2563eb;">${t.key}</td>
                        <td style="padding: 10px 12px; color: #1e293b; font-weight: 500;">${t.title}</td>
                        <td style="padding: 10px 12px; font-weight: 600; color: ${t.priority === 'URGENT' || t.priority === 'HIGH' ? '#dc2626' : '#2563eb'};">${t.priority || 'MEDIUM'}</td>
                        <td style="padding: 10px 12px; color: #64748b; font-weight: 500;">${t.status || 'TODO'}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
              ` : ""}

              <!-- Call to Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${projectUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35); letter-spacing: 0.2px;">
                      Open Project Board & Tasks &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <div style="text-align: center; margin-top: 16px;">
                <span style="font-size: 12px; color: #94a3b8;">
                  Direct link: <a href="${projectUrl}" style="color: #2563eb; text-decoration: underline;">${projectUrl}</a>
                </span>
              </div>
            </td>
          </tr>

          <!-- Footer Security & Telemetry -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0; line-height: 1.5;">
                This notification was sent to <strong>${toEmail}</strong> regarding your project ownership in CoreSync.
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                Deterministic AI Governance &bull; Multi-Tenant Isolation Verified &bull; SOC2 Type II Aligned
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"CoreSync Notifications" <${senderEmail}>`,
      to: toEmail,
      subject: subjectText,
      text: `Hello ${toName || "Owner"},\n\nYour project "${projectName}" [${projectKey}] status has been updated in CoreSync.\n\nOpen your project board: ${projectUrl}\n\nOrganization: ${orgLabel}\nPriority: ${priorityLabel}\n\nCoreSync Enterprise Platform`,
      html: htmlContent,
    });

    console.log(`[CoreSync Email] Successfully delivered project creation notification to ${toEmail}. MessageId: ${info.messageId}`);
    return { success: true, delivered: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[CoreSync Email] Failed to send email via Gmail SMTP:", error);
    return {
      success: false,
      delivered: false,
      error: error.message || "Failed to dispatch email",
    };
  }
}
