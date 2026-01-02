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

	// start clipboard listener
	clipboard.StartClipboardListener(func() {
		text, err := clip.ReadAll()
		if err != nil || text == "" {
			return
		}

		// Save to database
		err = addClip(text, "text")
		if err != nil {
			fmt.Printf("Failed to save clip to database: %v\n", err)
			return
		}

		// Notify frontend
		runtime.EventsEmit(a.ctx, "clipboard:changed", text)
	})
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// GetClips returns all clips from the database
func (a *App) GetClips() ([]Clip, error) {
	return getClips()
}

// TogglePin toggles the pinned status of a clip
func (a *App) TogglePin(clipID int) error {
	return togglePinClip(clipID)
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
