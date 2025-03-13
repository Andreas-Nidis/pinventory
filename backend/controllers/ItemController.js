import { sql } from "../config/db.js";
import { uploadAndGetURL } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

//CRUD OPERATIONS
export const getItems = async (req, res) => {
    try {
        const items = await sql`
            SELECT * FROM items
            WHERE user_id = ${req.user.sub}
            ORDER BY created_at DESC
        `;

        console.log('fetched items', items);
        res.status(200).json({success:true, data:items});

    } catch (error) {
        console.log("Error in getItems function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

export const createItem = async (req, res) => {
    const {name, price } = req.body;
    const imageFile  = req.file;

    if (!name || !price || !imageFile) {
        return res.status(400).json({success:false, message:"All fields are required"});
    }

    const fileBase64 = req.file.buffer.toString("base64");
    const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    const image = await uploadAndGetURL(fileDataUri);

    console.log("Image url retrieved successfully");

    try {
        const newItem = await sql`
            INSERT INTO items(user_id, name, price, image)
            VALUES (${req.user.sub}, ${name}, ${price}, ${image})
            RETURNING *
        `

        console.log("New item added:", newItem);
        res.status(201).json({success:true, data:newItem[0]});

    } catch (error) {
        console.log("Error in createItems function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

export const getItem = async (req, res) => {
    const {id} = req.params;

    try {
        const item = await sql`
            SELECT * FROM items WHERE id=${id} AND user_id=${req.user.sub}
        `;

        if(item.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        res.status(200).json({success:true, data: item[0]});
    } catch (error) {
        console.log("Error in getItem function");
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

};

export const updateItem = async (req, res) => {
    const {id} = req.params;
    const {name, price} = req.body;
    let image;
    let newImage;

    const storedImage = await sql`
        SELECT image FROM items WHERE id=${id} AND user_id=${req.user.sub}
    `;

    if (req.file) {
        const fileBase64 = req.file.buffer.toString("base64");
        const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        newImage = await uploadAndGetURL(fileDataUri);
    } else {
        newImage = storedImage[0].image;
    }

    if(newImage === storedImage[0].image) {
        console.log('Image url already in use'); 
        image = storedImage[0].image;
    } else {
        image = newImage;

        console.log("Deleting old image from Cloudinary...");
        const publicId = storedImage[0].image
        .split('/upload/')[1]  // Get everything after '/upload/'
        .split('.')[0]         // Get everything before the file extension (jpg, png, etc.)
        .split('?')[0];        // Remove any query parameters

        console.log("Extracted public_id:", publicId);

        try {
            // Delete the image from Cloudinary using the correct public_id
            const result = await cloudinary.uploader.destroy(publicId);
            console.log("Cloudinary delete result:", result);

            if (result.result === 'ok') {
                console.log(`Successfully deleted image with public_id: ${publicId}`);
            } else {
                console.log(`Failed to delete image: ${publicId}`);
            }
        } catch (error) {
            console.log("Error during Cloudinary deletion:", error); // Log the full error
        }
    }
    
    console.log("Image url retrieved successfully");

    try {
        const updatedItem = await sql`
            UPDATE items
            SET name=${name}, price=${price}, image=${image}
            WHERE id=${id} AND user_id=${req.user.sub}
            RETURNING *
        `;

        if(updatedItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        res.status(200).json({ success: true, data: updatedItem[0] });

    } catch (error) {
        console.log("Error in getItem function");
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

};

export const deleteItem = async (req, res) => {
    const { id } = req.params;
    
    try {
        const item = await sql`SELECT * FROM items WHERE id = ${id} AND user_id = ${req.user.sub}`;

        if (item.length === 0) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        const imageUrl = item[0].image; // Stored Cloudinary image URL
        if (imageUrl) {
            console.log("Deleting from Cloudinary...");
            
            const publicId = imageUrl
                .split('/upload/')[1]  // Get everything after '/upload/'
                .split('.')[0]         // Get everything before the file extension (jpg, png, etc.)
                .split('?')[0];        // Remove any query parameters

            console.log("Extracted public_id:", publicId);
        
            try {
                // Delete the image from Cloudinary using the correct public_id
                const result = await cloudinary.uploader.destroy(publicId);
                console.log("Cloudinary delete result:", result);
        
                if (result.result === 'ok') {
                    console.log(`Successfully deleted image with public_id: ${publicId}`);
                } else {
                    console.log(`Failed to delete image: ${publicId}`);
                }
            } catch (error) {
                console.log("Error during Cloudinary deletion:", error); // Log the full error
            }
        }

        const deletedItem = await sql`
            DELETE FROM items 
            WHERE id=${id} AND user_id = ${req.user.sub} 
            RETURNING *
        `;

        if(deletedItem.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            });
        }

        res.status(200).json({success:true, data: deletedItem[0]});

    } catch (error) {
        console.log("Error in deleteItem function");
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

};