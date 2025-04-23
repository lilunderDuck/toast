package editor_data

type ImageData struct {
	ImgName     string `json:"imgName,omitempty"       cbor:"10,keyasint,omitempty"`
	Description string `json:"description,omitempty"   cbor:"11,keyasint,omitempty"`
}
