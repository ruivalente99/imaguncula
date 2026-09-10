import { test, expect } from "@playwright/test";

test.describe("06. Mobile Native Dock Experience", () => {
  test("renders docked bottom navigation bar with safe-area padding on mobile", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "This test is specifically for mobile viewport");

    await page.goto("/");
    await page.getByText("Pet Fofo").click();
    await expect(page.locator("canvas")).toBeVisible();

    // Verify docked mobile navigation bar is visible and has pb-safe
    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav).toHaveClass(/pb-safe/);

    // Verify mobile tabs
    await expect(mobileNav.getByText("Editor")).toBeVisible();
    await expect(mobileNav.getByText("Fundo")).toBeVisible();
    await expect(mobileNav.getByText("Borda")).toBeVisible();
    await expect(mobileNav.getByText("Texto")).toBeVisible();
    await expect(mobileNav.getByText("Pacote")).toBeVisible();
    await expect(mobileNav.getByText("Exportar")).toBeVisible();

    // Switch tab via mobile dock
    await mobileNav.getByText("Borda").click();
    await expect(page.getByText("Borda de Adesivo")).toBeVisible();

    // Switch to Fundo
    await mobileNav.getByText("Fundo").click();
    await expect(page.getByText("Remoção de Fundo")).toBeVisible();

    // Trigger Export via mobile dock
    await mobileNav.getByText("Exportar").click();
    await expect(page.getByRole("heading", { name: "Exportar Sticker" })).toBeVisible();
  });
});
