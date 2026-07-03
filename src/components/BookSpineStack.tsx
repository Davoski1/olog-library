import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { BookItem } from './BookCard';
import { BookSpine } from './BookSpine';

interface BookSpineStackProps {
  books: BookItem[];
  selectedBook: BookItem | null;
  onSelectBook: (book: BookItem) => void;
}

export const BookSpineStack: React.FC<BookSpineStackProps> = ({
  books,
  selectedBook,
  onSelectBook,
}) => {
  // Animated value for the expansion entry animation (0 = compacted, 1 = expanded)
  const expandProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Trigger staggered or direct spring animation on mount
    Animated.spring(expandProgress, {
      toValue: 1,
      damping: 14,
      mass: 1.2,
      stiffness: 75,
      useNativeDriver: true, // Animating translateY/translateX transforms supports native driver
    }).start();
  }, [expandProgress]);

  return (
    <View style={styles.stackContainer}>
      {/* 3D Perspective Wrapper */}
      <View style={styles.perspectiveWrapper}>
        <View style={styles.spineList}>
          {books.map((book, index) => (
            <BookSpine
              key={book.id}
              item={book}
              index={index}
              isSelected={selectedBook?.id === book.id}
              onPress={() => onSelectBook(book)}
              expandProgress={expandProgress}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stackContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
    marginVertical: 10,
  },
  perspectiveWrapper: {
    width: '90%',
    maxWidth: 420,
    ...Platform.select({
      // We apply 3D transformation to make the entire stack look rotated in space
      ios: {
        transform: [
          { perspective: 1200 },
          { rotateX: '24deg' },
          { rotateY: '-14deg' },
          { rotateZ: '1deg' },
        ],
      },
      android: {
        transform: [
          { perspective: 1200 },
          { rotateX: '24deg' },
          { rotateY: '-14deg' },
          { rotateZ: '1deg' },
        ],
      },
      default: {
        // Web transformation support
        transform: [
          { perspective: 1200 },
          { rotateX: '24deg' },
          { rotateY: '-14deg' },
          { rotateZ: '1deg' },
        ] as any,
      },
    }),
  },
  spineList: {
    width: '100%',
    position: 'relative',
    // We add bottom padding to accommodate the translation expansion offsets
    paddingBottom: 110, 
  },
});
