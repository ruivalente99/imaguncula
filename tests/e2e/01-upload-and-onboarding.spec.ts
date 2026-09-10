import { test, expect } from "@playwright/test";

test.describe("01. Upload and Onboarding Flow", () => {
  test("loads landing page with papyrus branding and sample presets", async ({ page, isMobile }) => {
    await page.goto("/");

    // Verify brand logo and title
    await expect(page.locator("header")).toBeVisible();
    await expect(page.getByText("papyrus stickers")).toBeVisible();
    if (!isMobile) {
      await expect(page.getByText("512×512 WebP")).toBeVisible();
    }

    // Verify upload zone elements
    await expect(page.getByText("Carregar Imagem")).toBeVisible();
    await expect(page.getByText("Escolher Foto")).toBeVisible();
    await expect(page.getByText("Tirar Foto")).toBeVisible();

    // Verify sample presets are present
    await expect(page.getByText("Pet Fofo")).toBeVisible();
    await expect(page.getByText("Meme Expressivo")).toBeVisible();
    await expect(page.getByText("Gato Clássico")).toBeVisible();
  });

  test("toggles language between PT and EN seamlessly", async ({ page }) => {
    await page.goto("/");

    // Default should be PT
    await expect(page.getByText("Carregar Imagem")).toBeVisible();

    // Click language switcher
    const langBtn = page.locator('button[title="Switch to English"]');
    await langBtn.click();

    // Should switch to EN
    await expect(page.getByText("Upload Image")).toBeVisible();
    await expect(page.getByText("Choose Photo")).toBeVisible();

    // Switch back to PT
    const langBtnBack = page.locator('button[title="Mudar para Português"]');
    await langBtnBack.click();
    await expect(page.getByText("Carregar Imagem")).toBeVisible();
  });

  test("toggles dark and light mode", async ({ page }) => {
    await page.goto("/");

    const themeBtn = page.locator('button[aria-label="Alternar tema claro / escuro"]');
    await expect(themeBtn).toBeVisible();

    const isInitiallyDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );

    await themeBtn.click();

    const isDarkAfterClick = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );

    expect(isDarkAfterClick).not.toBe(isInitiallyDark);
  });

  test("loads a preset image and reveals the 512x512 editor canvas", async ({ page }) => {
    await page.goto("/");

    // Click on the sample pet preset
    await page.getByText("Pet Fofo").click();

    // Canvas should now be visible
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveAttribute("width", "512");
    await expect(canvas).toHaveAttribute("height", "512");

    // Top action bar should have "Exportar" enabled
    const exportBtn = page.locator('header button:has-text("Exportar")');
    await expect(exportBtn).toBeEnabled();
  });
});
