import { test, expect } from "@playwright/test";
import { navigateToTab, loadSamplePet } from "./helpers";

test.describe("04. Text Overlays and Meme Stamps", () => {
  test.beforeEach(async ({ page }) => {
    await loadSamplePet(page);
    await navigateToTab(page, "Texto");
  });

  test("adds custom meme text overlay", async ({ page }) => {
    await expect(page.getByText("Legendas & Emojis")).toBeVisible();

    const input = page.locator('input[placeholder="ESCREVA O SEU MEME..."]');
    await input.fill("BOM DIA GRUPO!");

    await page.getByRole("button", { name: "Adicionar Texto" }).click();

    // Verify text item input appears
    const itemInput = page.locator('input[value="BOM DIA GRUPO!"]');
    await expect(itemInput).toBeVisible();
  });

  test("adds quick emoji stamp to sticker", async ({ page }) => {
    // Click on the flame emoji
    const flameBtn = page.getByRole("button", { name: "🔥" });
    await expect(flameBtn).toBeVisible();
    await flameBtn.click();

    // Verify emoji overlay item appears
    const emojiInput = page.locator('input[value="🔥"]');
    await expect(emojiInput).toBeVisible();
  });
});
