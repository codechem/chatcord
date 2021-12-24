
exports.up = function (knex) {
    return knex.schema
        .createTable('channels', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.string('description', 255);
            table.string('topic', 255);
        })
        .createTable('messages', function (table) {
            table.increments('id');
            table.datetime('sent', { precision: 6 }).defaultTo(knex.fn.now());
            table.text('content');
            table.integer('from')
                .unsigned()
                .references('id')
                .inTable('users');
            table.integer('channel')
                .unsigned()
                .references('id')
                .inTable('channels');
        })
        .createTable('users', function (table) {
            table.increments('id');
            table.string('username', 255).notNullable();
            table.string('password', 255).notNullable();
        })
        .createTable('sessions', function (table) {
            table.increments('id');
            table.string('sessionId').notNullable();
            table.integer('user')
                .unsigned()
                .references('id')
                .inTable('users')
        })
};

exports.down = function (knex) {
    return knex.schema
        .dropTable("messages")
        .dropTable("channels")
        .dropTable("users")
        .dropTable("sessions")
};

