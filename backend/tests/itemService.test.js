import * as service from "../services/itemService.js"; // use 'service' everywhere
import { sql } from "../config/db.js";
import { uploadAndGetURL } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

jest.mock("../config/db.js");
jest.mock("../config/cloudinary.js");

cloudinary.uploader = { destroy: jest.fn() }; // explicitly mock destroy

describe("itemService", () => {
  const userId = 'user1';
  const itemId = 'item1';

  beforeEach(() => jest.resetAllMocks());

  describe("fetchItem", () => {
    it("throws Unauthorized if no userId", async () => {
      await expect(service.fetchItem('', itemId)).rejects.toThrow('Unauthorized');
    });

    it("throws NotFound if item does not exist", async () => {
      sql.mockResolvedValue([]);
      await expect(service.fetchItem(userId, itemId)).rejects.toThrow('NotFound');
    });

    it("returns the item if found", async () => {
      const fakeItem = { id: itemId, name: 'Sword' };
      sql.mockResolvedValue([fakeItem]);

      const result = await service.fetchItem(userId, itemId);
      expect(sql).toHaveBeenCalled();
      expect(result).toEqual(fakeItem);
    });
  });

  describe('modifyItem', () => {
    const fileMock = { buffer: Buffer.from('fakeimage'), mimetype: 'image/png' };

    it('throws Unauthorized if no userId', async () => {
      await expect(service.modifyItem('', itemId, { name: 'A' }, null))
        .rejects.toThrow('Unauthorized');
    });

    it('throws NotFound if item does not exist', async () => {
      sql.mockResolvedValue([]); // SELECT
      await expect(service.modifyItem(userId, itemId, { name: 'A' }, null))
        .rejects.toThrow('NotFound');
    });

    it('updates item without new image', async () => {
      const storedItem = [{ id: itemId, image: 'oldUrl', name: 'Old' }];
      const updatedItem = [{ id: itemId, image: 'oldUrl', name: 'New' }];

      sql.mockResolvedValueOnce(storedItem); // SELECT
      sql.mockResolvedValueOnce(updatedItem); // UPDATE

      const result = await service.modifyItem(userId, itemId, { name: 'New', description: 'Desc', value: 10 }, null);

      expect(sql).toHaveBeenCalledTimes(2);
      expect(result).toEqual(updatedItem[0]);
    });

    it('updates item with new image and deletes old one', async () => {
      const storedItem = [{
        id: itemId,
        image: 'https://res.cloudinary.com/demo/image/upload/v1234567890/old_image.png'
      }];
      const updatedItem = [{ id: itemId, image: 'newUrl' }];

      sql.mockResolvedValueOnce(storedItem); // SELECT
      uploadAndGetURL.mockResolvedValue('newUrl'); // Cloudinary upload
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' }); // Cloudinary delete
      sql.mockResolvedValueOnce(updatedItem); // UPDATE

      const result = await service.modifyItem(
        userId,
        itemId,
        { name: 'New', description: 'Desc', value: 10 },
        fileMock
      );

      expect(uploadAndGetURL).toHaveBeenCalled();
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual(updatedItem[0]);
    });
  });

  describe('removeItem', () => {
    it('throws Unauthorized if no userId', async () => {
      await expect(service.removeItem('', itemId)).rejects.toThrow('Unauthorized');
    });

    it('throws NotFound if item does not exist', async () => {
      sql.mockResolvedValue([]); // SELECT query returns nothing
      await expect(service.removeItem(userId, itemId)).rejects.toThrow('NotFound');
    });

    it('deletes item and Cloudinary image successfully', async () => {
      const storedItem = [{
        id: itemId,
        image: 'https://res.cloudinary.com/demo/image/upload/v1234567890/old_image.png'
      }];
      const deletedItem = [{ id: itemId, image: storedItem[0].image, name: 'Old Item' }];

      sql.mockResolvedValueOnce(storedItem); // SELECT
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' }); // Cloudinary delete
      sql.mockResolvedValueOnce(deletedItem); // DELETE

      const result = await service.removeItem(userId, itemId);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(expect.any(String));
      expect(sql).toHaveBeenCalledTimes(2);
      expect(result).toEqual(deletedItem[0]);
    });
  });

});
