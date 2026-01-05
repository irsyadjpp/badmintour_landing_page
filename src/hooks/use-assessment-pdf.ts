
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export interface AssessmentReportData {
  coachName: string;
  moduleTitle: string;
  level: string;
  totalScore: number;
  scores: {
    biomechanics?: number;
    footwork?: number;
    strokeQuality?: number;
    offense?: number;
    defense?: number;
    gameIQ?: number;
    physique?: number;
    [key: string]: number | undefined;
  };
  notes: string;
  aiFeedback?: string;
  skillAnalysis?: Record<string, string>;
  strengths?: string;
  weaknesses?: string;
  date: string;
}

export function useAssessmentPdf() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPdf = async (report: AssessmentReportData, chartElementId: string, filename: string) => {
    setIsGenerating(true);
    try {
      const chartElement = document.getElementById(chartElementId);
      if (!chartElement) {
        console.error(`Chart Element with id ${chartElementId} not found`);
        return;
      }

      // 1. Capture Light Mode Radar Chart
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const chartImgData = canvas.toDataURL('image/png');

      // 2. Initialize PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = 20;

      // 3. Branding - Logo (Scaled Down)
      // 3. Branding - Logo (Scaled Down & Aspect Ratio Preserved)
      try {
        const logoUrl = window.location.origin + '/images/logo.png';
        const img = new Image();
        img.src = logoUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        if (img.width > 0) {
          const logoWidth = 8; // Width set to 8mm
          const aspectRatio = img.height / img.width;
          const logoHeight = logoWidth * aspectRatio;
          pdf.addImage(logoUrl, 'PNG', margin, 10, logoWidth, logoHeight);
        } else {
          // Fallback
          pdf.addImage(logoUrl, 'PNG', margin, 10, 8, 5.3);
        }
      } catch (e) {
        console.error("Logo load failed", e);
      }

      // 4. Header Text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16); // Slightly smaller title
      pdf.setTextColor(202, 31, 61); // #ca1f3d Red
      pdf.text("OFFICIAL ASSESSMENT REPORT", pageWidth - margin, 20, { align: 'right' });

      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text(`Generated: ${format(new Date(), 'dd MMM yyyy')}`, pageWidth - margin, 25, { align: 'right' });

      yPos = 35; // Start earlier

      // 5. Watermark (Diagonal)
      // @ts-ignore
      const gState = new pdf.GState({ opacity: 0.1 });
      pdf.setGState(gState);
      pdf.setFontSize(50);
      pdf.setTextColor(128, 128, 128);
      pdf.text("BADMINTOUR OFFICIAL", pageWidth / 2, pageHeight / 2, {
        align: 'center',
        baseline: 'middle',
        angle: 45
      });
      // @ts-ignore
      pdf.setGState(new pdf.GState({ opacity: 1.0 }));


      // 6. Report Metadata
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text(report.moduleTitle.toUpperCase(), margin, yPos);
      yPos += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60);
      pdf.text(`Level: ${report.level}  |  Coach: ${report.coachName}  |  Date: ${report.date}`, margin, yPos);

      yPos += 5;
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // 7. Embed Radar Chart (Center)
      const chartWidth = 90; // mm (smaller chart)
      const chartHeight = 63;
      const chartX = (pageWidth - chartWidth) / 2;

      pdf.addImage(chartImgData, 'PNG', chartX, yPos, chartWidth, chartHeight);
      yPos += chartHeight + 5;

      // 8. Scores Breakdown (7 Parameters)
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(0);
      pdf.text("SKILL BREAKDOWN", margin, yPos);
      yPos += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);

      const scoreItems = [
        { id: 'biomechanics', label: "Biomechanics (Grip & Wrist)", val: report.scores.biomechanics || 0 },
        { id: 'footwork', label: "Footwork (Speed & Agility)", val: report.scores.footwork || 0 },
        { id: 'strokeQuality', label: "Strokes (Accuracy)", val: report.scores.strokeQuality || 0 },
        { id: 'offense', label: "Offense (Attack Power)", val: report.scores.offense || 0 },
        { id: 'defense', label: "Defense (Reflexes)", val: report.scores.defense || 0 },
        { id: 'gameIQ', label: "Tactics (Game Read)", val: report.scores.gameIQ || 0 },
        { id: 'physique', label: "Physique (Endurance)", val: report.scores.physique || 0 },
      ];

      // Two columns for scores
      const col1X = margin;
      const col2X = pageWidth / 2 + 10;
      let scoresY = yPos;

      scoreItems.forEach((item, index) => {
        const xPos = index % 2 === 0 ? col1X : col2X;
        if (index > 0 && index % 2 === 0) scoresY += 5;

        pdf.text(`${item.label}:`, xPos, scoresY);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${item.val}/5`, xPos + 55, scoresY);
        pdf.setFont('helvetica', 'normal');
      });

      yPos = scoresY + 12;

      // 9. Strengths & Weaknesses (Grid)
      const halfPage = (pageWidth - (margin * 2)) / 2;

      // Strengths
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 163, 74); // Green
      pdf.text("STRENGTHS (KEKUATAN)", margin, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50);
      const strText = pdf.splitTextToSize(report.strengths || "-", halfPage - 5);
      pdf.text(strText, margin, yPos + 5);

      // Weaknesses
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(202, 31, 61); // Red
      pdf.text("WEAKNESSES (KELEMAHAN)", pageWidth / 2 + 5, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50);
      const weakText = pdf.splitTextToSize(report.weaknesses || "-", halfPage - 5);
      pdf.text(weakText, pageWidth / 2 + 5, yPos + 5);

      yPos += Math.max(strText.length, weakText.length) * 5 + 10;

      // 10. HEAD COACH SUMMARY (Using AI Feedback content but rebranded)
      if (report.aiFeedback) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0); // Black
        pdf.text("HEAD COACH SUMMARY", margin, yPos);
        yPos += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        const summaryText = pdf.splitTextToSize(report.aiFeedback.replace(/AI/g, "Coach"), pageWidth - (margin * 2));
        pdf.text(summaryText, margin, yPos);
        yPos += (summaryText.length * 5) + 10;
      }

      // 11. Detailed Skill Analysis (Renamed from AI Generated)
      if (report.skillAnalysis) {
        // Check page break
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0);
        pdf.setFontSize(11);
        pdf.text("DETAILED SKILL ANALYSIS", margin, yPos);
        yPos += 6;

        pdf.setFontSize(8);
        scoreItems.forEach((item) => {
          const analysisText = report.skillAnalysis?.[item.id];
          if (analysisText) {
            // Check page break
            if (yPos > pageHeight - 20) {
              pdf.addPage();
              yPos = 20;
            }

            pdf.setFont('helvetica', 'bold');
            pdf.text(`• ${item.label.split('(')[0].trim()}:`, margin, yPos);

            pdf.setFont('helvetica', 'normal');
            const cleanAnalysis = analysisText.replace(/AI/g, "Coach"); // Remove mentions of AI in text too
            const desc = pdf.splitTextToSize(cleanAnalysis, pageWidth - margin - 50);
            pdf.text(desc, margin + 40, yPos);

            yPos += (desc.length * 4) + 2;
          }
        });
        yPos += 5;
      }

      // Check page break for Final Notes
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = 20;
      }

      // 11. Coach Validation Note
      pdf.setDrawColor(200);
      pdf.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(80);
      const notes = pdf.splitTextToSize(`"${report.notes}"`, pageWidth - (margin * 2) - 10);
      pdf.text(notes, margin + 5, yPos + 8);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text(`- Coach ${report.coachName}`, pageWidth - margin - 10, yPos + 20, { align: 'right' });


      // 12. Footer
      const currentYear = new Date().getFullYear();
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text(`© ${currentYear} Badmintour Indonesia. All Rights Reserved.`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save
      pdf.save(filename);

    } catch (err) {
      console.error("PDF Gen failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, downloadPdf };
}
