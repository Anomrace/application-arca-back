import fs from "fs";
import PDFDocument from "pdfkit";
import { SwissQRBill } from "swissqrbill/pdf";
import { mm2pt } from "swissqrbill/utils";

// 📌 Fonction pour générer une facture PDF avec QR-bill
export async function generateInvoice(invoiceData) {
  return new Promise((resolve, reject) => {
    console.log("📤 Données reçues pour générer la facture :", invoiceData);

    // Vérifier que toutes les données requises sont présentes
    if (
      !invoiceData.amount ||
      !invoiceData.creditor ||
      !invoiceData.debtor ||
      !invoiceData.reference
    ) {
      return reject(
        new Error("❌ Données incomplètes pour générer le QR-bill.")
      );
    }

    // Conversion de invoiceData.amount en nombre
    const amount = parseFloat(invoiceData.amount);
    if (isNaN(amount)) {
      return reject(new Error("❌ Le montant fourni est invalide."));
    }
    invoiceData.amount = amount;

    try {
      // Définir le chemin du fichier de sortie
      const filePath = `invoices/facture-${invoiceData.invoiceNumber}.pdf`;
      const stream = fs.createWriteStream(filePath);
      const pdf = new PDFDocument({ size: "A4" });

      pdf.pipe(stream);

      // Ajouter l'en-tête de la facture
      pdf.fontSize(20).text("Facture", { align: "center" });
      pdf.moveDown();

      // Infos de la facture
      pdf.fontSize(12).text(`Date: ${invoiceData.date}`);
      pdf.text(`Facture No: ${invoiceData.invoiceNumber}`);
      pdf.text(`Client: ${invoiceData.clientName}`);
      // Utilisation de toFixed sur un nombre maintenant
      pdf.text(`Montant: CHF ${invoiceData.amount.toFixed(2)}`);
      pdf.moveDown();

      // Ajouter les informations du créditeur
      pdf.text("Créditeur :", { underline: true });
      pdf.text(`${invoiceData.creditor.name}`);
      pdf.text(
        `${invoiceData.creditor.street}, ${invoiceData.creditor.zip} ${invoiceData.creditor.city}`
      );
      pdf.moveDown();

      // Ajouter les informations du débiteur
      pdf.text("Débiteur :", { underline: true });
      pdf.text(`${invoiceData.debtor.name}`);
      pdf.text(
        `${invoiceData.debtor.street}, ${invoiceData.debtor.zip} ${invoiceData.debtor.city}`
      );
      pdf.moveDown();

      // Créer les données du QR-bill
      const qrBillData = {
        amount: invoiceData.amount,
        creditor: {
          account: invoiceData.creditor.account,
          address: invoiceData.creditor.street,
          buildingNumber: "",
          city: invoiceData.creditor.city,
          country: "CH",
          name: invoiceData.creditor.name,
          zip: invoiceData.creditor.zip,
        },
        currency: "CHF",
        debtor: {
          address: invoiceData.debtor.street,
          buildingNumber: "",
          city: invoiceData.debtor.city,
          country: "CH",
          name: invoiceData.debtor.name,
          zip: invoiceData.debtor.zip,
        },
        reference: invoiceData.reference,
      };

      // Ajouter le QR-bill au PDF
      const qrBill = new SwissQRBill(qrBillData);
      qrBill.attachTo(pdf);

      // Finaliser et sauvegarder le PDF
      pdf.end();

      stream.on("finish", () => {
        console.log("✅ Facture générée avec succès :", filePath);
        resolve(filePath);
      });

      stream.on("error", reject);
    } catch (error) {
      console.error("❌ Erreur lors de la génération du QR-bill :", error);
      reject(error);
    }
  });
}
