export function decodeToken(token) {
  try {
    // Split the token into its parts
    const [header, payload, signature] = token.split(".");

    // Decode the payload from Base64Url
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    // Return the role or other information from the token
    return decodedPayload.role; // Assuming 'role' is a field in your JWT payload
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
