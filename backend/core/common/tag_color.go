package common

import (
	"errors"
	"fmt"
	"toast/backend/debug"
)

const (
	COLOR_TYPE_HEX = 0
)

// The encoded, extremely-packed color data.
//
// Structure:
//
//	[colorType, red, green, blue, alpha]
//
// Where:
//   - colorType: The color type, example: hex, hsl, rgb, ... This is used to convert
//     it back to original format
//   - red, green, blue, alpha: Ofc, it's the color data.
type EncodedTagColorData [5]uint8

func parseColor(colorString string) *EncodedTagColorData {
	switch {
	case colorString[0] == '#':
		return parseHexColor(colorString)
	}

	if debug.DEBUG_MODE {
		debug.ErrLabel("color", fmt.Errorf("color is not implement or an invalid color: %s", colorString))
	}

	return nil
}

func unparseColor(data EncodedTagColorData) string {
	switch data[0] {
	case COLOR_TYPE_HEX:
		return fmt.Sprintf("#%02x%02x%02x%02x", data[1], data[2], data[3], data[4])
	default:
		if debug.DEBUG_MODE {
			debug.ErrLabel("color", fmt.Errorf("invalid color type or case not handled: %d", COLOR_TYPE_HEX))
		}

		return ""
	}
}

// Original code is retrieved from:
//   https://github.com/g4s8/hexcolor/blob/master/hexcolor.go
//   https://stackoverflow.com/a/54200713/1723695

// Some constants here, because the original code is filled with
// magic constants.
const (
	// Shorthanded variation hex color: #RGB
	HEX_SHORTHAND_LENGTH = 4
	// Shorthanded variation hex color with alpha channel: #RGBA
	HEX_SHORTHAND_WITH_ALPHA_LENGTH = 5
	// Full variation hex color: #RRGGBB
	HEX_FULL_LENGTH = 7
	// Full variation hex color with alpha channel: #RRGGBBAA
	HEX_FULL_WITH_ALPHA_LENGTH = 9
	// Magic constants to expand shorthands hex color to their full 8-bit
	// per channel value.
	//
	// That's mean to double the digits.
	//
	// Trust me, I have to search why there're so many magic constant 0x11 (17) in the code.
	HEX_EXPAND_SHORTHAND_HEX_COLOR = 17
)

// Parse hex string to [EncodedTagColorData].
//
// In case of invalid hex, it logs an error in deverlopment mode.
func parseHexColor(hex string) *EncodedTagColorData {
	var r, g, b uint8
	var a uint8 = 0xff

	// The code that detect color is already check for "#" in the beginning,
	// so I just put it in debug.DEBUG_MODE, in case funky stuff.
	if debug.DEBUG_MODE {
		if len(hex) == 0 || hex[0] != '#' {
			debug.WarnLabel("color", "hex color must not be empty and start with a '#'")
			return nil
		}
	}

	// Strip the '#'
	hex = hex[1:]

	// This is really some black magic, trust me
	switch len(hex) {
	case HEX_FULL_WITH_ALPHA_LENGTH:
		r = (hexToByte(hex[0]) << 4) + hexToByte(hex[2])
		g = (hexToByte(hex[2]) << 4) + hexToByte(hex[4])
		b = (hexToByte(hex[4]) << 4) + hexToByte(hex[6])
		a = (hexToByte(hex[6]) << 4) + hexToByte(hex[8])
	case HEX_FULL_LENGTH:
		r = (hexToByte(hex[0]) << 4) + hexToByte(hex[2])
		g = (hexToByte(hex[2]) << 4) + hexToByte(hex[4])
		b = (hexToByte(hex[4]) << 4) + hexToByte(hex[6])
	case HEX_SHORTHAND_WITH_ALPHA_LENGTH:
		r = hexToByte(hex[0]) * HEX_EXPAND_SHORTHAND_HEX_COLOR
		g = hexToByte(hex[1]) * HEX_EXPAND_SHORTHAND_HEX_COLOR
		b = hexToByte(hex[2]) * HEX_EXPAND_SHORTHAND_HEX_COLOR
		a = hexToByte(hex[3]) * HEX_EXPAND_SHORTHAND_HEX_COLOR
	case HEX_SHORTHAND_LENGTH:
		r = hexToByte(hex[0]) * HEX_EXPAND_SHORTHAND_HEX_COLOR
		g = hexToByte(hex[1]) * HEX_EXPAND_SHORTHAND_HEX_COLOR
		b = hexToByte(hex[2]) * HEX_EXPAND_SHORTHAND_HEX_COLOR
	default:
		if debug.DEBUG_MODE {
			insufficentLength := fmt.Errorf(
				"invalid hex color format, hex color length must be %d, %d, %d or %d",
				HEX_SHORTHAND_LENGTH,
				HEX_SHORTHAND_WITH_ALPHA_LENGTH,
				HEX_FULL_LENGTH,
				HEX_FULL_WITH_ALPHA_LENGTH,
			)
			debug.ErrLabel("color", insufficentLength, "color", hex)
		}
	}

	return &EncodedTagColorData{COLOR_TYPE_HEX, r, g, b, a}
}

func hexToByte(b byte) byte {
	switch {
	case b >= '0' && b <= '9':
		return b - '0'
	case b >= 'a' && b <= 'f':
		return 10 + b - 'a'
	case b >= 'A' && b <= 'F':
		return 10 + b - 'A'
	}
	if debug.DEBUG_MODE {
		debug.ErrLabel("color", errors.New("invalid hex color format"))
	}
	return 0
}

func uint8ToHexString(value uint8) string {
	return fmt.Sprintf("%02x", value)
}
