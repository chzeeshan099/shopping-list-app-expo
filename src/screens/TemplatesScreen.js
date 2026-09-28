import React from 'react';

import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';

import {
  useShopping,
} from '../context/ShoppingContext';

const TemplatesScreen = ({
  navigation,
}) => {
  const {
    templates,
    addTemplate,
  } = useShopping();

  const useTemplate = (
    template
  ) => {
    addTemplate(template);

    Alert.alert(
      'Template Added',
      `${template.name} has been added as a new list.`,
      [
        {
          text: 'OPEN',
          onPress: () =>
            navigation.navigate(
              'ListDetail'
            ),
        },
        {
          text: 'OK',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles
          size={20}
          color="#B6FF00"
        />

        <Text style={styles.kicker}>
          QUICK START
        </Text>
      </View>

      <Text style={styles.title}>
        TEMPLATES
      </Text>

      <Text style={styles.subtitle}>
        Start a list without typing everything.
      </Text>

      <FlatList
        data={templates}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={
          styles.list
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              useTemplate(item)
            }
            style={({ pressed }) => [
              styles.card,
              pressed &&
                styles.pressed,
            ]}
          >
            <View
              style={styles.emojiBox}
            >
              <Text
                style={styles.emoji}
              >
                {item.emoji}
              </Text>
            </View>

            <View
              style={styles.info}
            >
              <Text
                style={styles.name}
              >
                {item.name}
              </Text>

              <Text
                style={styles.count}
              >
                {item.items.length}{' '}
                starter items
              </Text>
            </View>

            <ArrowRight
              size={20}
              color="#B6FF00"
            />
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
    paddingTop: 55,
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  kicker: {
    color: '#B6FF00',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    paddingHorizontal: 20,
    marginTop: 7,
  },

  subtitle: {
    color: '#555',
    fontSize: 11,
    paddingHorizontal: 20,
    marginTop: 4,
  },

  list: {
    padding: 18,
    paddingTop: 20,
  },

  card: {
    minHeight: 84,
    borderRadius: 21,
    backgroundColor: '#151515',
    borderWidth: 1,
    borderColor: '#292929',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  pressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  emojiBox: {
    width: 56,
    height: 56,
    borderRadius: 17,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  emoji: {
    fontSize: 28,
  },

  info: {
    flex: 1,
  },

  name: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  count: {
    color: '#666',
    fontSize: 10,
    marginTop: 5,
  },
});

export default TemplatesScreen;