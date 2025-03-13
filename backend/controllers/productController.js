import { sql } from "../config/db.js";
import { uploadAndGetURL } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

//CRUD OPERATIONS
export const getProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            WHERE user_id = ${req.user.sub}
            ORDER BY created_at DESC
        `;

        console.log('fetched products', products);
        res.status(200).json({success:true, data:products});

    } catch (error) {
        console.log("Error in getProducts function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

export const createProduct = async (req, res) => {
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
        const newProduct = await sql`
            INSERT INTO products(user_id, name, price, image)
            VALUES (${req.user.sub}, ${name}, ${price}, ${image})
            RETURNING *
        `

        console.log("New product added:", newProduct);
        res.status(201).json({success:true, data:newProduct[0]});

    } catch (error) {
        console.log("Error in createProducts function", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
};

export const getProduct = async (req, res) => {
    const {id} = req.params;

    try {
        const product = await sql`
            SELECT * FROM products WHERE id=${id} AND user_id=${req.user.sub}
        `;

        if(product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({success:true, data: product[0]});
    } catch (error) {
        console.log("Error in getProduct function");
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

};

export const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {name, price} = req.body;
    let image;

    const fileBase64 = req.file.buffer.toString("base64");
    const fileDataUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    const newImage = await uploadAndGetURL(fileDataUri);

    const storedImage = await sql`
        SELECT image FROM products WHERE id=${id} AND user_id=${req.user.sub}
    `;
    

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
        const updatedProduct = await sql`
            UPDATE products
            SET name=${name}, price=${price}, image=${image}
            WHERE id=${id} AND user_id=${req.user.sub}
            RETURNING *
        `;

        if(updatedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({ success: true, data: updatedProduct[0] });

    } catch (error) {
        console.log("Error in getProduct function");
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    
    try {
        const product = await sql`SELECT * FROM products WHERE id = ${id} AND user_id = ${req.user.sub}`;

        if (product.length === 0) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const imageUrl = product[0].image; // Stored Cloudinary image URL
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

        const deletedProduct = await sql`
            DELETE FROM products 
            WHERE id=${id} AND user_id = ${req.user.sub} 
            RETURNING *
        `;

        if(deletedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({success:true, data: deletedProduct[0]});

    } catch (error) {
        console.log("Error in deleteProduct function");
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

};