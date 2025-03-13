export function isNotWebsiteUrl(req, res, next) {
    const body = Object.entries(req.body);
    const regex = /^(([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}|localhost)$/;
  
    for (let i = 0; i < body.length; i++) {
      const [key, value] = body[i]; // Destructure key and value
  
      if (typeof value === 'string') {
        try {
          if (regex.test(value)) {
            // It's a website URL in field '${key}', handle it.
            return res.status(400).send(`Field '${key}' cannot be a website URL.`); // Or handle as appropriate
          }
        } catch (error) {
          // Not a valid URL, continue checking.
        }
      }
    }
  
    // No website URLs found in any field, proceed to the next middleware.
    next();
  }