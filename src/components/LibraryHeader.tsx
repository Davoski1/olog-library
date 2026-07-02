import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Search, SlidersHorizontal, BookOpen, Layers, Headphones, FileText, Globe } from 'lucide-react-native';
import { THEME } from '../theme';

interface LibraryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const FILTERS = [
  { id: 'all', label: 'All Library', icon: Layers },
  { id: 'pdf', label: 'PDFs', icon: FileText },
  { id: 'epub', label: 'EPUBs', icon: BookOpen },
  { id: 'web', label: 'Web Links', icon: Globe },
  { id: 'audio', label: 'Audiobooks', icon: Headphones },
];

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <View style={styles.container}>
      {/* Editorial Branding */}
      <View style={styles.brandRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>O</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>OLOG READER</Text>
          <Text style={styles.brandSubtitle}>Curated Intellectual Catalog</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Search & Filter Trigger */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Search size={18} color={THEME.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search catalog, authors, notes..."
            placeholderTextColor={THEME.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardAppearance="dark"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <SlidersHorizontal size={18} color={THEME.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.tab,
                  isActive && styles.activeTab,
                ]}
                onPress={() => setActiveFilter(filter.id)}
                activeOpacity={0.8}
              >
                <Icon
                  size={14}
                  color={isActive ? THEME.colors.background : THEME.colors.textSecondary}
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: THEME.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  logoContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
    backgroundColor: THEME.colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: THEME.spacing.sm + 4,
  },
  logoText: {
    color: THEME.colors.accent,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  brandTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    letterSpacing: 2,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  brandSubtitle: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    opacity: 0.5,
    marginHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 8,
    paddingHorizontal: THEME.spacing.sm,
    height: 42,
  },
  searchIcon: {
    marginRight: THEME.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: THEME.colors.textPrimary,
    fontSize: 14,
    height: '100%',
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: THEME.spacing.sm,
  },
  tabsContainer: {
    marginBottom: THEME.spacing.sm,
  },
  tabsScroll: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    gap: THEME.spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md - 2,
    paddingVertical: THEME.spacing.xs + 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.cardBackground,
  },
  activeTab: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: THEME.colors.background,
    fontWeight: '700',
  },
});
