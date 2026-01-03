package main

import (
	"fmt"
)

type Clip struct {
	ID        string `json:"id"`
	Content   string `json:"content"`
	Length    int    `json:"length"`
	Pinned    bool   `json:"isPinned"`
	CreatedAt string `json:"createdAt"`
}

// this gets all clips
func getClips() ([]Clip, error) {
	// we want to limit the amount of clips to only hundred, the LIMIT was not added because i
	// already trim out some clips every time a new one is inserted. check addClip() 
	query := `SELECT id, content, type, pinned, created_at FROM clips ORDER BY pinned DESC, created_at DESC`
	rows, err := DB.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query clips: %v", err)
	}
	defer rows.Close()

	var clips []Clip
	for rows.Next() {
		var id int
		var content, clipType, createdAt string
		var pinned bool
		err := rows.Scan(&id, &content, &clipType, &pinned, &createdAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan clip: %v", err)
		}
		
		clips = append(clips, Clip{
			ID:        fmt.Sprintf("clip_%03d", id),
			Content:   content,
			Length:    len(content),
			Pinned:    pinned,
			CreatedAt: createdAt,
		})
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating clips: %v", err)
	}

	return clips, nil
}


// this adds a new clip typeshit
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

// this pins/unpins a clip by toggling its pinned status
func togglePinClip(clipID int) error {
	query := `UPDATE clips SET pinned = NOT pinned WHERE id = ?`
	result, err := DB.Exec(query, clipID)
	if err != nil {
		return fmt.Errorf("failed to toggle pin status: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("clip with id %d not found", clipID)
	}

	return nil
}

// this deletes a clip by its ID
func deleteClip(clipID int) error {
	query := `DELETE FROM clips WHERE id = ?`
	result, err := DB.Exec(query, clipID)
	if err != nil {
		return fmt.Errorf("failed to delete clip: %v", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %v", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("clip with id %d not found", clipID)
	}

	return nil
}