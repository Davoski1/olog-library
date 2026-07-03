import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { THEME } from './src/theme';
import { LibraryHeader } from './src/components/LibraryHeader';
import { BookItem } from './src/components/BookCard';
import { BookSpineStack } from './src/components/BookSpineStack';
import { PlayerWidget } from './src/components/PlayerWidget';
import { ArrowUpRight, Play } from 'lucide-react-native';
import * as Updates from 'expo-updates';

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
    title: 'An Elegant Puzzle',
    author: 'Will Larson',
    type: 'epub',
    progress: 68,
    duration: '25m left',
    coverColor: '#0E555A',
  },
  {
    id: '3',
    title: 'The Revolt of the Public',
    author: 'Martin Gurri',
    type: 'epub',
    progress: 15,
    duration: '1h 40m left',
    coverColor: '#BE4B15',
  },
  {
    id: '4',
    title: 'Designing Systems for Scale',
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
    title: 'Making of Prince of Persia',
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
  const [activeItem, setActiveItem] = useState<BookItem | null>(MOCK_CATALOG[0]); // Default to first book
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Restart Required',
            'A new update is available and has been downloaded. Restart the app to apply it.',
            [
              {
                text: 'Restart',
                onPress: async () => {
                  await Updates.reloadAsync();
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.warn(`Failed to check/fetch updates: ${error}`);
      }
    }

    // Checking updates is only applicable in production/release builds, not local dev
    if (!__DEV__) {
      onFetchUpdateAsync();
    }
  }, []);

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

  const handleSelectFromStack = (item: BookItem) => {
    setActiveItem(item);
  };

  const renderActiveDetails = () => {
    if (!activeItem) return null;

    return (
      <View style={styles.detailsSection}>
        <View style={styles.spotlightHeader}>
          <Text style={styles.spotlightLabel}>SELECTED DOCUMENT</Text>
          <ArrowUpRight size={14} color={THEME.colors.accent} />
        </View>

        <View style={styles.spotlightCard}>
          {/* Spotlight Cover */}
          <View style={[styles.spotlightCover, { backgroundColor: activeItem.coverColor }]}>
            <View style={styles.spotlightSpineShadow} />
            <Text style={styles.spotlightCoverTitle}>{activeItem.title}</Text>
          </View>

          {/* Spotlight Description */}
          <View style={styles.spotlightContent}>
            <View>
              <Text style={styles.spotlightTitle}>{activeItem.title}</Text>
              <Text style={styles.spotlightAuthor}>by {activeItem.author}</Text>
            </View>
            <Text style={styles.spotlightSnippet} numberOfLines={3}>
              A curated physical volume exploring foundational patterns in engineering, management, and technology. Select options to start listening or reading.
            </Text>

            <TouchableOpacity
              style={styles.spotlightPlayBtn}
              onPress={() => handleItemPress(activeItem)}
              activeOpacity={0.8}
            >
              <Play size={12} color={THEME.colors.background} fill={THEME.colors.background} style={styles.spotlightPlayIcon} />
              <Text style={styles.spotlightPlayText}>Listen Now • {activeItem.duration}</Text>
            </TouchableOpacity>
          </View>
        </View>
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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>INTERACTIVE 3D LIBRARY STACK</Text>
        
        {/* Animated 3D Stack of Book Spines */}
        <BookSpineStack
          books={filteredData}
          selectedBook={activeItem}
          onSelectBook={handleSelectFromStack}
        />

        {/* Dynamic Detail Panel */}
        {renderActiveDetails()}
      </ScrollView>

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
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: 130, // Clearance for floating player
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
    textAlign: 'center',
    opacity: 0.8,
  },
  detailsSection: {
    marginTop: 20,
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
    marginVertical: THEME.spacing.xs,
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
});
