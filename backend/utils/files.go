package utils

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"github.com/kardianos/osext"
)

func JoinPath(pathToFileName ...string) string {
	return filepath.Join(pathToFileName...)
}

// Returns the path of the folder where the program is running.
//
// If it can't find the folder, it will stop the program and show an error.
func GetCurrentDir() (currentPath string) {
	folderPath, err := osext.ExecutableFolder()
	if err != nil {
		panic(err)
	}

	return folderPath
}

// Makes a new folder at the given path.
// It will create all the folders in the path if they don't exist.
//
// Returns an error if something goes wrong.
func CreateDirectory(path string) (makeDirError error) {
	fmt.Println("Creating directory:", path)
	return os.MkdirAll(path, 0666)
}

// Deletes a file or a folder at the given path.
//
// Returns an error if something goes wrong.
func RemoveFileOrDirectory(path string) (removeError error) {
	fmt.Println("Removing:", path)
	return os.Remove(path)
}

// Checks if a file exists at the given path.
//
// Returns true if the file exists, and false if it doesn't.
func IsFileExist(pathToFile string) (existOrNot bool) {
	_, err := os.Stat(pathToFile)
	return !errors.Is(err, os.ErrNotExist)
}

// Writes the given data (stuff) to a file at the given path.
//
// Returns an error if something goes wrong.
func WriteFile(pathToFile string, stuff []byte) (writeError error) {
	fmt.Println("Writing:", pathToFile)
	return os.WriteFile(pathToFile, stuff, os.ModePerm)
}

// Reads the data from a file at the given path.
//
// Returns the data as a byte array and an error if something goes wrong.
func ReadFile(pathToFile string) (fileContent []byte, readError error) {
	fmt.Println("Reading:", pathToFile)
	return os.ReadFile(pathToFile)
}
