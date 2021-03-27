exports.up = function(knex) {
    return knex.schema
      .createTable('Action', function (table) {
        table.string('Action_id', 40)
             .notNullable()
             .primary()
             .references('activity_id')
             .inTable('Activity'); 
        table.decimal('position_x', 9, 6)
             .notNullable();
        table.decimal('position_y', 9, 6)
             .notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
        .dropTable("Action")
  };