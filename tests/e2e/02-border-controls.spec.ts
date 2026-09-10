import { test, expect } from "@playwright/test";
import { navigateToTab, loadSamplePet } from "./helpers";

test.describe("02. Border and Die-Cut Controls", () => {
  test.beforeEach(async ({ page }) => {
    await loadSamplePet(page);
    // Navigate to Border tab
    await navigateToTab(page, "Borda");
  });

  test("toggles with-border and without-border modes", async ({ page }) => {
    await expect(page.getByText("Borda de Adesivo")).toBeVisible();

    const withBorderBtn = page.getByRole("button", { name: "Com Borda" });
    const withoutBorderBtn = page.getByRole("button", { name: "Sem Borda" });

    // Initial state should be With Border
    await expect(withBorderBtn).toBeVisible();

    // Click Without Border
    await withoutBorderBtn.click();
    await expect(page.locator("text=Sem Borda").first()).toBeVisible();

    // Click back to With Border
    await withBorderBtn.click();
    await expect(page.getByText("Espessura da Borda")).toBeVisible();
  });

  test("allows selecting border width presets and color swatches", async ({ page }) => {
    // Select width presets
    await page.getByRole("button", { name: "Fina" }).click();
    await expect(page.getByText("6px", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Grossa" }).click();
    await expect(page.getByText("22px", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Média" }).click();
    await expect(page.getByText("14px", { exact: true })).toBeVisible();

    // Select color swatches
    const amberColor = page.locator('button[title="Âmbar Papyrus"]');
    await expect(amberColor).toBeVisible();
    await amberColor.click();

    const whiteColor = page.locator('button[title="Branco Clássico"]');
    await expect(whiteColor).toBeVisible();
    await whiteColor.click();
  });

  test("toggles 3D Pop shadow", async ({ page }) => {
    await expect(page.getByText("Sombra de Destaque 3D")).toBeVisible();
    // Locate the shadow toggle switch button using data-testid
    const shadowToggle = page.locator('[data-testid="shadow-toggle"]');
    await expect(shadowToggle).toBeVisible();
    await shadowToggle.click();
  });
});
