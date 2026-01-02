package main

import (
	"fmt"
)



// this adds a new clip
func addClip(content string, clipType string) error {
	query := `INSERT INTO clips (content, type, created_at) VALUES (?, ?, datetime('now'))`
	_, err := DB.Exec(query, content, clipType)
	if err != nil {
		return fmt.Errorf("failed to insert clip: %v", err)
	}
	
	// Delete old clips, keeping only the 100 most recent (prioritizing pinned)
	deleteQuery := `
		DELETE FROM clips
		WHERE id NOT IN (
			SELECT id FROM clips
			ORDER BY pinned DESC, created_at DESC
			LIMIT 100
		)
	`
	_, err = DB.Exec(deleteQuery)
	if err != nil {
		return fmt.Errorf("failed to delete old clips: %v", err)
	}
	
	return nil
}