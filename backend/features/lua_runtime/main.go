package lua_runtime

import (
	"toast/backend/features/lua_runtime/http"

	lua "github.com/yuin/gopher-lua"
)

func New(luaFilePath string) error {
	runtime := lua.NewState()
	defer runtime.Close()
	// runtime.
	http.Preload(runtime)
	return runtime.DoFile(luaFilePath)
}
