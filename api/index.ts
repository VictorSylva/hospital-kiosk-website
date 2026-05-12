export default async function handler(req: any, res: any) {
  try {
    const appModule = await import('../backend/src/server.js');
    const app = appModule.default;
    return app(req, res);
  } catch (error: any) {
    console.error("Vercel Bridge Error:", error);
    res.status(500).json({
      error: "Vercel Bridge Failure",
      message: error.message,
      stack: error.stack,
      path: error.path
    });
  }
}
