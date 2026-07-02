import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Play, Pause, MoreVertical, FileText, BookOpen, Globe, Headphones } from 'lucide-react-native';
import { THEME } from '../theme';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  type: 'pdf' | 'epub' | 'web' | 'audio';
  progress: number; // 0 to 100
  duration: string;
  coverColor: string;
}

interface BookCardProps {
  item: BookItem;
  isPlaying: boolean;
  onPress: () => void;
  onPlayPress: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  item,
  isPlaying,
  onPress,
  onPlayPress,
}) => {
  const getIcon = () => {
    switch (item.type) {
      case 'pdf': return FileText;
      case 'epub': return BookOpen;
      case 'web': return Globe;
      case 'audio': return Headphones;
    }
  };

  const Icon = getIcon();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* 3D/Tactile Document Cover Preview */}
      <View style={[styles.coverContainer, { backgroundColor: item.coverColor }]}>
        {/* Shadow Overlay / Spine Effect */}
        <View style={styles.spineShadow} />
        <View style={styles.lightGloss} />
        
        {/* Cover Label/Details */}
        <View style={styles.coverContent}>
          <View style={styles.formatBadgeContainer}>
            <Icon size={12} color={THEME.colors.textPrimary} />
            <Text style={styles.formatText}>{item.type.toUpperCase()}</Text>
          </View>
          <Text numberOfLines={3} style={styles.coverTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.coverAuthor}>
            {item.author}
          </Text>
        </View>

        {/* Bottom stripe badge mimicking Stripe Press logo position */}
        <View style={styles.stripeIndicator} />
      </View>

      {/* Book Metadata & Controls */}
      <View style={styles.detailsContainer}>
        <View style={styles.metaRow}>
          <Text style={styles.authorName} numberOfLines={1}>
            {item.author}
          </Text>
          <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MoreVertical size={16} color={THEME.colors.textMuted} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.footerRow}>
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${item.progress}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.progress > 0 ? `${item.progress}% read` : 'Unread'} • {item.duration}
            </Text>
          </View>

          {/* Quick Play Button */}
          <TouchableOpacity
            style={[
              styles.playButton,
              isPlaying && styles.playingButton,
            ]}
            onPress={onPlayPress}
            activeOpacity={0.8}
          >
            {isPlaying ? (
              <Pause size={14} color={THEME.colors.background} fill={THEME.colors.background} />
            ) : (
              <Play size={14} color={THEME.colors.accent} fill={THEME.colors.accent} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  coverContainer: {
    width: 110,
    height: 150,
    position: 'relative',
    justifyContent: 'space-between',
    padding: THEME.spacing.sm + 2,
    overflow: 'hidden',
  },
  spineShadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 2,
  },
  lightGloss: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    zIndex: 2,
  },
  coverContent: {
    flex: 1,
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  formatBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: THEME.spacing.sm,
  },
  formatText: {
    color: THEME.colors.textPrimary,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 3,
    letterSpacing: 0.5,
  },
  coverTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    lineHeight: 14,
    marginBottom: 4,
  },
  coverAuthor: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  stripeIndicator: {
    height: 3,
    width: '40%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1.5,
    alignSelf: 'flex-start',
  },
  detailsContainer: {
    flex: 1,
    padding: THEME.spacing.md,
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: THEME.colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginVertical: THEME.spacing.xs,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.xs,
  },
  progressSection: {
    flex: 1,
    marginRight: THEME.spacing.sm,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: '#1E1E22',
    borderRadius: 1.5,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 1.5,
  },
  progressText: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  playingButton: {
    backgroundColor: THEME.colors.accent,
    borderColor: THEME.colors.accent,
  },
});
