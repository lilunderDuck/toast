package utils

import (
	"errors"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/kardianos/osext"
)

// Takes a bunch of parts of a file path and puts them together into one complete path.
//
//	JoinPath("path", "to", "some_file.txt")
//	// returns "path/to/some_file.txt"
func JoinPath(pathToFileName ...string) string {
	return filepath.Join(pathToFileName...)
}

// Takes a file path and gives you just the file's name, including its extension.
//
//	GetFileNameWithExtension("path/to/some_file.txt")
//	// returns "some_file.txt"
func GetFileNameWithExtension(inAnyPath string) string {
	return filepath.Base(inAnyPath)
}

// Takes a file path and gives you just the file's name.
//
// Not to be confused with [utils.GetFileNameWithExtension()], it include
// the file extension. This function does not.
//
//	GetFileName("path/to/some_file.txt")
//	// returns "some_file"
func GetFileName(path string) string {
	fileNameWithExt := GetFileNameWithExtension(path)
	fileExt := GetFileExtension(path)
	return strings.TrimSuffix(fileNameWithExt, fileExt)
}

// Takes a file path and gives you the folder (directory) where the file is located.
//
//	GetFileDir("path/to/some_file.txt")
//	// returns "path/to/"
func GetFileDir(inAnyPath string) string {
	return filepath.Dir(inAnyPath)
}

// Takes a file path and gives you just the file's extension.
//
//	GetFileExtension("path/to/some_file.txt")
//	// returns ".txt"
func GetFileExtension(inAnyPath string) string {
	return filepath.Ext(inAnyPath)
}

// Takes a file path and rename the file in a path.
//
// Note: this does not do anything to rename the file name in the file system.
//
//	RenameFileInPath("path/to/old_file.txt", func(oldFilename string) string {
//	  return "new_file"
//	})
//	// returns "path/to/new_file.txt"
func RenameFileInPath(path string, newName func(oldFilename string) string) string {
	baseDir := GetFileDir(path)
	fileExt := GetFileExtension(path)
	fileName := GetFileName(path)

	newFileName := newName(fileName)
	return JoinPath(baseDir, newFileName+fileExt)
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
func CreateDirectory(path string) (makeDirError error) {
	return os.MkdirAll(path, 0666)
}

// Deletes a file or a folder at the given path.
func RemoveFileOrDirectory(path string) (removeError error) {
	return os.Remove(path)
}

// Checks if a file exists at the given path.
func IsFileExist(pathToFile string) (existOrNot bool) {
	_, err := os.Stat(pathToFile)
	if err == nil {
		return true
	}

	if errors.Is(err, fs.ErrNotExist) {
		return false
	}

	return false
}

// Writes the given data (stuff) to a file at the given path.
func WriteFile(pathToFile string, stuff []byte) (writeError error) {
	return os.WriteFile(pathToFile, stuff, os.ModePerm)
}

// Reads the data from a file at the given path.
func ReadFile(pathToFile string) (fileContent []byte, readError error) {
	return os.ReadFile(pathToFile)
}

func OpenFile(pathToFile string) (*os.File, error) {
	return os.Open(pathToFile)
}

func MoveFile(sourcePath string, destPath string) error {
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
