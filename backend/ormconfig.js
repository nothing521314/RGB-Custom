module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'medusa-docker',
    entities: [__dirname + '/src/models/*{.ts,.js}'],
    migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    migrationsRun: false,
    cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/migrations',
    },
    // Timezone configured on the MySQL server.
    // This is used to typecast server date/time values to JavaScript Date object and vice versa.
    timezone: 'Z',
    synchronize: false,
};
