import { sql } from "../config/db.js";
import { uploadAndGetURL } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export async function fetchItems(userId) {
  if (!userId) throw new Error("Unauthorized");

  const items = await sql`
    SELECT * FROM items
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  
  return items;
}

export async function addItem(userId, { name, description, value }, file) {
  if (!userId) throw new Error("Unauthorized");
  if (!name || !file) throw new Error("BadRequest");

  const fileBase64 = file.buffer.toString("base64");
  const fileDataUri = `data:${file.mimetype};base64,${fileBase64}`;
  const image = await uploadAndGetURL(fileDataUri);

  const newItem = await sql`
    INSERT INTO items(user_id, name, description, value, image)
    VALUES (${userId}, ${name}, ${description}, ${value}, ${image})
    RETURNING *
  `;
  
  return newItem[0];
}

export async function removeItem(userId, itemId) {
  if (!userId) throw new Error("Unauthorized");

  const item = await sql`
    SELECT * FROM items WHERE id = ${itemId} AND user_id = ${userId}
  `;

  if (item.length === 0) throw new Error("NotFound");

  const imageUrl = item[0].image;
  if (imageUrl) {
    const publicId = imageUrl
      .split("/upload/")[1]
      .split(".")[0]
      .split("?")[0];

    await cloudinary.uploader.destroy(publicId);
  }

  const deletedItem = await sql`
    DELETE FROM items WHERE id = ${itemId} AND user_id = ${userId} RETURNING *
  `;

  return deletedItem[0];
}
