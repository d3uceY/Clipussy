package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)
// to read clipboard contents, use cli command <<< go get github.com/atotto/clipboard >>>

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	appDir, err := getAppDataDir()
	if err != nil {
		panic(err)
	}

	dbPath := filepath.Join(appDir, "gyatt.db")
    
	err = InitDB(dbPath)
	if err != nil {
		panic(err)
	}

	createTables()
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// get app data directory
func getAppDataDir() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	appDir := filepath.Join(dir, "clipussy/db")
	err = os.MkdirAll(appDir, 0755)

	return appDir, err
}
