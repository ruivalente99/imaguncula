import { test, expect } from "@playwright/test";
import { navigateToTab, loadSamplePet } from "./helpers";

test.describe("05. Export Modal and WhatsApp Integration", () => {
  test.beforeEach(async ({ page }) => {
    await loadSamplePet(page);
  });

  test("opens export modal with 512x512 WebP specifications", async ({ page }) => {
    // Click Export in header (or mobile dock)
    const exportBtn = page.locator('header button:has-text("Exportar")');
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();

    // Verify modal elements
    await expect(page.getByRole("heading", { name: "Exportar Sticker" })).toBeVisible();
    await expect(page.getByText("512 × 512 px WebP")).toBeVisible();
    await expect(page.getByText("WhatsApp Ready")).toBeVisible();

    // Verify export buttons
    await expect(page.getByRole("button", { name: /Copiar & Abrir no WhatsApp/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Descarregar \.wastickers/i })).toBeVisible();
    await expect(page.getByText("Partilhar no WhatsApp")).toBeVisible();
    await expect(page.getByText("Copiar Imagem")).toBeVisible();
    await expect(page.getByRole("button", { name: "WebP (512x512)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "PNG HD" })).toBeVisible();

    // Verify WhatsApp guide accordion can be expanded
    await page.getByText("Como usar no WhatsApp?").click();
    await expect(page.getByText("No WhatsApp Web (Computador):")).toBeVisible();
    await expect(page.getByText("Aplicações de Stickers (Sticker Maker / Sticker.ly):")).toBeVisible();
  });

  test("saves sticker to local pack and displays in Pacote tray", async ({ page }) => {
    // Open Export Modal
    const exportBtn = page.locator('header button:has-text("Exportar")');
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();

    // Save to local pack
    const saveBtn = page.getByRole("button", { name: /Guardar no Meu Pacote/i });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Verify confirmation message
    await expect(page.getByText("Sticker guardado no seu pacote local!")).toBeVisible();

    // Close modal by clicking X or pressing Escape
    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: "Exportar Sticker" })).not.toBeVisible();

    // Navigate to "Pacote" tab using helper
    await navigateToTab(page, "Pacote");

    // Verify pack has at least 1 saved sticker
    await expect(page.getByText("Os Meus Stickers Guardados")).toBeVisible();
    await expect(page.getByRole("button", { name: "Descarregar Pacote Completo (.ZIP)" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Descarregar \.wastickers/i })).toBeVisible();
  });
});
