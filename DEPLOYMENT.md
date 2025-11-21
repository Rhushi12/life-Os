# Deployment Guide for LifeOS

This guide explains how to deploy your LifeOS application and connect it to your custom domain `liifeos.online`.

## Prerequisites

1.  **GitHub Account**: You already have this (`Rhushi12`).
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) using your GitHub account.
3.  **Hostinger Account**: Where you bought your domain.

## Step 1: Deploy to Vercel

1.  Log in to **Vercel**.
2.  Click **"Add New..."** -> **"Project"**.
3.  You should see your GitHub repository `life-Os` listed. Click **"Import"**.
4.  **Configure Project**:
    *   **Framework Preset**: Vercel usually detects "Vite" automatically. If not, select **Vite**.
    *   **Root Directory**: Leave as `./`.
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default for Vite).
    *   **Install Command**: `npm install` (default).
5.  Click **"Deploy"**.
    *   Vercel will build your site. Wait for it to finish (usually 1-2 minutes).
    *   Once done, you'll get a preview URL (e.g., `life-os.vercel.app`).

## Step 2: Connect Your Domain

1.  In your Vercel Project Dashboard, go to **Settings** -> **Domains**.
2.  Enter `liifeos.online` in the input field and click **"Add"**.
3.  Select the option recommended (usually "Add to project").
4.  Vercel will now show an "Invalid Configuration" or "Pending" status. It will provide you with **Nameservers** intended for your domain. They usually look like:
    *   `ns1.vercel-dns.com`
    *   `ns2.vercel-dns.com`

## Step 3: Update Hostinger DNS

1.  Log in to your **Hostinger** account.
2.  Go to the **Domains** section and find `liifeos.online`.
3.  Look for **"Nameservers"** or **"DNS / Nameservers"**.
4.  Select **"Change Nameservers"**.
5.  Choose **"Change to Custom Nameservers"** (do not use Hostinger default).
6.  Enter the Vercel nameservers you got in Step 2:
    *   Nameserver 1: `ns1.vercel-dns.com`
    *   Nameserver 2: `ns2.vercel-dns.com`
7.  Click **"Save"**.

## Step 4: Wait for Propagation

*   DNS changes can take anywhere from a few minutes to 24 hours to propagate globally.
*   Vercel will automatically detect the change and issue an SSL certificate (HTTPS) for you.
*   Once the status in Vercel turns **Green (Valid)**, your site is live at `https://liifeos.online`.

## Continuous Deployment

Since you connected Vercel to your GitHub repository:
*   Every time you push code to the `main` branch on GitHub (which we just did), Vercel will **automatically** rebuild and update your live website.
*   You don't need to do anything manually to update the site!
