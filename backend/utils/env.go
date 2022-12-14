package utils

import (
	"os"

	"github.com/joho/godotenv"
)

var (
	ApiPort    string
	DbHost     string
	DbUser     string
	DbPass     string
	DbName     string
	DbPort     string
	SigningKey []byte
)

func LoadEnv() {
	godotenv.Load(".env")
	ApiPort = getEnv("PORT", "8000")

	DbHost = getEnv("POSTGRES_HOST", "localhost")
	DbUser = getEnv("POSTGRES_USER", "user")
	DbPass = getEnv("POSTGRES_PASSWORD", "password")
	DbName = getEnv("POSTGRES_DB", "postgres")
	DbPort = getEnv("POSTGRES_PORT", "5432")

	secretKey := getEnv("SECRET_KEY", "secret")
	SigningKey = []byte(secretKey)
}

func getEnv(key string, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}
