package internals

import (
	"os"
	"os/exec"
	"strings"
	"toast/backend/debug"
)

func ExecuteCommand(name string, command ...string) {
	if debug.DEBUG_MODE {
		debug.InfoLabelf("internals", "Executing command: %s %s", name, strings.Join(command, " "))
	}

	cmd := exec.Command(name, command...)
	if debug.DEBUG_MODE {
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
	}

	if err := cmd.Run(); err != nil {
		if debug.DEBUG_MODE {
			// Honestly I'm quite good at a few thing, and the first in the list
			// is ignoring error... in production
			debug.ErrLabelf("internals", "Failed to execute command")
			debug.ErrLabel("internals", err)
		}

		// Whatever after this scope will be deepen in the dirt layers.
	}
}
