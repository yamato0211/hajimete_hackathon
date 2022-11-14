package types

type JWTInfo struct {
	JWT string `json:"jwt"`
}

type SignUpUser struct {
	Name     string `form:"name" json:"name"`
	Email    string `form:"email" json:"email"`
	Password string `form:"password" json:"password"`
}

type SignInUser struct {
	Email    string `form:"email" json:"email"`
	Password string `form:"password" json:"password"`
}
