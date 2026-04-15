package playlist

import (
	"toast/backend/utils"
)

type PlaylistTrackData struct { // impl: simdb.Entity
	Name     utils.CompressableString `cbor:"0,keyasint" json:"name"`
	Artist   utils.CompressableString `cbor:"1,keyasint" json:"artist"`
	Icon     utils.CompressableString `cbor:"2,keyasint" json:"icon"`
	Duration uint                     `cbor:"3,keyasint" json:"duration"`
	Id       int                      `cbor:"4,keyasint" json:"id"`
	Filename utils.CompressableString `cbor:"4,keyasint" json:"filename"`
}

func (data PlaylistTrackData) ID() (jsonField string, value any) {
	jsonField = "id"
	value = data.Id
	return
}

type PlaylistData struct {
	Name          utils.CompressableString `cbor:"0,keyasint" json:"name"`
	Icon          utils.CompressableString `cbor:"1,keyasint" json:"icon"`
	TotalDuration uint                     `cbor:"2,keyasint" json:"totalDuration"`
	Id            int                      `cbor:"3,keyasint" json:"id"`
}
