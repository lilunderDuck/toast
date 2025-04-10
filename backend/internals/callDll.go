package internals

import (
	"fmt"
	"syscall"
	"unsafe"
)

const NULL_PTR = 0

type CallDllFn func(fnName string, args ...uintptr) (result uintptr, callDllErr error)

func CallDll(name string) CallDllFn {
	fmt.Printf("[dll call] call %s\n", name)
	thisDll := syscall.NewLazyDLL(name)
	return func(fnName string, args ...uintptr) (result uintptr, callDllErr error) {
		proc := thisDll.NewProc(fnName)
		result, _, err := proc.Call(args...)
		if err != nil {
			fmt.Println("[dll call]", err)
			return NULL_PTR, err
		}

		return result, nil
	}
}

func StringToUintptr(anything string) uintptr {
	filterBytes := append([]byte(anything), 0)
	filterPtr := uintptr(unsafe.Pointer(&filterBytes))
	return filterPtr
}
