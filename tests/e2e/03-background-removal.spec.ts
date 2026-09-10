import { test, expect } from "@playwright/test";
import { navigateToTab, loadSamplePet } from "./helpers";

test.describe("03. Background Removal Tools", () => {
  test.beforeEach(async ({ page }) => {
    await loadSamplePet(page);
    await navigateToTab(page, "Fundo");
  });

  test("triggers 1-click Auto Cutout and enables Undo", async ({ page }) => {
    await expect(page.getByText("Remoção Automática")).toBeVisible();

    // Click Auto Cutout
    await page.getByText("Remoção Automática").click();

    // Verify toast notification
    await expect(page.getByText("Remoção automática aplicada!")).toBeVisible();

    // Verify Undo button appears in canvas top toolbar
    const undoBtn = page.locator('button[title="Desfazer Ação"]').first();
    await expect(undoBtn).toBeVisible();
    await undoBtn.click();
  });

  test("switches between Wand, Brush and Shapes tabs", async ({ page }) => {
    // Check Magic Wand is default
    await expect(page.getByText("Tolerância de Cor")).toBeVisible();

    // Switch to Brush / Eraser
    await page.getByRole("button", { name: "Pincel / Borracha" }).click();
    await expect(page.getByText("Tamanho do Pincel")).toBeVisible();
    await expect(page.getByRole("button", { name: "Apagar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Restaurar", exact: true })).toBeVisible();

    // Switch to Shapes
    await page.getByRole("button", { name: "Formas Rápidas" }).click();
    await expect(page.getByRole("button", { name: "Círculo" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Superelipse" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Coração" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Estrela" })).toBeVisible();

    // Click on Circle shape cutout
    await page.getByRole("button", { name: "Círculo" }).click();
  });
});
