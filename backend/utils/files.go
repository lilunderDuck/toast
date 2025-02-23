package utils

import (
	"errors"
	"fmt"
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
	fmt.Println("Creating directory:", path)
	return os.MkdirAll(path, 0666)
}

func RemoveFileOrDirectory(path string) error {
	fmt.Println("Removing:", path)
	return os.Remove(path)
}

func IsFileExist(pathToFile string) bool {
	_, err := os.Stat(pathToFile)
	return !errors.Is(err, os.ErrNotExist)
}

func WriteFile(pathToFile string, stuff []byte) error {
	fmt.Println("Writing:", pathToFile)
	return os.WriteFile(pathToFile, stuff, os.ModePerm)
}

func ReadFile(pathToFile string) ([]byte, error) {
	fmt.Println("Reading:", pathToFile)
	return os.ReadFile(pathToFile)
}
