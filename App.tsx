import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { THEME } from './src/theme';
import { LibraryHeader } from './src/components/LibraryHeader';
import { BookCard, BookItem } from './src/components/BookCard';
import { PlayerWidget } from './src/components/PlayerWidget';
import { ArrowUpRight, Play } from 'lucide-react-native';

const MOCK_CATALOG: BookItem[] = [
  {
    id: '1',
    title: 'High Growth Handbook',
    author: 'Elad Gil',
    type: 'pdf',
    progress: 42,
    duration: '12m left',
    coverColor: '#4C4082',
  },
  {
    id: '2',
    title: 'An Elegant Puzzle: Systems of Engineering Management',
    author: 'Will Larson',
    type: 'epub',
    progress: 68,
    duration: '25m left',
    coverColor: '#0E555A',
  },
  {
    id: '3',
    title: 'The Revolt of the Public and the Crisis of Authority',
    author: 'Martin Gurri',
    type: 'epub',
    progress: 15,
    duration: '1h 40m left',
    coverColor: '#BE4B15',
  },
  {
    id: '4',
    title: 'Designing Systems for Scale & Resilience',
    author: 'Stripe Engineering',
    type: 'web',
    progress: 0,
    duration: '8m read',
    coverColor: '#581140',
  },
  {
    id: '5',
    title: "Poor Charlie's Almanack",
    author: 'Charles T. Munger',
    type: 'audio',
    progress: 85,
    duration: '32m left',
    coverColor: '#8C2B59',
  },
  {
    id: '6',
    title: 'The Making of Prince of Persia',
    author: 'Jordan Mechner',
    type: 'pdf',
    progress: 92,
    duration: '5m left',
    coverColor: '#255D40',
  },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeItem, setActiveItem] = useState<BookItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Playback control toggles
  const handleItemPress = (item: BookItem) => {
    setActiveItem(item);
    setIsPlaying(true);
  };

  const handlePlayPause = (item: BookItem) => {
    if (activeItem?.id === item.id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveItem(item);
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = () => {
    setPlaybackSpeed((prev: number) => {
      if (prev === 1.0) return 1.25;
      if (prev === 1.25) return 1.5;
      if (prev === 1.5) return 2.0;
      return 1.0;
    });
  };

  // Filter and Search logic
  const filteredData = MOCK_CATALOG.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
      item.author.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
    
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Spotlight featured item (Stripe Press inspired design)
  const spotlightItem = MOCK_CATALOG[0];

  const renderSpotlight = () => {
    if (searchQuery || activeFilter !== 'all') return null;

    return (
      <View style={styles.spotlightContainer}>
        <View style={styles.spotlightHeader}>
          <Text style={styles.spotlightLabel}>CURRENT SELECTION</Text>
          <ArrowUpRight size={14} color={THEME.colors.accent} />
        </View>

        <View style={styles.spotlightCard}>
          {/* Spotlight Cover */}
          <View style={[styles.spotlightCover, { backgroundColor: spotlightItem.coverColor }]}>
            <View style={styles.spotlightSpineShadow} />
            <Text style={styles.spotlightCoverTitle}>{spotlightItem.title}</Text>
          </View>

          {/* Spotlight Description */}
          <View style={styles.spotlightContent}>
            <Text style={styles.spotlightTitle}>{spotlightItem.title}</Text>
            <Text style={styles.spotlightAuthor}>by {spotlightItem.author}</Text>
            <Text style={styles.spotlightSnippet}>
              "The best books are not summaries of the state of the art, but guides to building it. Explore Gil's practical advice on scaling teams, executives, and structures."
            </Text>

            <TouchableOpacity
              style={styles.spotlightPlayBtn}
              onPress={() => handleItemPress(spotlightItem)}
              activeOpacity={0.8}
            >
              <Play size={12} color={THEME.colors.background} fill={THEME.colors.background} style={styles.spotlightPlayIcon} />
              <Text style={styles.spotlightPlayText}>Listen Now • {spotlightItem.duration}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.spotlightDivider} />
        <Text style={styles.catalogLabel}>ALL PUBLICATIONS</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Search & Header */}
      <LibraryHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Grid List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard
            item={item}
            isPlaying={isPlaying && activeItem?.id === item.id}
            onPress={() => handleItemPress(item)}
            onPlayPress={() => handlePlayPause(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderSpotlight}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No documents match your query.</Text>
          </View>
        }
      />

      {/* Floating Audio Player */}
      <PlayerWidget
        activeItem={activeItem}
        isPlaying={isPlaying}
        onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
        onClose={() => {
          setIsPlaying(false);
          setActiveItem(null);
        }}
        playbackSpeed={playbackSpeed}
        onChangeSpeed={handleSpeedChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  listContent: {
    padding: THEME.spacing.md,
    paddingBottom: 110, // Extra padding to clear floating player
  },
  spotlightContainer: {
    marginBottom: THEME.spacing.lg,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  spotlightLabel: {
    color: THEME.colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  spotlightCard: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    padding: THEME.spacing.md,
    gap: THEME.spacing.md,
  },
  spotlightCover: {
    width: 90,
    height: 125,
    borderRadius: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.sm,
    overflow: 'hidden',
  },
  spotlightSpineShadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  spotlightCoverTitle: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
  spotlightContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  spotlightTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  spotlightAuthor: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  spotlightSnippet: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 15,
    marginVertical: THEME.spacing.xs + 2,
  },
  spotlightPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: THEME.spacing.sm + 2,
    paddingVertical: THEME.spacing.xs + 3,
    borderRadius: 6,
    marginTop: 2,
  },
  spotlightPlayIcon: {
    marginRight: 6,
  },
  spotlightPlayText: {
    color: THEME.colors.background,
    fontSize: 10,
    fontWeight: '700',
  },
  spotlightDivider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: THEME.spacing.lg,
    opacity: 0.5,
  },
  catalogLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: THEME.spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.xl,
  },
  emptyText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
});
