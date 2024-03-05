const {
    client,
    createTables,
    createUser,
    createPlace,
    createVacation,
    fetchUsers,
    fetchPlaces,
    fetchVacations,
    destroyVacation,
} = require("./db");

const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

// Mount the routes
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

const init = async () => {
    await client.connect();
    console.log("Connected to database!");

    await createTables();
    console.log("Tables Created 📊!");

    const [moe, lucy, ethyl, rome, nyc, la, paris] = await Promise.all([
        createUser("moe"),
        createUser("lucy"),
        createUser("ethyl"),
        createPlace("rome"),
        createPlace("nyc"),
        createPlace("la"),
        createPlace("paris"),
    ]);
    console.log(`moe has an id of ${moe.id}`);
    console.log(`rome has an id of ${rome.id}`);

    console.log(await fetchUsers());
    console.log(await fetchPlaces());

    await Promise.all([
        createVacation({
            user_id: moe.id,
            place_id: nyc.id,
            departure_date: "04/01/2024",
        }),
        createVacation({
            user_id: moe.id,
            place_id: nyc.id,
            departure_date: "04/15/2024",
        }),
        createVacation({
            user_id: lucy.id,
            place_id: la.id,
            departure_date: "07/04/2024",
        }),
        createVacation({
            user_id: lucy.id,
            place_id: rome.id,
            departure_date: "10/31/2024",
        }),
    ]);
    const vacations = await fetchVacations();
    console.log(vacations);

    await destroyVacation(vacations[0].id);
    console.log(await fetchVacations());
};

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

init();
