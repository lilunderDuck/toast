package utils

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

// Takes a file path and rename the file in a path.
//
// Note: this does not do anything to rename the file name in the file system.
//
//	RenameFileInPath("path/to/old_file.txt", func(oldFilename string) string {
//	  return "new_file"
//	})
//	// returns "path/to/new_file.txt"
func RenameFileInPath(path string, newName func(oldFilename string) string) string {
	baseDir := filepath.Dir(path)
	fileExt := filepath.Ext(path)
	fileName := strings.Replace(filepath.Base(path), fileExt, "", 1)

	newFileName := newName(fileName)
	return filepath.Join(baseDir, newFileName+fileExt)
}

// Returns the path of the folder where the program is running.
//
// If it can't find the folder, it will stop the program and show an error.
func GetCurrentDir() (currentPath string) {
	folderPath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	return filepath.Dir(folderPath)
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

func IsDirectoryExist(path string) (existOrNot bool) {
	info, err := os.Stat(path)
	if err == nil {
		return info.IsDir()
	}
	if os.IsNotExist(err) {
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

	// Ensure no file being overriten if the destination file path
	// has the same file name.
	if IsFileExist(destination) {
		destination = RenameFileInPath(destination, func(oldFilename string) string {
			return fmt.Sprintf("%s_%s", oldFilename, GetRandomStringWithinLength(8))
		})
	}

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
