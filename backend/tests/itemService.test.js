import * as service from "../services/itemService.js";
import { sql } from "../config/db.js";
import { uploadAndGetURL } from "../config/cloudinary.js";

jest.mock("../config/db.js");
jest.mock("../config/cloudinary.js");

describe("itemService", () => {
  beforeEach(() => jest.resetAllMocks());

  describe("fetchItems", () => {
    it("throws Unauthorized if no userId", async () => {
      await expect(service.fetchItems("")).rejects.toThrow("Unauthorized");
    });

    it("returns items from DB", async () => {
      const fakeItems = [{ id: 1, name: "Test" }];
      sql.mockResolvedValue(fakeItems);

      const result = await service.fetchItems("user1");
      expect(result).toEqual(fakeItems);
      expect(sql).toHaveBeenCalled();
    });
  });

  describe("addItem", () => {
    const fakeFile = { buffer: Buffer.from("image"), mimetype: "image/png" };
    const itemData = { name: "Item", description: "desc", value: 10 };

    it("throws BadRequest if missing name or file", async () => {
      await expect(service.addItem("user1", {}, null)).rejects.toThrow("BadRequest");
    });

    it("creates a new item", async () => {
      uploadAndGetURL.mockResolvedValue("http://image.url");
      sql.mockResolvedValue([{ id: 1, ...itemData, image: "http://image.url" }]);

      const result = await service.addItem("user1", itemData, fakeFile);
      expect(result).toEqual({ id: 1, ...itemData, image: "http://image.url" });
      expect(uploadAndGetURL).toHaveBeenCalled();
      expect(sql).toHaveBeenCalled();
    });
  });
});
