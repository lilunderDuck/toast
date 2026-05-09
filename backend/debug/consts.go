package debug

const (
	LABEL_MAX_LENGTH     = 10
	LOG_LABEL_MAX_LENGTH = 4
)

// See:
// https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
const (
	COLOR_RESET   = "\x1b[0m"
	COLOR_RED     = "\x1b[31m"
	COLOR_GREEN   = "\x1b[32m"
	COLOR_YELLOW  = "\x1b[33m"
	COLOR_BLUE    = "\x1b[34m"
	COLOR_MAGENTA = "\x1b[35m"
	COLOR_CYAN    = "\x1b[36m"
	COLOR_WHITE   = "\x1b[37m"
	COLOR_GRAY    = "\033[90m"
)

const (
	STYLE_BOLD          = "\x1B[1m"
	STYLE_ITALIC        = "\x1B[3m"
	STYLE_UNDERLINE     = "\x1B[4m"
	STYLE_STRIKETHROUGH = "\x1B[9m"
	STYLE_NONE          = ""
)

const (
	LOG_LABEL_INFO  = COLOR_CYAN + STYLE_BOLD + "INFO" + COLOR_RESET
	LOG_LABEL_WARN  = COLOR_YELLOW + STYLE_BOLD + "WARN" + COLOR_RESET
	LOG_LABEL_ERROR = COLOR_RED + STYLE_BOLD + "ERRO" + COLOR_RESET
	LOG_LABEL_FATAL = COLOR_MAGENTA + STYLE_BOLD + "FATA" + COLOR_RESET
)
