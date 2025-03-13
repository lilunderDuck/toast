package utils

import (
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"

	"github.com/kardianos/osext"
)

// Takes a bunch of parts of a file path and puts them together into one complete path.
//
// Returns the complete file path. Example:
//
//	JoinPath("path", "to", "some_file.txt")
//	// returns "path/to/some_file.txt"
//
// Parameters:
//   - pathToFileName: A list of strings, where each string is a part of the file path.
//
// See: https://pkg.go.dev/path/filepath#Join
func JoinPath(pathToFileName ...string) string {
	return filepath.Join(pathToFileName...)
}

// Takes a file path and gives you just the file's name, including its extension.
// The extension is the part at the end, like ".txt" or ".jpg".
//
// Returns the file name with its extension. Example:
//
//	GetFileNameWithExtension("path/to/some_file.txt")
//	// returns "some_file.txt"
//
// Parameters:
//   - inAnyPath: The full file path.
//
// See: https://pkg.go.dev/path/filepath#Base
func GetFileNameWithExtension(inAnyPath string) string {
	return filepath.Base(inAnyPath)
}

// Takes a file path and gives you the folder (directory) where the file is located.
//
// Returns the directory (folder) part of the path. Example:
//
//	GetFileNameWithExtension("path/to/some_file.txt")
//	// returns "path/to"
//
// Parameters:
//   - inAnyPath: The full file path.
//
// See: https://pkg.go.dev/path/filepath#Dir
func GetFileDir(inAnyPath string) string {
	return filepath.Dir(inAnyPath)
}

// Takes a file path and gives you just the file's extension.
// The extension is the part at the end, like ".txt" or ".jpg".
//
// Returns the file's extension (including the dot). Example:
//
//	GetFileNameWithExtension("path/to/some_file.txt")
//	// returns ".txt"
//
// Parameters:
//   - inAnyPath: The full file path.
//
// See: https://pkg.go.dev/path/filepath#Ext
func GetFileExtension(inAnyPath string) string {
	return filepath.Ext(inAnyPath)
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

func MoveFile(sourcePath string, destPath string) error {
	fmt.Println("Moving:", sourcePath, "to", destPath)
	// Attempt to rename (move) the file.
	err := os.Rename(sourcePath, destPath)
	if err == nil {
		return nil
	}

	// If rename fails (likely due to cross-device move), copy and remove.
	sourceFile, err := os.Open(sourcePath)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	if err != nil {
		// Attempt to remove the destination file in case of copy error.
		os.Remove(destPath)
		return err
	}

	err = os.Remove(sourcePath)
	return err
}

func CopyFile(source, destination string) error {
	sourceFile, err := os.Open(source)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	// Ensure the destination directory exists.
	destinationDir := filepath.Dir(destination)
	if _, err := os.Stat(destinationDir); os.IsNotExist(err) {
		err = os.MkdirAll(destinationDir, 0755)
		if err != nil {
			return err
		}
	}

	destinationFile, err := os.Create(destination)
	if err != nil {
		return err
	}
	defer destinationFile.Close()

	_, err = io.Copy(destinationFile, sourceFile)
	if err != nil {
		return err
	}
	return nil
}
