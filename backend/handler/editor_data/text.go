package editor_data

type TextData struct {
	Type    uint8          `json:"type"               cbor:"0,keyasint"`
	Text    string         `json:"text,omitempty"     cbor:"1,keyasint,omitempty"`
	Color   string         `json:"color,omitempty"    cbor:"2,keyasint,omitempty"`
	BgColor string         `json:"bgColor,omitempty"  cbor:"3,keyasint,omitempty"`
	Top     TextFormatting `json:"top,omitempty"      cbor:"4,keyasint,omitempty"`
	Bottom  TextFormatting `json:"bottom,omitempty"   cbor:"5,keyasint,omitempty"`
	Left    TextFormatting `json:"left,omitempty"     cbor:"6,keyasint,omitempty"`
	Right   TextFormatting `json:"right,omitempty"    cbor:"7,keyasint,omitempty"`
}

type TextFormatting struct {
	Pad          uint   `json:"pad,omitempty"            cbor:"0,keyasint,omitempty"`
	Border       uint   `json:"border,omitempty"         cbor:"1,keyasint,omitempty"`
	BorderStyle  string `json:"borderStyle,omitempty"    cbor:"2,keyasint,omitempty"`
	BorderRadius uint   `json:"borderRadius,omitempty"   cbor:"3,keyasint,omitempty"`
	BorderColor  string `json:"borderColor,omitempty"    cbor:"4,keyasint,omitempty"`
}
