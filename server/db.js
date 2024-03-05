const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_vacations_db"
);

const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS vacations;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS places;
    
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE places(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
    );
    CREATE TABLE vacations(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        place_id UUID REFERENCES places(id) NOT NULL,
        departure_date DATE
    );
    `;
    await client.query(SQL);
};

const createUser = async (name) => {
    const SQL = `
    INSERT INTO users(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createPlace = async (name) => {
    const SQL = `
    INSERT INTO places(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createVacation = async ({ place_id, user_id, departure_date }) => {
    const SQL = `
    INSERT INTO vacations(id, place_id, user_id, departure_date) VALUES($1, $2, $3, $4) RETURNING *
    `;
    const response = await client.query(SQL, [
        uuid.v4(),
        place_id,
        user_id,
        departure_date,
    ]);
    return response.rows[0];
};

const fetchUsers = async () => {
    const SQL = `
    SELECT * FROM users;
    `;
    const response = await client.query(SQL);
    return response.rows;
};
const fetchPlaces = async () => {
    const SQL = `
    SELECT * FROM places;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchVacations = async () => {
    const SQL = `
    SELECT * FROM vacations;
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const destroyVacation = async (vacatioId) => {
    const SQL = `
    DELETE FROM vacations WHERE id = $1
    `;
    await client.query(SQL, [vacatioId]);
};

module.exports = {
    client,
    createTables,
    createUser,
    createPlace,
    createVacation,
    fetchUsers,
    fetchPlaces,
    fetchVacations,
    destroyVacation,
};
