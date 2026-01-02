package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"Clipussy/internal/clipboard"

	clip "github.com/atotto/clipboard"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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

	clipboard.StartClipboardListener(func() {
		text, err := clip.ReadAll()
		if err != nil || text == "" {
			return
		}

		runtime.EventsEmit(a.ctx, "clipboard:changed", text)
	})
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
