#pragma once
#include <windows.h>
#include <stdbool.h>

// Some stuff being renamed because I don't want to confuse myself.

typedef char*         string;
typedef const char**  cmdArgs;
// A long name for "handle to a window"
#define WINDOW_HANDLE  HWND

#define DLL_EXPORT     __declspec(dllexport)

#define TYPE_FILE_DIALOG        0x00
#define TYPE_DIRECTORY_DIALOG   0x01

// Simply open the file dialog... with options
// 
// Returns an empty string if dialog is canceled.
string openSomeKindOfDialog(
  string title, 
  string filter, 
  WINDOW_HANDLE owner,
  int dialogType, 
  bool isMultiSelected
);