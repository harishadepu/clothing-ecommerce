// Small debug endpoint - safe for dev/testing only.
// Returns request headers and cookies so you can verify what the deployed server receives.
export const debugInfo = (req, res) => {
  // DO NOT return secrets in production. This is strictly a diagnostic endpoint.
  res.json({
    ok: true,
    cookies: req.cookies || {},
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
      cookieHeader: req.headers.cookie || null,
      authorization: req.headers.authorization || null,
    },
  });
};
