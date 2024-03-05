const express = require("express");
const router = express.Router();

const {
    fetchUsers,
    fetchPlaces,
    fetchVacations,
    createVacation,
    destroyVacation,
} = require("./db");

// GET users

router.get("/users", async (req, res, next) => {
    try {
        const users = await fetchUsers();
        res.send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET places

router.get("/places", async (req, res, next) => {
    try {
        const places = await fetchPlaces();
        res.send(places);
    } catch (error) {
        console.error("Error fetching places", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET vacations

router.get("/vacations", async (req, res, next) => {
    try {
        const vacations = await fetchVacations();
        res.send(vacations);
    } catch (error) {
        console.error("Error fetching vacations", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST-Create vacation

router.post("/vacations", async (req, res, next) => {
    try {
        res.status(201).send(await createVacation(req.body));
    } catch (error) {
        console.error("Error creating vacation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete vacation

router.delete("/vacations/:id", async (req, res, next) => {
    try {
        // Delete vacation from the database
        await destroyVacation(req.params.id);

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting vacation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
