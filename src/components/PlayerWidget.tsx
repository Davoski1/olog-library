import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Play, Pause, SkipForward, Volume2, X } from 'lucide-react-native';
import { THEME } from '../theme';
import { BookItem } from './BookCard';

interface PlayerWidgetProps {
  activeItem: BookItem | null;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onClose: () => void;
  playbackSpeed: number;
  onChangeSpeed: () => void;
}

export const PlayerWidget: React.FC<PlayerWidgetProps> = ({
  activeItem,
  isPlaying,
  onPlayPauseToggle,
  onClose,
  playbackSpeed,
  onChangeSpeed,
}) => {
  if (!activeItem) return null;

  return (
    <View style={styles.floatingContainer}>
      {/* Progress Line */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${activeItem.progress}%` }]} />
      </View>

      <View style={styles.contentRow}>
        {/* Cover Art Miniature */}
        <View style={[styles.miniCover, { backgroundColor: activeItem.coverColor }]}>
          <View style={styles.miniSpineShadow} />
          <Text style={styles.miniCoverLetter}>{activeItem.title[0]}</Text>
        </View>

        {/* Text Metadata */}
        <View style={styles.textSection}>
          <Text numberOfLines={1} style={styles.titleText}>
            {activeItem.title}
          </Text>
          <Text numberOfLines={1} style={styles.authorText}>
            {activeItem.author} • {activeItem.duration}
          </Text>
        </View>

        {/* Action Controls */}
        <View style={styles.controlsSection}>
          {/* Speed Adjuster */}
          <TouchableOpacity style={styles.speedButton} onPress={onChangeSpeed} activeOpacity={0.7}>
            <Text style={styles.speedText}>{playbackSpeed.toFixed(1)}x</Text>
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity style={styles.playButton} onPress={onPlayPauseToggle} activeOpacity={0.8}>
            {isPlaying ? (
              <Pause size={18} color={THEME.colors.background} fill={THEME.colors.background} />
            ) : (
              <Play size={18} color={THEME.colors.background} fill={THEME.colors.background} />
            )}
          </TouchableOpacity>

          {/* Close Widget */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <X size={16} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: THEME.spacing.md,
    right: THEME.spacing.md,
    backgroundColor: 'rgba(19, 19, 21, 0.95)', // Glassmorphism-esque dark background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.35)', // Accent glow border
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  progressTrack: {
    height: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.sm + 4,
    paddingVertical: THEME.spacing.sm,
  },
  miniCover: {
    width: 32,
    height: 42,
    borderRadius: 4,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniSpineShadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  miniCoverLetter: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  textSection: {
    flex: 1,
    marginLeft: THEME.spacing.sm + 2,
    marginRight: THEME.spacing.sm,
  },
  titleText: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  authorText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  controlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  speedButton: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: THEME.colors.border,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  speedText: {
    color: THEME.colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    padding: 2,
  },
});
