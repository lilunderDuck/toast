#include <windows.h>
#include <string.h>
#include <iostream>

// Mark any function as dll exports and also make sure to tell the compiler 
// that "don't mess this function's name please"
#define DLL_EXPORT     extern "C" __declspec(dllexport)

// A long name for "handle to a window"
#define WINDOW_HANDLE  HWND

// Simply open the file dialog... with options
// 
// Returns an empty string if dialog is canceled
// 
// Of course, I steal this code, don't ask me what all of this stuff means here.
// Thanks :)
std::string this_openFileDialog(char* filter, WINDOW_HANDLE owner, bool isMultiSelected) {
  OPENFILENAME fileDialog;
  char fileName[MAX_PATH] = "";
  ZeroMemory(&fileDialog, sizeof(fileDialog));

  fileDialog.lStructSize = sizeof(OPENFILENAME);
  fileDialog.hwndOwner = owner;
  fileDialog.lpstrFilter = filter;
  fileDialog.lpstrFile = fileName;
  fileDialog.nMaxFile = MAX_PATH;
  fileDialog.lpstrDefExt = "";
  fileDialog.Flags = OFN_EXPLORER | OFN_FILEMUSTEXIST | OFN_HIDEREADONLY;
  if (isMultiSelected) {
    fileDialog.Flags = fileDialog.Flags | OFN_ALLOWMULTISELECT;
  }

  std::string selectedFilePath;

  if (GetOpenFileNameW(&fileDialog)) {
    selectedFilePath = fileName;
  }

  return selectedFilePath;
}

DLL_EXPORT std::string openFileDialog(
  char* filter = "All Files (*.*)\0*.*\0", 
  WINDOW_HANDLE owner = NULL
) {
  return this_openFileDialog(filter, owner, false);
}

DLL_EXPORT std::string openMultiFileDialog(
  char* filter = "All Files (*.*)\0*.*\0", 
  WINDOW_HANDLE owner = NULL
) {
  return this_openFileDialog(filter, owner, true);
}