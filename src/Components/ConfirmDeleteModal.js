import React, { useEffect, useRef } from 'react';

import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  AlertTriangle,
  Trash2,
  X,
} from 'lucide-react-native';

const ConfirmDeleteModal = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  const animation = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }).start();
    } else {
      animation.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onCancel}
        />

        <Animated.View
          style={[
            styles.modal,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.iconBox}>
            <AlertTriangle
              size={27}
              color="#B6FF00"
            />
          </View>

          <Pressable
            onPress={onCancel}
            style={styles.closeButton}
          >
            <X
              size={19}
              color="#777777"
            />
          </Pressable>

          <Text style={styles.title}>
            DELETE ITEM?
          </Text>

          <Text style={styles.description}>
            This item will be moved to History.
            You can restore it later.
          </Text>

          <View style={styles.buttons}>
            <Pressable
              onPress={onCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                CANCEL
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={styles.deleteButton}
            >
              <Trash2
                size={17}
                color="#FFFFFF"
              />

              <Text style={styles.deleteText}>
                DELETE
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor:
      'rgba(0,0,0,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  modal: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#151515',
    borderRadius: 28,
    padding: 23,
    borderWidth: 1,
    borderColor: '#303030',
  },

  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#242B00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },

  closeButton: {
    position: 'absolute',
    right: 17,
    top: 17,
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  description: {
    color: '#777777',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },

  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: '#999999',
    fontSize: 11,
    fontWeight: '900',
  },

  deleteButton: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#D93030',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  deleteText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
});

export default ConfirmDeleteModal;