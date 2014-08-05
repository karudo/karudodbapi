module.exports = {
  databases: {
    name: 'Databases',
    methods: 'MysqlDatabaseCollection',
    childs: {
      tables: {
        name: 'Tables',
        methods: 'MysqlTableCollection',
        childs: {
          rows: {
            name: "Rows",
            methods: 'MysqlTableRowCollection'
          }
        }
      }
    }
  }
};