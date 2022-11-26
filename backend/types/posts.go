package types

type NewPost struct {
	Content string `json:"content"`
	SongUrl string `json:"song_url"`
}

type NewComment struct {
	Content string `json:"content"`
}
