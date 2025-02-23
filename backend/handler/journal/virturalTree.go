package journal

// peak maximum data compression

type VirTree struct {
	Id    int       `json:"id"               cbor:"0,keyasint"`
	Child []VirTree `json:"child,omitempty"  cbor:"0,keyasint"`
}

type VirTreeList []VirTree

type VirTreeData struct {
	List []int       `json:"list"   cbor:"0,keyasint"`
	Data VirTreeList `json:"data"   cbor:"1,keyasint"`
}

type CachedVirTreeData struct {
	List map[int]VirTree `json:"list"   cbor:"0,keyasint"`
	Data VirTreeList     `json:"data"   cbor:"1,keyasint"`
}

func VirTree_Create() VirTreeData {
	return VirTreeData{
		List: []int{},
		Data: VirTreeList{},
	}
}
