import { authenticateUser } from "../middleware/authMiddleware.js";

jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        getPayload: () => ({ sub: "123", email: "test@example.com" }),
      }),
    })),
  };
});

describe("authenticateUser middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("calls next() if token is valid", async () => {
    req.headers.authorization = "Bearer validtoken";

    await authenticateUser(req, res, next);

    expect(req.user).toEqual({ sub: "123", email: "test@example.com" });
    expect(next).toHaveBeenCalled();
  });
});
