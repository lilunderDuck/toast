#include <string.h>
#include <stdio.h>
// ...
#include "baseDialog.h"

string openSomeKindOfDialog(
  const string title, 
  const string filter, 
  WINDOW_HANDLE owner,
  int dialogType, 
  bool isMultiSelected
) {
  printf("title: %s\nfilter: %s", title, filter);
  OPENFILENAME fileDialog;
  char fileName[MAX_PATH] = "";
  ZeroMemory(&fileDialog, sizeof(fileDialog));

  fileDialog.hwndOwner = owner;
  fileDialog.lStructSize = sizeof(OPENFILENAME);
  fileDialog.lpstrFilter = filter;
  fileDialog.lpstrFile = fileName;
  fileDialog.lpstrTitle = title;
  fileDialog.lpstrDefExt = "";
  fileDialog.nMaxFile = MAX_PATH;

  DWORD dialogFlag = OFN_EXPLORER | OFN_HIDEREADONLY;
  switch (dialogType) {
    case TYPE_FILE_DIALOG:
      dialogFlag = dialogFlag | OFN_FILEMUSTEXIST;
      break;
    case TYPE_DIRECTORY_DIALOG:
      dialogFlag = dialogFlag | OFN_PATHMUSTEXIST;
      break;
    default:
      printf("dialog type %d is not exist.", dialogType);
      return "";
  }

  if (isMultiSelected) {
    dialogFlag = dialogFlag | OFN_ALLOWMULTISELECT;
  }

  fileDialog.Flags = dialogFlag;

  string selectedFilePath = "";
  printf("opening file dialog\n");
  if (GetOpenFileName(&fileDialog)) {
    selectedFilePath = fileName;
  }

  printf("return back\n");
  return selectedFilePath;
}

DLL_EXPORT string openFileDialog(
  const string title, 
  const string filter, 
  WINDOW_HANDLE owner
) {
  return openSomeKindOfDialog(
    title,
    filter,
    owner,
    TYPE_FILE_DIALOG,
    false
  );
}

DLL_EXPORT string openMultiFileDialog(
  const string title, 
  const string filter, 
  WINDOW_HANDLE owner
) {
  return openSomeKindOfDialog(
    title,
    filter,
    owner,
    TYPE_FILE_DIALOG,
    true
  );
}