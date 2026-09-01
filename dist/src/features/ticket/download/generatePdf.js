import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { Status } from "../../../generated/prisma/enums.js";
export async function generateTicketPDF(ticket, hostUrl) {
    const doc = new PDFDocument({
        size: "A4",
        margin: 0,
    });
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    // --------------------------------------------------
    // COLORS & PALETTE — dark theme
    // --------------------------------------------------
    const pageBg = "#0B1120";
    const cardBg = "#151E32";
    const cardBorder = "#26314A";
    const primary = "#F1F5F9";
    const secondary = "#94A3B8";
    const muted = "#5B6B85";
    const accent = "#6366F1";
    const accentSoft = "#1E2540";
    const accentBorder = "#33396B";
    const successBg = "#0F2E1E";
    const successFg = "#4ADE80";
    const pendingBg = "#3A2A0C";
    const pendingFg = "#FBBF24";
    const cancelledBg = "#3A1414";
    const cancelledFg = "#F87171";
    const watermarkPath = path.join(process.cwd(), "src", "assets", "icon.png");
    // --------------------------------------------------
    // 1. PAGE BACKGROUND
    // --------------------------------------------------
    doc.rect(0, 0, pageWidth, pageHeight).fill(pageBg);
    // --------------------------------------------------
    // 2. WATERMARK — top-right corner of the PAGE, clear of the card
    // --------------------------------------------------
    const wmSize = 70;
    const wmMargin = 24;
    const wmX = pageWidth - wmSize - wmMargin;
    const wmY = wmMargin;
    if (fs.existsSync(watermarkPath)) {
        try {
            doc.image(watermarkPath, wmX, wmY, {
                width: wmSize,
                height: wmSize,
                opacity: 0.9,
            });
        }
        catch (e) {
            console.error("❌ Failed to render page watermark:", e);
        }
    }
    // --------------------------------------------------
    // 3. MAIN TICKET CARD — starts below the watermark row
    // --------------------------------------------------
    const cardX = 55;
    const cardY = wmY + wmSize + 26;
    const cardWidth = pageWidth - 110;
    const cardHeight = 570;
    doc
        .roundedRect(cardX - 2, cardY + 4, cardWidth + 4, cardHeight, 20)
        .fill("#050810");
    doc
        .roundedRect(cardX, cardY, cardWidth, cardHeight, 20)
        .fill(cardBg)
        .strokeColor(cardBorder)
        .lineWidth(1)
        .stroke();
    // --------------------------------------------------
    // HEADER
    // --------------------------------------------------
    const headerHeight = 84;
    doc.save();
    doc.roundedRect(cardX, cardY, cardWidth, headerHeight, 20).clip();
    doc.rect(cardX, cardY, cardWidth, headerHeight).fill(accent);
    doc.restore();
    doc.rect(cardX, cardY + headerHeight - 4, cardWidth, 4).fill("#4338CA");
    doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#E0E7FF")
        .text("OFFICIAL EVENT PASS", cardX + 40, cardY + 20, { characterSpacing: 1.5 });
    doc
        .fontSize(19)
        .font("Helvetica-Bold")
        .fillColor("#FFFFFF")
        .text(ticket.event.name, cardX + 40, cardY + 37, {
        width: cardWidth - 80,
        height: 30,
        ellipsis: true,
    });
    // --------------------------------------------------
    // TICKET META (ID & Status Badge)
    // --------------------------------------------------
    const metaY = cardY + headerHeight + 26;
    doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor(secondary)
        .text("TICKET REFERENCE", cardX + 40, metaY, { characterSpacing: 1 });
    doc
        .fontSize(15)
        .font("Helvetica-Bold")
        .fillColor(primary)
        .text(`#TK-${ticket.id.toString().padStart(6, "0")}`, cardX + 40, metaY + 14);
    const statusText = StatusText(ticket.status);
    const badgeWidth = 100;
    const badgeHeight = 26;
    const badgeX = cardX + cardWidth - badgeWidth - 40;
    const badgeY = metaY;
    const { bg: badgeBg, fg: badgeFg } = badgeColors(ticket.status, { successBg, successFg, pendingBg, pendingFg, cancelledBg, cancelledFg });
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2).fill(badgeBg);
    doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor(badgeFg)
        .text(statusText, badgeX, badgeY + 8, {
        width: badgeWidth,
        align: "center",
    });
    // --------------------------------------------------
    // DIVIDER
    // --------------------------------------------------
    doc
        .moveTo(cardX + 40, metaY + 56)
        .lineTo(cardX + cardWidth - 40, metaY + 56)
        .strokeColor(cardBorder)
        .lineWidth(1)
        .stroke();
    // --------------------------------------------------
    // ATTENDEE SECTION
    // --------------------------------------------------
    const attendeeY = metaY + 74;
    doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor(secondary)
        .text("REGISTERED ATTENDEE", cardX + 40, attendeeY, { characterSpacing: 1 });
    doc
        .fontSize(16)
        .font("Helvetica-Bold")
        .fillColor(primary)
        .text(ticket.name, cardX + 40, attendeeY + 17);
    doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(secondary)
        .text(ticket.email, cardX + 40, attendeeY + 40);
    doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor(secondary)
        .text(`Phone: ${ticket.phone}`, cardX + 40, attendeeY + 56);
    // --------------------------------------------------
    // EVENT LOGISTICS
    // --------------------------------------------------
    const logisticsY = attendeeY + 92;
    doc
        .roundedRect(cardX + 40, logisticsY, cardWidth - 80, 76, 12)
        .fill(accentSoft)
        .strokeColor(accentBorder)
        .lineWidth(0.5)
        .stroke();
    doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor("#A5B4FC")
        .text("DATE & TIME", cardX + 60, logisticsY + 16, { characterSpacing: 0.5 });
    doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor(primary)
        .text(formatDate(ticket.event.date), cardX + 60, logisticsY + 32, {
        width: 210,
    });
    doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor("#A5B4FC")
        .text("VENUE / LOCATION", cardX + 280, logisticsY + 16, { characterSpacing: 0.5 });
    doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor(primary)
        .text(ticket.event.place, cardX + 280, logisticsY + 32, {
        width: cardWidth - 320,
        ellipsis: true,
    });
    // --------------------------------------------------
    // QR CODE — white tile, watermark logo centered on top
    // --------------------------------------------------
    const qrSize = 85;
    const qrPad = 10;
    const qrX = cardX + cardWidth - qrSize - 40 - qrPad;
    const qrY = logisticsY + 98;
    doc
        .roundedRect(qrX - qrPad, qrY - qrPad, qrSize + qrPad * 2, qrSize + qrPad * 2, 10)
        .fill("#FFFFFF");
    try {
        const targetUrl = `${hostUrl}/verify/ticket/${ticket.id}`;
        const qrBuffer = await QRCode.toBuffer(targetUrl, {
            width: 220,
            margin: 1,
            errorCorrectionLevel: "H", // required so the QR still scans with a logo covering the center
            color: {
                dark: "#0F172A",
                light: "#FFFFFF",
            },
        });
        doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
        // --- centered watermark logo on top of the QR code ---
        if (fs.existsSync(watermarkPath)) {
            const logoSize = qrSize * 0.22; // ~22% of QR width — safe zone for H-level EC
            const logoX = qrX + (qrSize - logoSize) / 2;
            const logoY = qrY + (qrSize - logoSize) / 2;
            // white backing plate so the logo stays crisp against dark modules
            const platePad = 3;
            doc
                .roundedRect(logoX - platePad, logoY - platePad, logoSize + platePad * 2, logoSize + platePad * 2, 4)
                .fill("#FFFFFF");
            doc.image(watermarkPath, logoX, logoY, {
                width: logoSize,
                height: logoSize,
            });
        }
    }
    catch (err) {
        console.error("Failed to generate QR code for PDF:", err);
    }
    doc
        .fontSize(8)
        .font("Helvetica-Bold")
        .fillColor(primary)
        .text("SCAN TO VERIFY", cardX + 40, qrY + 18);
    doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(secondary)
        .text("Present this pass at entry", cardX + 40, qrY + 32, { width: 190 });
    // --------------------------------------------------
    // FOOTERS
    // --------------------------------------------------
    doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(secondary)
        .text("This pass is strictly non-transferable. Valid photo ID may be required.", cardX + 40, cardY + cardHeight - 32, { width: cardWidth - 80 });
    doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor(muted)
        .text("Secure Event Ticketing Engine • Powered by EventPulse", 0, pageHeight - 32, {
        width: pageWidth,
        align: "center",
    });
    return doc;
}
function formatDate(date) {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}
function StatusText(status) {
    switch (status) {
        case Status.PENDING:
            return "PENDING";
        case Status.CONFIRMED:
            return "CONFIRMED";
        case Status.CANCELLED:
            return "CANCELLED";
        default:
            return "CONFIRMED";
    }
}
function badgeColors(status, palette) {
    switch (status) {
        case Status.PENDING:
            return { bg: palette.pendingBg, fg: palette.pendingFg };
        case Status.CANCELLED:
            return { bg: palette.cancelledBg, fg: palette.cancelledFg };
        case Status.CONFIRMED:
        default:
            return { bg: palette.successBg, fg: palette.successFg };
    }
}
