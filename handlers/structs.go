package handlers

type ContactInfo struct {
	Id       int    `json:"id" db:"id"`
	RawText  string `json:"raw_text" db:"raw_text"`
	Name     string `json:"name" db:"name"`
	Status   string `json:"status" db:"status"`
	Email    string `json:"email" db:"email"`
	Phone    string `json:"phone" db:"phone"`
	Mentions string `json:"mentions" db:"mentions"`
	Url      string `json:"url" db:"url"`
}

type FilterContact struct {
	Column string `json:"column"`
	Value  string `json:"value"`
}
