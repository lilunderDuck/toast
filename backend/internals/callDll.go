package internals

import (
	"fmt"
	"syscall"
	"unsafe"
)

const NULL_PTR = 0

func CallDll(name string, fnName string, args ...uintptr) (result uintptr, callDllErr error) {
	fmt.Printf("[dll call] call %s\n", name)
	thisDll := syscall.NewLazyDLL(name)
	proc := thisDll.NewProc(fnName)

	result, _, err := proc.Call(args...)
	if err != nil {
		fmt.Println("[dll call]", err, UintptrToString(result))
		return NULL_PTR, err
	}

	fmt.Println("[dll call] ok")
	return result, nil
}

func StringToUintptr(anything string) uintptr {
	b := append([]byte(anything), 0)
	return uintptr(unsafe.Pointer(&b[0]))
}

func UintptrToString(pointer uintptr) string {
	secretBytes := (*byte)(unsafe.Pointer(pointer))
	return unsafe.String(secretBytes, 256)
}
