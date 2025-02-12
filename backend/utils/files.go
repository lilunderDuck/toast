package utils

import (
	"errors"
	"os"

	"github.com/kardianos/osext"
)

func GetCurrentDir() string {
	folderPath, err := osext.ExecutableFolder()
	if err != nil {
		panic(err)
	}

	return folderPath
}

func CreateDirectory(path string) error {
	return os.MkdirAll(path, 0666)
}

func RemoveFileOrDirectory(path string) error {
	return os.Remove(path)
}

func IsFileExist(pathToFile string) bool {
	_, err := os.Stat(pathToFile)
	return !errors.Is(err, os.ErrNotExist)
}

func WriteFile(name string, stuff []byte) error {
	return os.WriteFile(name, stuff, os.ModePerm)
}

func ReadFile(name string) ([]byte, error) {
	return os.ReadFile(name)
}
