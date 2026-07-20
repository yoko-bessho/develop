import { test, expect } from "@playwright/test";

// まず指定されたURLにアクセスする。その後、テストはページ上の要素とやり取りを行う
test("has title", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // タイトルに特定の部分文字列が「含まれている」ことを期待
    // await expect(page).toHaveTitle(/Playwright/);

    // 要素を特定
    const title = page.locator(".navbar__inner .navbar__title");

    // アサーション
    await expect(title).toHaveText("Playwright");
});

test("get started link", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // 表示されている 'Get started' という名前のリンクをクリックする
    await page.getByRole("link", { name: "Get started" }).click();

    // Expects page to have a heading with the name of Installation.
    await expect(
        page.getByRole("heading", { name: "Installation" }),
    ).toBeVisible();
});


// Playwright Codegenを体験

test("test", async ({ page }) => {
    await page.goto("https://tailwindcss.com/docs/installation/using-vite");
    await page.getByRole("button", { name: "⌘K" }).click();
    await page.getByRole("searchbox", { name: "Search" }).fill("flexbox");
    await page.getByRole("button", { name: "Search" }).click();
});