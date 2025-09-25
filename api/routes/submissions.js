// api/routes/submissions.js
import express from "express";
import db from "../utils/db.js";

const router = express.Router();

// Get all submissions
router.get("/", (req, res) => {
    const query = `
        SELECT * FROM submissions
        ORDER BY created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching submissions:", err);
            return res.status(500).json({ error: "Failed to fetch submissions" });
        }

        res.json(results);
    });
});

// Create new submission
router.post("/", (req, res) => {
    const submissionData = req.body;

    const insertQuery = `
        INSERT INTO submissions (
            id, type, data, status, created_at
        ) VALUES (?, ?, ?, ?, NOW())
    `;

    const values = [
        submissionData.id || require('crypto').randomUUID(),
        submissionData.type,
        JSON.stringify(submissionData.data || {}),
        submissionData.status || 'pending'
    ];

    db.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error("Error creating submission:", err);
            return res.status(500).json({ error: "Failed to create submission" });
        }

        res.status(201).json({
            message: "Submission created successfully",
            id: values[0]
        });
    });
});

// Update submission status
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = "UPDATE submissions SET status = ? WHERE id = ?";

    db.query(updateQuery, [status, id], (err, results) => {
        if (err) {
            console.error("Error updating submission:", err);
            return res.status(500).json({ error: "Failed to update submission" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.json({ message: "Submission updated successfully" });
    });
});

// Delete submission
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM submissions WHERE id = ?";

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error deleting submission:", err);
            return res.status(500).json({ error: "Failed to delete submission" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Submission not found" });
        }

        res.json({ message: "Submission deleted successfully" });
    });
});

export default router;
