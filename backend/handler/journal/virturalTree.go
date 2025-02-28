package journal

// peak maximum data compression

// Represents a node in a virtual tree structure.
// It has an ID and a list of child nodes.
type VirTree struct {
	Id    int       `json:"id"               cbor:"0,keyasint"`
	Child []VirTree `json:"child,omitempty"  cbor:"0,keyasint"`
}

// Representing a list of virtual trees.
type VirTreeList []VirTree

// Holds the data for a virtual tree, including a list of IDs and a list of [VirTree] nodes.
type VirTreeData struct {
	List []int       `json:"list"   cbor:"0,keyasint"`
	Data VirTreeList `json:"data"   cbor:"1,keyasint"`
}

// This is a cached version of [VirTreeData], using a map for the list of [VirTree] nodes.
type CachedVirTreeData struct {
	List map[int]VirTree `json:"list"   cbor:"0,keyasint"`
	Data VirTreeList     `json:"data"   cbor:"1,keyasint"`
}

// Initializes and returns a new [VirTreeData] with empty lists.
// It's used to create a new virtual tree structure.
//
// Returns a new VirTreeData with empty lists.
func VirTree_Create() VirTreeData {
	return VirTreeData{
		List: []int{},
		Data: VirTreeList{},
	}
}
