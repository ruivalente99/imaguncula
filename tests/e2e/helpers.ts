import { Page, expect } from "@playwright/test";

/**
 * Navigates to a tab in either Desktop (top pill bar) or Mobile (docked bottom nav)
 * by clicking the visible button.
 */
export async function navigateToTab(
  page: Page,
  tabName: "Editor" | "Fundo" | "Borda" | "Texto" | "Pacote"
) {
  const tabButton = page.locator(`button:visible:has-text("${tabName}")`).first();
  await expect(tabButton).toBeVisible();
  await tabButton.click();
}

/**
 * Loads the sample pet preset and waits for the 512x512 Canvas to be ready.
 */
export async function loadSamplePet(page: Page) {
  await page.goto("/");
  const petBtn = page.getByText("Pet Fofo");
  await expect(petBtn).toBeVisible();
  await petBtn.click();
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible();
  await expect(canvas).toHaveAttribute("width", "512");
}
