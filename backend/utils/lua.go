package utils

import (
	// "fmt"

	lua "github.com/yuin/gopher-lua"
)

const LUA_NO_RESULT int = 0
const LUA_ONE_RESULT int = 1

const LUA_STATUS_SUCCESS int = 0
const LUA_STATUS_ERROR int = 1

type LuaFunctionMapping map[string]lua.LGFunction

func CreateLuaModule(runtime *lua.LState, moduleName string, funcs LuaFunctionMapping) {
	runtime.PreloadModule(moduleName, func(state *lua.LState) int {
		module := runtime.SetFuncs(runtime.NewTable(), funcs, nil)
		runtime.Push(module)
		return LUA_ONE_RESULT
	})
}
