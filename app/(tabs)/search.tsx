import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useObjectStore } from "@/stores/objectStore";
import { Search, Filter, X } from "lucide-react-native";
import { ObjectListItem } from "@/components/ObjectListItem";

export default function SearchScreen() {
  const router = useRouter();
  const { objects, fetchObjects } = useObjectStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    color: "",
    shape: "",
    size: "",
    location: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredObjects, setFilteredObjects] = useState([]);

  useEffect(() => {
    loadObjects();
  }, []);

  useEffect(() => {
    filterObjects();
  }, [searchQuery, filters, objects]);

  const loadObjects = async () => {
    try {
      setLoading(true);
      await fetchObjects();
    } catch (error) {
      console.error("Error loading objects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterObjects = () => {
    let filtered = [...objects];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        obj => 
          obj.text?.toLowerCase().includes(query) ||
          obj.brand?.toLowerCase().includes(query) ||
          obj.category?.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.brand) {
      filtered = filtered.filter(obj => 
        obj.brand?.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(obj => 
        obj.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    if (filters.color) {
      filtered = filtered.filter(obj => 
        obj.color?.toLowerCase().includes(filters.color.toLowerCase())
      );
    }
    
    if (filters.shape) {
      filtered = filtered.filter(obj => 
        obj.shape?.toLowerCase().includes(filters.shape.toLowerCase())
      );
    }
    
    if (filters.size) {
      filtered = filtered.filter(obj => 
        obj.size?.toLowerCase().includes(filters.size.toLowerCase())
      );
    }
    
    if (filters.location) {
      filtered = filtered.filter(obj => 
        obj.currentCity?.toLowerCase().includes(filters.location.toLowerCase()) ||
        obj.currentState?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    setFilteredObjects(filtered);
  };

  const navigateToObject = (id: string) => {
    router.push(`/object/${id}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      category: "",
      color: "",
      shape: "",
      size: "",
      location: "",
    });
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search objects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={toggleFilters}
        >
          <Filter size={20} color="#5271ff" />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Brand</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Any brand"
                value={filters.brand}
                onChangeText={(value) => updateFilter("brand", value)}
              />
            </View>
            
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Category</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Any category"
                value={filters.category}
                onChangeText={(value) => updateFilter("category", value)}
              />
            </View>
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Color</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Any color"
                value={filters.color}
                onChangeText={(value) => updateFilter("color", value)}
              />
            </View>
            
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Shape</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Any shape"
                value={filters.shape}
                onChangeText={(value) => updateFilter("shape", value)}
              />
            </View>
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Size</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Any size"
                value={filters.size}
                onChangeText={(value) => updateFilter("size", value)}
              />
            </View>
            
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Location</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Any location"
                value={filters.location}
                onChangeText={(value) => updateFilter("location", value)}
              />
            </View>
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredObjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ObjectListItem object={item} onPress={() => navigateToObject(item.id)} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {objects.length === 0
                ? "No objects detected yet"
                : "No objects match your search"}
            </Text>
            {objects.length === 0 && (
              <TouchableOpacity 
                style={styles.detectButton}
                onPress={() => router.push("/detect")}
              >
                <Text style={styles.detectButtonText}>Detect Objects</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#5271ff",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterItem: {
    width: "48%",
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  filterInput: {
    backgroundColor: "#f7f8fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  detectButton: {
    backgroundColor: "#5271ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  detectButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});