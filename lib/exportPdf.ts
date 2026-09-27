async function waitForImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

/**
 * Rasterizes the report sheet at print resolution and fits it on a single A4
 * page, re-attaching clickable link annotations on top of the image.
 */
export async function exportSheetToPdf(element: HTMLElement, filename: string): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas"), import("jspdf")]);

  await waitForImages(element);
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const sheetRect = element.getBoundingClientRect();
  const links = Array.from(element.querySelectorAll<HTMLElement>("[data-pdf-link]"))
    .map((node) => ({ url: node.dataset.pdfLink ?? "", rect: node.getBoundingClientRect() }))
    .filter((link) => link.url);
  const bands = Array.from(element.querySelectorAll<HTMLElement>("[data-pdf-bleed]"))
    .map((node) => ({ color: node.dataset.pdfBleed ?? "", rect: node.getBoundingClientRect() }))
    .filter((band) => band.color);

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const scale = Math.min(pageWidth / sheetRect.width, pageHeight / sheetRect.height);
  const imageWidth = sheetRect.width * scale;
  const imageHeight = sheetRect.height * scale;
  const offsetX = (pageWidth - imageWidth) / 2;
  const offsetY = (pageHeight - imageHeight) / 2;

  // A sheet taller than A4 is scaled down, which would leave white gutters beside
  // the banded rows. Painting the bands edge to edge first keeps them full bleed;
  // the opaque sheet image then covers everything but the gutters.
  for (const band of bands) {
    pdf.setFillColor(band.color);
    pdf.rect(0, offsetY + (band.rect.top - sheetRect.top) * scale, pageWidth, band.rect.height * scale, "F");
  }

  pdf.addImage(canvas.toDataURL("image/png"), "PNG", offsetX, offsetY, imageWidth, imageHeight);

  for (const link of links) {
    pdf.link(
      offsetX + (link.rect.left - sheetRect.left) * scale,
      offsetY + (link.rect.top - sheetRect.top) * scale,
      link.rect.width * scale,
      link.rect.height * scale,
      { url: link.url },
    );
  }

  pdf.save(filename);
}
