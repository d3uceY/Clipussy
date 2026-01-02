package main

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

// to install sqlite, use cli command <<< go get modernc.org/sqlite >>>

var DB *sql.DB

func InitDB(path string) error {
	var err error
	DB, err = sql.Open("sqlite", path)
	if err != nil {
		return err
	}

	fmt.Println("DB initialized on Bro")

	// ping this shit
	return DB.Ping()
}

func createTables() {
	query := `
   CREATE TABLE IF NOT EXISTS clips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT,
  type TEXT,
  pinned BOOLEAN DEFAULT 0,
  created_at DATETIME
);
    `
	_, err := DB.Exec(query)
	if err != nil {
		fmt.Printf("SQL Error: %v\nQuery: %s\n", err, query)
		panic(err)
	}
}
