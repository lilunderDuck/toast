package editor_data

type TodoData struct {
	Id   int        `json:"id"     cbor:"0,keyasint"`
	Name string     `json:"name"   cbor:"1,keyasint"`
	Todo []TodoData `json:"todo"   cbor:"2,keyasint"`
}

type TodoContentData struct {
	Id          int    `json:"id"                        cbor:"0,keyasint"`
	Name        string `json:"name"                      cbor:"1,keyasint"`
	Description string `json:"description,omitempty"     cbor:"2,keyasint,omitempty"`
}
