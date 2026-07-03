import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Platform, TouchableOpacity } from 'react-native';
import { BookItem } from './BookCard';
import { THEME } from '../theme';

export interface BookSpineProps {
  item: BookItem;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  expandProgress: Animated.Value; // Animates from 0 (compacted) to 1 (expanded)
}

// Generate deterministic details based on book title to add realistic variation
const getSpineDetails = (item: BookItem) => {
  const charSum = item.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Custom thickness (between 36 and 52 pixels)
  const thickness = 38 + (charSum % 14); 
  
  // Custom font style (either Serif or Sans)
  const isSerif = charSum % 2 === 0;
  
  // Foil stamp type (Gold, Silver, or Blind Debossed)
  const foilStamp = charSum % 3 === 0 ? '#E5D3B3' : charSum % 3 === 1 ? '#E6E6FA' : 'rgba(255,255,255,0.85)';
  
  // Number of ribs (raised bands) on the spine (3 to 5)
  const ribsCount = 3 + (charSum % 3);

  return { thickness, isSerif, foilStamp, ribsCount };
};

export const BookSpine: React.FC<BookSpineProps> = ({
  item,
  index,
  isSelected,
  onPress,
  expandProgress,
}) => {
  const { thickness, isSerif, foilStamp, ribsCount } = getSpineDetails(item);

  // Animated Translation Y: compact stack vs expanded stack
  // When compacted (progress = 0), books touch each other. 
  // Cumulative height offset is calculated dynamically.
  // When expanded (progress = 1), we add spacing (e.g., index * 18px).
  const spacingMultiplier = 18;
  const translationY = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, index * spacingMultiplier],
  });

  // Animated horizontal pop-out when selected
  const selectAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(selectAnim, {
      toValue: isSelected ? 1 : 0,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const translateX = selectAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });
  
  // Shadow opacity changes as books expand
  const shadowOpacity = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0.3],
  });

  // Generate rib positions
  const ribs = Array.from({ length: ribsCount }).map((_, i) => i);

  return (
    <Animated.View
      style={[
        styles.animatedWrapper,
        {
          transform: [
            { translateY: translationY },
            { translateX: translateX } // Smooth pop-out animation for active selection
          ],
          zIndex: 100 - index, // Top books in stack render in front of bottom books
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={styles.touchable}
      >
        {/* Book shadow projected onto the book below it */}
        <Animated.View
          style={[
            styles.bookShadow,
            {
              height: thickness,
              opacity: shadowOpacity,
            },
          ]}
        />

        {/* Realistic 3D Book Container */}
        <View style={[styles.bookContainer, { height: thickness }]}>
          
          {/* Top Page Edge/Textured Paper (Visible due to 3D perspective angle) */}
          <View style={styles.topPageEdge}>
            <View style={styles.paperTextureLine1} />
            <View style={styles.paperTextureLine2} />
          </View>

          {/* Book Spine (Main Side View) */}
          <View style={[styles.spineBody, { backgroundColor: item.coverColor }]}>
            
            {/* Cylindrical Gradient Shading Overlays */}
            <View style={styles.topCurvedShadow} />
            <View style={styles.bottomCurvedShadow} />
            <View style={styles.centerReflectiveGloss} />

            {/* Left & Right Spine Hinges / Joints */}
            <View style={styles.leftHinge} />
            <View style={styles.rightHinge} />

            {/* Raised Spine Ribs (Vertical bars along spine height) */}
            <View style={styles.ribsContainer}>
              {ribs.map((r) => (
                <View
                  key={r}
                  style={[
                    styles.ribLine,
                    {
                      left: `${20 + r * (60 / (ribsCount - 1))}%`,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Content Stamp (Title & Author) */}
            <View style={styles.spineContent}>
              <Text
                numberOfLines={1}
                style={[
                  styles.spineTitle,
                  {
                    color: foilStamp,
                    fontFamily: isSerif ? (Platform.OS === 'ios' ? 'Georgia' : 'serif') : 'System',
                    fontWeight: isSerif ? 'bold' : '600',
                  },
                ]}
              >
                {item.title}
              </Text>
              
              <Text
                numberOfLines={1}
                style={[
                  styles.spineAuthor,
                  {
                    color: foilStamp,
                    opacity: 0.7,
                  },
                ]}
              >
                •  {item.author}
              </Text>
            </View>

            {/* Selection indicator band */}
            {isSelected && <View style={styles.selectionIndicator} />}
            
            {/* Format Badge Stamp on Spine Right Side */}
            <View style={styles.formatStamp}>
              <Text style={styles.formatText}>{item.type.toUpperCase()}</Text>
            </View>

          </View>

          {/* Spine Rim/Overlap Lip (Simulating physical hardback edges) */}
          <View style={[styles.rimOverlay, { borderColor: item.coverColor }]} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedWrapper: {
    width: '100%',
    position: 'relative',
  },
  touchable: {
    width: '100%',
  },
  bookShadow: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    bottom: -8,
    backgroundColor: '#000',
    borderRadius: 8,
    transform: [{ scaleY: 0.5 }],
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bookContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#EAE6DF', // Creamy pages background
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    zIndex: 2,
  },
  topPageEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#EAE6DF',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    zIndex: 4,
  },
  paperTextureLine1: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: 1,
  },
  paperTextureLine2: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    marginTop: 1,
  },
  spineBody: {
    flex: 1,
    marginTop: 4, // Leave space for top page edge
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topCurvedShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0,0,0,0.22)',
    zIndex: 3,
  },
  bottomCurvedShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 3,
  },
  centerReflectiveGloss: {
    position: 'absolute',
    top: '35%',
    bottom: '35%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
    zIndex: 3,
  },
  leftHinge: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 4,
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  rightHinge: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 4,
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },
  ribsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 4,
  },
  ribLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.07)',
  },
  spineContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 40,
    zIndex: 5,
  },
  spineTitle: {
    fontSize: 12,
    letterSpacing: 0.8,
  },
  spineAuthor: {
    fontSize: 10,
    marginLeft: 8,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: THEME.colors.accent,
    zIndex: 6,
  },
  formatStamp: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 5,
  },
  formatText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  rimOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    opacity: 0.9,
    zIndex: 5,
    pointerEvents: 'none',
  },
});
