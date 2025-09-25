// api/routes/products.js
import express from "express";
import db from "../utils/db.js";

const router = express.Router();

// Get all products
router.get("/", (req, res) => {
    const query = `
        SELECT *,
               COALESCE(display_order, 999) as display_order,
               COALESCE(show_on_landing, 1) as show_on_landing,
               COALESCE(show_on_home, 1) as show_on_home
        FROM products
        ORDER BY display_order ASC, catalog_number ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Failed to fetch products" });
        }

        // Parse JSON fields
        const products = results.map(product => ({
            ...product,
            features: product.features ? JSON.parse(product.features) : []
        }));

        res.json(products);
    });
});

// Get single product by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM products WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ error: "Failed to fetch product" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const product = {
            ...results[0],
            features: results[0].features ? JSON.parse(results[0].features) : []
        };

        res.json(product);
    });
});

// Create new product
router.post("/", (req, res) => {
    const productData = req.body;

    // Generate new catalog number
    const catalogQuery = "SELECT MAX(catalog_number) as maxNum FROM products";

    db.query(catalogQuery, (err, catalogResults) => {
        if (err) {
            console.error("Error generating catalog number:", err);
            return res.status(500).json({ error: "Failed to generate catalog number" });
        }

        const newCatalogNumber = (catalogResults[0]?.maxNum || 0) + 1;

        const insertQuery = `
            INSERT INTO products (
                id, name, title, provider, type, tier, price, original_price,
                discount, features, link, target_url, image, provider_logo,
                rating, num_reviews, clicks, code, short_link, seo_title,
                seo_description, catalog_number, color, button_color, is_featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            productData.id || require('crypto').randomUUID(),
            productData.name,
            productData.title,
            productData.provider,
            productData.type,
            productData.tier,
            productData.price,
            productData.original_price,
            productData.discount,
            JSON.stringify(productData.features || []),
            productData.link,
            productData.target_url,
            productData.image,
            productData.provider_logo,
            productData.rating || 0,
            productData.num_reviews || 0,
            productData.clicks || 0,
            productData.code,
            productData.short_link,
            productData.seo_title,
            productData.seo_description,
            newCatalogNumber,
            productData.color || 'blue',
            productData.button_color || 'blue',
            productData.is_featured || false
        ];

        db.query(insertQuery, values, (err, results) => {
            if (err) {
                console.error("Error creating product:", err);
                return res.status(500).json({ error: "Failed to create product" });
            }

            res.status(201).json({
                message: "Product created successfully",
                id: values[0],
                catalog_number: newCatalogNumber
            });
        });
    });
});

// Update product
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    const updateQuery = `
        UPDATE products SET
            name = ?, title = ?, provider = ?, type = ?, tier = ?,
            price = ?, original_price = ?, discount = ?, features = ?,
            link = ?, target_url = ?, image = ?, provider_logo = ?,
            rating = ?, num_reviews = ?, clicks = ?, code = ?,
            short_link = ?, seo_title = ?, seo_description = ?,
            color = ?, button_color = ?, is_featured = ?
        WHERE id = ?
    `;

    const values = [
        productData.name,
        productData.title,
        productData.provider,
        productData.type,
        productData.tier,
        productData.price,
        productData.original_price,
        productData.discount,
        JSON.stringify(productData.features || []),
        productData.link,
        productData.target_url,
        productData.image,
        productData.provider_logo,
        productData.rating,
        productData.num_reviews,
        productData.clicks,
        productData.code,
        productData.short_link,
        productData.seo_title,
        productData.seo_description,
        productData.color,
        productData.button_color,
        productData.is_featured,
        id
    ];

    db.query(updateQuery, values, (err, results) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({ error: "Failed to update product" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product updated successfully" });
    });
});

// Delete product
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM products WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({ error: "Failed to delete product" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ message: "Product deleted successfully" });
    });
});

export default router;
