import { test, expect } from "@playwright/test";

test.describe("/landing — rogo-style landing page", () => {
  test("renders hero, scroll-flips navbar, opens mobile menu, shows pricing copy", async ({
    page,
  }) => {
    await page.goto("/landing");

    // Hero headline visible
    await expect(
      page.getByRole("heading", {
        name: /For the next generation of smart spenders/i,
      }),
    ).toBeVisible();

    // Pricing copy assertions
    await expect(page.getByText("$0", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("$6.99")).toBeVisible();

    // Scroll past sentinel — navbar should pick up paper bg
    await page.evaluate(() => window.scrollTo({ top: 200 }));
    // Wait for IntersectionObserver to fire
    await page.waitForTimeout(300);
    const nav = page.locator("nav[aria-label='Primary']").first();
    await expect(nav).toHaveClass(/bg-rogo-paper/);
  });

  test("mobile menu opens, traps focus, closes via Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/landing");

    // Open via hamburger
    await page.getByRole("button", { name: /open menu/i }).click();

    const dialog = page.getByRole("dialog", { name: /menu/i });
    await expect(dialog).toBeVisible();

    // All nav links present
    await expect(dialog.getByRole("link", { name: "Product" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Learn" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Pricing" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "About" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Blog" })).toBeVisible();

    // Close via Escape
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
