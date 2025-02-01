const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Update MySQL connection settings
const db = mysql.createConnection({
    host: "localhost",      // The host of your MySQL server
    user: "root",           // Use 'root' as the user
    password: "admin", // Replace with your root password
    database: "financely"   // The database name
});

// Test the database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database as root@localhost');
});

// Routes
app.get('/', (req, res) => {
    return res.json("From Backend");
});

// ||-------CATEGORY------- ||

// get all categories
app.get('/category', (req, res) => {
    const sql = "SELECT * FROM category";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json(err);
        }
        return res.json(data);
    });
});

// save a new category
app.post('/category', (req, res) => {
    const { NAME } = req.body;
    const sql = "INSERT INTO category (Name) VALUES (?)";
    db.query(sql, [Name], (err, result) => {
        if(err) {
            console.error("Error inserting into the database:", err);
            return res.status(500).json(err);
        }
        return res.json({message: "Category added succesfully", id: result.insertId});
    });
})

app.get('/entries/available-months', (req, res) => {
    const sql = `
        SELECT DISTINCT MONTH(Date) AS month, YEAR(Date) AS year 
        FROM entries 
        ORDER BY year DESC, month DESC
    `;

    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: "Database query error", details: err });
        }
        return res.json(data);
    });
});

// PUT: Update a category by ID
app.put('/category/:id', (req, res) => {
    const { id } = req.params;
    const { Name } = req.body;
    const sql = "UPDATE category SET Name = ? WHERE ID = ?";

    db.query(sql, [Name, id], (err, result) => {
        if (err) {
            console.error('Error updating the database:', err);
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.json({ message: "Category updated successfully" });
    });
});

// DELETE: Delete a category by ID
app.delete('/category/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM category WHERE ID = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting from the database:', err);
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.json({ message: "Category deleted successfully" });
    });
});

//||-------PAYMENT-------||


app.get('/payment', (req, res) => {
    const sql = "SELECT * FROM payment";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json(err);
        }
        return res.json(data);
    });
});

// POST: Add a new payment
app.post('/payment', (req, res) => {
    const { Name } = req.body; // Expecting { "Name": "Some Payment Method" }
    const sql = "INSERT INTO payment (Name) VALUES (?)";
    db.query(sql, [Name], (err, result) => {
        if (err) {
            console.error('Error inserting into the database:', err);
            return res.status(500).json(err);
        }
        return res.json({ message: "Payment added successfully", id: result.insertId });
    });
});

// PUT: Update a payment by ID
app.put('/payment/:id', (req, res) => {
    const { id } = req.params;
    const { Name } = req.body;
    const sql = "UPDATE payment SET Name = ? WHERE ID = ?";

    db.query(sql, [Name, id], (err, result) => {
        if (err) {
            console.error('Error updating the database:', err);
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        return res.json({ message: "Payment updated successfully" });
    });
});

// DELETE: Delete a payment by ID
app.delete('/payment/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM payment WHERE ID = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting from the database:', err);
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        return res.json({ message: "Payment deleted successfully" });
    });
});

//||-------ENTRIES-------||

app.get('/entries/month', (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ error: "Month and Year are required" });
    }

    const sql = `
        SELECT * FROM entries 
        WHERE MONTH(Date) = ? AND YEAR(Date) = ?
    `;

    db.query(sql, [month, year], (err, data) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ error: "Database query error", details: err });
        }
        return res.json(data);
    });
});

app.post('/entries', (req, res) => {
    const { itemName, price, count, date, categoryID, paymentID } = req.body;

    if (!itemName || !price || !count || !date || !categoryID || !paymentID) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const cost = price * count;

    db.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json(err);
        }

        // Insert the new entry
        const insertEntrySQL = `
            INSERT INTO entries (ItemName, Price, Count, Date, CategoryID, PaymentID)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(insertEntrySQL, [itemName, price, count, date, categoryID, paymentID], (err, result) => {
            if (err) {
                console.error("Error inserting entry:", err);
                return db.rollback(() => res.status(500).json(err));
            }

            const entryId = result.insertId;

            // Update the balance of the corresponding Payment
            const updateBalanceSQL = `
                UPDATE Payment
                SET Balance = Balance + ?
                WHERE ID = ?
            `;

            db.query(updateBalanceSQL, [cost, paymentID], (err) => {
                if (err) {
                    console.error("Error updating payment balance:", err);
                    return db.rollback(() => res.status(500).json(err));
                }

                // Commit the transaction
                db.commit((err) => {
                    if (err) {
                        console.error("Error committing transaction:", err);
                        return db.rollback(() => res.status(500).json(err));
                    }

                    return res.status(201).json({ message: "Entry added successfully and balance updated!", id: entryId });
                });
            });
        });
    });
});

// DELETE: Delete an entry by ID
app.delete('/entries/:id', (req, res) => {
    const { id } = req.params;

    // Start a transaction to ensure data integrity
    db.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).json(err);
        }

        // Retrieve the entry details before deleting
        const selectEntrySQL = `SELECT Price, Count, PaymentID FROM entries WHERE ID = ?`;

        db.query(selectEntrySQL, [id], (err, results) => {
            if (err) {
                console.error("Error fetching entry details:", err);
                return db.rollback(() => res.status(500).json(err));
            }

            if (results.length === 0) {
                return db.rollback(() => res.status(404).json({ message: "Entry not found" }));
            }

            const { Price, Count, PaymentID } = results[0];
            const cost = Price * Count; // Calculate total cost

            // Delete the entry
            const deleteEntrySQL = `DELETE FROM entries WHERE ID = ?`;

            db.query(deleteEntrySQL, [id], (err, result) => {
                if (err) {
                    console.error("Error deleting entry:", err);
                    return db.rollback(() => res.status(500).json(err));
                }

                // Subtract the cost from the corresponding Payment balance
                const updateBalanceSQL = `
                    UPDATE Payment
                    SET Balance = Balance - ?
                    WHERE ID = ?
                `;

                db.query(updateBalanceSQL, [cost, PaymentID], (err) => {
                    if (err) {
                        console.error("Error updating payment balance:", err);
                        return db.rollback(() => res.status(500).json(err));
                    }

                    // Commit the transaction
                    db.commit((err) => {
                        if (err) {
                            console.error("Error committing transaction:", err);
                            return db.rollback(() => res.status(500).json(err));
                        }

                        return res.json({ message: "Entry deleted successfully and balance updated!" });
                    });
                });
            });
        });
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});
