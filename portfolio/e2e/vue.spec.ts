import { test, expect } from '@playwright/test'

test('redirects the root url to /home', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('navigates between pages with the nav clouds', async ({ page }) => {
  await page.goto('/home')
  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('link')).toHaveCount(3)

  await nav.getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About')

  await nav.getByRole('link', { name: 'Projects' }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects')
})

test('keeps the same sky canvas when the page changes', async ({ page }) => {
  await page.goto('/home')
  const sky = page.locator('.sky canvas').first()
  await sky.evaluate((el) => el.setAttribute('data-marker', 'kept'))

  await page.getByRole('navigation').getByRole('link', { name: 'About' }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(sky).toHaveAttribute('data-marker', 'kept')
})

test('loads a page directly by its url', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projects')
})

test('follows the story with the next buttons', async ({ page }) => {
  await page.goto('/home')
  const next = page.getByRole('main').getByRole('link', { name: 'Volgende' })

  await next.click()
  await expect(page).toHaveURL(/\/about$/)

  await next.click()
  await expect(page).toHaveURL(/\/projects$/)

  // Projects is the end of the story.
  await expect(next).toHaveCount(0)
})
