# Edge Insights: A Cloudflare Workers + Pages Demo

This is a real-time analytics platform to monitor a website's Core Web Vitals. It's built with a React frontend deployed on **Cloudflare Pages** and a serverless API backend running on **Cloudflare Workers** (via Pages Functions).

The dashboard visualizes key performance metrics (LCP, FID, CLS) to help developers build a better, faster Internet, while demonstrating a modern edge-first architecture.

## Architecture: The Edge-First Approach

This project leverages the power of Cloudflare's developer platform:

*   **Frontend**: A responsive React application hosted on **Cloudflare Pages**. Pages provides best-in-class performance by serving static assets from Cloudflare's global edge network, close to your users.
*   **Backend**: A serverless API endpoint (`/api/metrics`) built with **Pages Functions**. This is a Cloudflare Worker that runs on-demand, directly on the edge. It generates and serves the analytics data requested by the frontend.

This setup, where both the static site and its dynamic API run on the same global network, is incredibly powerful. It simplifies development and deployment while minimizing latency for users worldwide.

## How it Works

1.  The React frontend makes a request to `/api/metrics?metric=LCP&timeframe=7d`.
2.  Because the app is on Cloudflare Pages, this request is automatically routed to the Pages Function located at `functions/api/metrics.ts`.
3.  The function processes the request, generates mock analytics data, and simulates API latency.
4.  It returns a JSON response to the frontend.
5.  The React app receives the data and renders the charts and metric cards.

## Local Development

This project is configured to work out-of-the-box without needing to install and run the Cloudflare `wrangler` CLI.

*   When you open `index.html` locally, the application detects the development environment (`localhost` or `file://`) and uses a local mock data generator instead of trying to call the `/api/metrics` endpoint. This prevents `404` errors and allows you to work on the frontend seamlessly.
*   When deployed to Cloudflare Pages, the application automatically switches to fetching data from the live Pages Function.

For a more authentic end-to-end testing environment that runs the serverless function locally, you can use the official Cloudflare CLI:

```bash
# Install wrangler
npm install -g wrangler

# Run the pages dev server from the project root
# The `--` is important if your project has other CLI flags
wrangler pages dev . -- yarn start 
```
This will start a local server that accurately mimics the Cloudflare Pages environment.

## Deployment Instructions

Deploying this application to Cloudflare is a seamless experience.

### 1. Fork and Clone the Repository

First, fork this repository to your own GitHub account and clone it to your local machine.

### 2. Deploy to Cloudflare Pages

1.  Log in to your [Cloudflare dashboard](https://dash.cloudflare.com).
2.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Select your forked repository.
4.  In the **Build settings**, select `Vite` as the framework preset. This should automatically configure the necessary build commands (`npm run build`) and output directory (`dist`).
5.  Click **Save and Deploy**.

Cloudflare Pages will automatically build your React app and deploy it. It will also detect the `/functions` directory and deploy your API endpoint alongside your site. No `wrangler.toml` is needed for this integrated setup.

### 3. (Optional) Bind D1 or KV Storage

To move beyond mock data, you can bind a D1 database or KV namespace to your Pages Function for data persistence.

1.  In your Cloudflare dashboard, create a D1 database or a KV namespace.
2.  Go to your Pages project > **Settings** > **Functions**.
3.  Under **Bindings**, add a new binding.
    *   **Variable name**: `ANALYTICS_DB` (for D1) or `ANALYTICS_KV` (for KV).
    *   **Resource**: Select the D1 database or KV namespace you created.
4.  Redeploy your application. Your function can now access the binding via `context.env.ANALYTICS_DB`. The code in `functions/api/metrics.ts` includes commented-out examples of how to query D1.

## Why This Demonstrates Key Edge Compute Concepts

This project isn't just a simple web app; it's a practical demonstration of modern web architecture principles:

*   **Low Latency**: By running the API (the Worker) on the same edge network that serves the static assets (the Pages site), we eliminate the round-trip to a centralized origin server. The compute happens close to the user, wherever they are in the world, resulting in a faster, more responsive experience.
*   **Serverless & Scalability**: The backend is a serverless function. It only runs when called, meaning there are no idle servers to manage or pay for. Cloudflare's network automatically scales the function globally to handle any amount of traffic, from zero to millions of requests, without any configuration changes.
*   **Integrated Developer Experience**: Cloudflare Pages and Functions provide a unified platform for building and deploying full-stack applications. The file-based routing for functions (`/functions/api/metrics.ts` becomes `/api/metrics`) simplifies API creation, and the git-based deployment workflow is fast and efficient.
*   **Separation of Concerns**: The frontend (React) is purely responsible for presentation, while the backend (Worker) handles data logic. This makes the application easier to develop, test, and maintain.
