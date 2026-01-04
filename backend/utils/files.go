package utils

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"toast/backend/debug"
)

// Takes a file path and rename the file's basename.
//
//	RenameFileInPath("path/to/old_file.txt", func(oldFilename string) string {
//	  return "new_file"
//	})
//	// returns "path/to/new_file.txt"
//
// Note: It only returns the new, full file path without modifying the file on the filesystem.
func RenameFileInPath(path string, newName func(oldFilename string) string) string {
	baseDir := filepath.Dir(path)
	fileExt := filepath.Ext(path)
	fileName := strings.Replace(filepath.Base(path), fileExt, "", 1)

	newFileName := newName(fileName)
	return filepath.Join(baseDir, newFileName+fileExt)
}

// Returns the current executable path.
// The function will `panic` if it cannot determine the executable's path.
func GetCurrentDir() (currentPath string) {
	folderPath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	return filepath.Dir(folderPath)
}

// Makes a new folder at the given path. It will create all
// intermediate directories in the path if they do not already exist.
func CreateDirectory(path string) (makeDirError error) {
	if debug.DEBUG_MODE {
		debug.Logf("Create directory: %s", path)
	}

	return os.MkdirAll(path, 0666)
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

// Checks if a directory exists at the given path.
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

// Writes the given data to a file at the specified path.
// It creates the file if it does not exist and overwrite it if it does.
func WriteFile(pathToFile string, stuff []byte) (writeError error) {
	if debug.DEBUG_MODE {
		debug.Logf("Write file: %s", pathToFile)
	}

	return os.WriteFile(pathToFile, stuff, os.ModePerm)
}

// Moves a file from a source path to a destination path.
// It first attempts a simple `os.Rename`, and if that fails (e.g., due to a cross-device move),
// it falls back to a copy-and-delete operation.
func MoveFile(sourcePath string, destPath string) error {
	// Attempt to rename (move) the file.
	err := os.Rename(sourcePath, destPath)
	if err == nil {
		return nil
	}

	// If rename fails (likely due to cross-device move), copy and remove.
	sourceFile, err := os.Open(sourcePath)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.Err(err)
		}
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(destPath)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.Err(err)
		}
		return err
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.Err(err)
		}
		// Attempt to remove the destination file in case of copy error.
		os.Remove(destPath)
		return err
	}

	return os.Remove(sourcePath)
}

// Copies a file from a source to a destination.
// It handles cases where the destination directory does not exist and ensures
// a destination file with the same name is not overwritten by creating a new, unique name.
func CopyFile(source, destinationPath string) error {
	if debug.DEBUG_MODE {
		debug.Log("Coping file.", "source", source, "dest path", destinationPath)
	}

	sourceFile, err := os.Open(source)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.Err(err)
		}
		return err
	}
	defer sourceFile.Close()

	sourceFileName := filepath.Base(source)
	destinationFilePath := filepath.Join(destinationPath, sourceFileName)

	// Ensure no file being overriten if the destination file path
	// has the same file name.
	if IsFileExist(destinationFilePath) {
		destinationFilePath = RenameFileInPath(destinationFilePath, func(oldFilename string) string {
			return fmt.Sprintf("%s_%s", oldFilename, GetRandomStringWithinLength(8))
		})
	}

	// Ensure the destination directory exists.
	if !IsDirectoryExist(destinationPath) {
		if err := CreateDirectory(destinationPath); err != nil {
			if debug.DEBUG_MODE {
				debug.Err(err)
			}

			return err
		}
	}

	destinationFile, err := os.Create(destinationFilePath)
	if err != nil {
		if debug.DEBUG_MODE {
			debug.Err(err)
		}
		return err
	}
	defer destinationFile.Close()

	_, err = io.Copy(destinationFile, sourceFile)
	if debug.DEBUG_MODE {
		if err != nil {
			debug.Err(err)
		}
	}

	return err
}
